"""Turn the raw generated images into the page's assets.

Drop PNG/JPG/WebP files into assets/raw/ with these names (any extension):
  paper, highlighter, circle, arrow, torn   -> ink on white, or a plain texture
  tape, pin, cutout                          -> objects on solid magenta (#FF00FF) or green
  map                                        -> plain image
Then run: npm run assets   (or: python scripts/prep_assets.py)
Output goes to public/vox/*.webp, replacing the placeholders. Missing inputs are skipped.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

RAW = Path("assets/raw")
OUT = Path("public/vox")
INK = ["highlighter", "circle", "arrow", "torn"]
KEYED = ["pin", "cutout", "tape"]


def find(name):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = RAW / f"{name}{ext}"
        if p.exists():
            return p
    return None


def crop(img, pad=8):
    box = img.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    if not box:
        return img
    l, t, r, b = box
    return img.crop((max(0, l - pad), max(0, t - pad), min(img.width, r + pad), min(img.height, b + pad)))


def fit(img, longest):
    s = longest / max(img.size)
    return img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS) if s < 1 else img


def save(img, name):
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / f"{name}.webp", quality=90, method=6)
    print(f"  wrote {OUT / name}.webp  {img.size[0]}x{img.size[1]}")


def ink_to_alpha(path):
    """Brightness becomes alpha: dark ink stays, white paper disappears."""
    g = np.asarray(Image.open(path).convert("L"), dtype=float)
    a = ((255 - g) - 25) * (255 / 200)
    a = a.clip(0, 255).astype("uint8")
    rgba = np.zeros((*a.shape, 4), dtype="uint8")
    rgba[..., 3] = a
    return crop(Image.fromarray(rgba, "RGBA"))


def chroma_key(path):
    """Key out a solid magenta or green background, with despill on the edges."""
    rgb = np.asarray(Image.open(path).convert("RGB"), dtype=float)
    h, w, _ = rgb.shape
    corners = np.concatenate([rgb[:12, :12], rgb[:12, -12:], rgb[-12:, :12], rgb[-12:, -12:]]).reshape(-1, 3)
    key = np.median(corners, axis=0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    magenta = key[0] > key[1] and key[2] > key[1]

    if magenta:
        # How much more red+blue than green a pixel has, relative to the key.
        spill = np.minimum(r, b) - g
        ref = min(key[0], key[2]) - key[1]
    else:
        spill = g - np.maximum(r, b)
        ref = key[1] - max(key[0], key[2])
    ratio = (spill / max(ref, 1)).clip(0, 1)
    alpha = ((1 - ratio) * 255 - 20) * (255 / 200)
    alpha = alpha.clip(0, 255)

    out = rgb.copy()
    if magenta:
        excess = (np.minimum(r, b) - g).clip(0, None)
        out[..., 0] = r - excess
        out[..., 2] = b - excess
    else:
        out[..., 1] = np.minimum(g, np.maximum(r, b))
    rgba = np.dstack([out.clip(0, 255), alpha]).astype("uint8")
    return Image.fromarray(rgba, "RGBA")


def split_pieces(img, want=3):
    """Split an image of separate objects (the three tapes) by empty rows or columns."""
    a = np.asarray(img.getchannel("A")) > 30
    best = []
    for axis in (0, 1):  # 0: pieces side by side (scan columns), 1: stacked (scan rows)
        filled = a.any(axis=axis)
        runs, start = [], None
        for i, f in enumerate(filled):
            if f and start is None:
                start = i
            if not f and start is not None:
                runs.append((start, i))
                start = None
        if start is not None:
            runs.append((start, len(filled)))
        runs = [rn for rn in runs if rn[1] - rn[0] > 20]
        if len(runs) > len(best):
            best = [(axis, rn) for rn in runs]
    pieces = []
    for axis, (s, e) in best[:want]:
        box = (s, 0, e, img.height) if axis == 0 else (0, s, img.width, e)
        pieces.append(crop(img.crop(box)))
    return pieces


def main():
    if not RAW.exists():
        sys.exit(f"Put raw images in {RAW}/ first.")
    print(f"Reading {RAW}/")

    p = find("paper")
    if p:
        img = Image.open(p).convert("RGB")
        side = min(img.size)
        img = img.crop(((img.width - side) // 2, (img.height - side) // 2, (img.width + side) // 2, (img.height + side) // 2))
        save(img.resize((1024, 1024), Image.LANCZOS), "paper")

    for name in INK:
        p = find(name)
        if p:
            save(fit(ink_to_alpha(p), 1600), name)

    for name in KEYED:
        p = find(name)
        if not p:
            continue
        img = chroma_key(p)
        if name == "tape":
            pieces = split_pieces(img)
            if len(pieces) < 3:
                print(f"  tape: found {len(pieces)} piece(s), expected 3; reusing")
            for i in range(3):
                if pieces:
                    save(fit(pieces[i % len(pieces)], 600), f"tape-{i + 1}")
        else:
            save(fit(crop(img), 1200 if name == "cutout" else 400), name)

    p = find("map")
    if p:
        save(fit(Image.open(p).convert("RGB"), 2400), "map")


if __name__ == "__main__":
    main()
