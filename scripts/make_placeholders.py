"""Crude stand-ins for the Vox assets, so the page works before the real ones exist.

Run once: python -I scripts/make_placeholders.py
Real assets from scripts/prep_assets.py overwrite these files with the same names.
"""
import math
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "public/vox")
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)
random.seed(7)


def save(img, name):
    img.save(OUT / f"{name}.webp", quality=88)
    print("wrote", OUT / f"{name}.webp")


def ink(size, draw_fn, blur=1.2):
    """Black ink on transparent: draw white-on-black as alpha, then fill black."""
    a = Image.new("L", size, 0)
    draw_fn(ImageDraw.Draw(a))
    a = a.filter(ImageFilter.GaussianBlur(blur))
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    img.putalpha(a)
    return img


# paper: warm off-white with fibres
n = rng.normal(0, 1, (512, 512))
n = np.array(Image.fromarray(((n * 20) + 128).clip(0, 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.8)))
base = np.array([236, 233, 227], dtype=float)
paper = (base[None, None, :] + (n[..., None] - 128) * 0.06).clip(0, 255).astype("uint8")
save(Image.fromarray(paper, "RGB"), "paper")

# grain: sparse, faint speckles on transparent
g = rng.random((256, 256))
alpha = ((g > 0.97) * rng.integers(10, 35, (256, 256))).astype("uint8")
grain = Image.new("RGBA", (256, 256), (30, 25, 20, 0))
grain.putalpha(Image.fromarray(alpha))
save(grain, "grain")


def highlighter(d):
    w, h = 900, 300
    pts = [(30, 60)]
    for x in range(30, w - 40, 30):
        pts.append((x, 60 + random.randint(-6, 6)))
    pts += [(w - 30, 40), (w - 70, 250)]
    for x in range(w - 70, 30, -30):
        pts.append((x, 240 + random.randint(-6, 6)))
    d.polygon(pts, fill=230)
    d.ellipse((10, 50, 90, 250), fill=255)


save(ink((900, 300), highlighter), "highlighter")


def ellipse(d):
    cx, cy, rx, ry = 400, 200, 360, 160
    pts = []
    for i in range(0, 400):
        t = i / 360 * 2 * math.pi + 0.3
        k = 1 + 0.04 * math.sin(t * 3) + (i / 400) * 0.06
        pts.append((cx + rx * k * math.cos(t), cy + ry * k * math.sin(t)))
    d.line(pts, fill=255, width=16, joint="curve")


save(ink((800, 400), ellipse), "circle")


def arrow(d):
    pts = [(60 + i * 6, 300 - 140 * math.sin(i / 100 * math.pi * 0.8)) for i in range(101)]
    d.line(pts, fill=255, width=14, joint="curve")
    ex, ey = pts[-1]
    d.line([(ex - 70, ey - 40), (ex, ey), (ex - 30, ey + 70)], fill=255, width=14, joint="curve")


save(ink((800, 400), arrow), "arrow")


def torn(d):
    w, h = 1600, 200
    top = [(x, 40 + random.randint(-14, 14)) for x in range(0, w + 1, 12)]
    bot = [(x, 160 + random.randint(-14, 14)) for x in range(w, -1, -12)]
    d.polygon(top + bot, fill=255)


save(ink((1600, 200), torn, blur=0.6), "torn")

# tape: beige translucent strips with torn ends
for i in range(1, 4):
    w, h = 360, 110
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    left = [(random.randint(0, 14), y) for y in range(0, h + 1, 10)]
    right = [(w - random.randint(0, 14), y) for y in range(h, -1, -10)]
    d.polygon(left + right, fill=(228, 214, 180, 190))
    save(img, f"tape-{i}")

# pin: red head with a highlight and a short needle
img = Image.new("RGBA", (200, 260), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.line([(100, 140), (112, 250)], fill=(150, 150, 150, 255), width=6)
d.ellipse((30, 20, 170, 160), fill=(215, 40, 35, 255))
d.ellipse((60, 40, 100, 80), fill=(255, 140, 130, 200))
save(img, "pin")

# map: halftone ocean with a blobby land mass; India sits near (64%, 55%)
W, H = 2000, 1100
img = Image.new("RGB", (W, H), (226, 222, 214))
d = ImageDraw.Draw(img)
for y in range(0, H, 18):
    for x in range(0, W, 18):
        d.ellipse((x, y, x + 5, y + 5), fill=(196, 192, 184))
for cx, cy, rx, ry in [(400, 380, 260, 220), (560, 800, 140, 230), (1050, 330, 200, 160),
                       (1100, 680, 170, 250), (1450, 360, 420, 230), (1300, 600, 90, 120),
                       (1700, 860, 150, 90)]:
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(206, 200, 190), outline=(90, 85, 80), width=3)
save(img, "map")

# cut-out: grey head-and-shoulders silhouette with a white border
img = Image.new("RGBA", (800, 900), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.ellipse((180, 60, 620, 560), fill=(255, 255, 255, 255))
d.ellipse((60, 520, 740, 1200), fill=(255, 255, 255, 255))
d.ellipse((215, 95, 585, 525), fill=(70, 70, 70, 255))
d.ellipse((95, 555, 705, 1165), fill=(40, 40, 40, 255))
save(img, "cutout")
