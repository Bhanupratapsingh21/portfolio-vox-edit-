// The clock. One rAF loop writes a single number per chapter, --p (0 when its
// stage pins, 1 when it lets go). CSS turns --p into every other motion.
// Cameras ([data-cam]) are the only transforms written from JS.

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

function camAt(keys, p) {
  if (p <= keys[0][0]) return keys[0].slice(1);
  const last = keys[keys.length - 1];
  if (p >= last[0]) return last.slice(1);
  let i = 0;
  while (p > keys[i + 1][0]) i++;
  const [a, b] = [keys[i], keys[i + 1]];
  const t = smooth((p - a[0]) / (b[0] - a[0]));
  return a.slice(1).map((v, k) => v + (b[k + 1] - v) * t);
}

function writeCam(cam, p, phone) {
  // A camera can carry its own phone path (data-cam-phone), used as written.
  if (phone && cam.phoneKeys) {
    const [x, y, s, r] = camAt(cam.phoneKeys, p);
    cam.el.style.transform = `translate(${x}%, ${y}%) scale(${s}) rotate(${r}deg)`;
    return;
  }
  let [x, y, s, r] = camAt(cam.keys, p);
  if (phone) {
    // Zoom, drift and tilt are calmer on phones; whole-panel pans are not.
    if (!cam.pan) x *= 0.35;
    y *= 0.35;
    s = 1 + (s - 1) * 0.35;
    r *= 0.35;
  }
  cam.el.style.transform = `translate(${x}%, ${y}%) scale(${s}) rotate(${r}deg)`;
}

export function startVox(root) {
  const beats = [...root.querySelectorAll("[data-beat]")].map((el) => ({
    el,
    p: 0,
    last: -1,
    intro: el.hasAttribute("data-intro"),
    cams: [...el.querySelectorAll("[data-cam]")].map((c) => ({
      el: c,
      keys: JSON.parse(c.dataset.cam),
      phoneKeys: c.dataset.camPhone ? JSON.parse(c.dataset.camPhone) : null,
      pan: c.hasAttribute("data-pan"),
    })),
  }));

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const b of beats) b.el.style.setProperty("--p", "1");
    return () => {};
  }

  const turbulence = root.querySelector("#boil-noise");
  const start = performance.now();
  let prev = start;
  let lastTexture = 0;
  let frame = 0;
  let raf;

  const tick = (now) => {
    const dt = Math.min(0.1, (now - prev) / 1000);
    prev = now;
    const vh = innerHeight;
    const phone = innerWidth < 700;
    const follow = 1 - Math.exp(-dt * 9);

    for (const b of beats) {
      const r = b.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > 2 * vh) continue;
      const range = Math.max(1, r.height - vh);
      let target = clamp01(-r.top / range);
      // The title plays its first half on load (0 → .5); scrolling drives the second half.
      if (b.intro) target = clamp01(Math.min(0.5, (now - start - 250) / 4400) + 0.5 * target);
      b.p += (target - b.p) * follow;
      if (Math.abs(target - b.p) < 0.0004) b.p = target;
      if (Math.abs(b.p - b.last) < 0.0002) continue;
      b.last = b.p;
      b.el.style.setProperty("--p", b.p.toFixed(4));
      for (const cam of b.cams) writeCam(cam, b.p, phone);
    }

    // Texture on twos: boil and grain step 12 times a second, motion stays smooth.
    if (now - lastTexture > 1000 / 12) {
      lastTexture = now;
      frame++;
      if (turbulence && frame % 2 === 0) turbulence.setAttribute("seed", String(frame % 7));
      root.style.setProperty("--grain-x", `${(frame * 37) % 240}px`);
      root.style.setProperty("--grain-y", `${(frame * 53) % 240}px`);
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
