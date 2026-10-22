import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { startVox } from "./engine.js";
import { builds, chapters, end, links, receipt, timeline, title, world } from "./content.js";

// A timed piece: its own --t runs 0 → 1 while the chapter's --p moves from a to b.
const win = (a, b, extra) => ({ "--a": a, "--b": b, ...extra });
const cam = (keys) => JSON.stringify(keys);
const str = (s = "") => `"${s}"`;

function Beat({ len, intro, className = "", children }) {
  return (
    <section className={`beat ${className}`} data-beat="" data-intro={intro ? "" : undefined} style={{ "--len": len }}>
      <div className="stage">{children}</div>
    </section>
  );
}

function Hl({ a, b, children }) {
  return <mark className="hl k" style={win(a, b)}>{children}</mark>;
}

function Tape({ i, a, b, style }) {
  return <img className="tape slap k" src={`/vox/tape-${i}.webp`} alt="" style={{ ...win(a, b), ...style }} />;
}

function Filters() {
  return (
    <svg className="defs" aria-hidden="true">
      <filter id="boil">
        <feTurbulence id="boil-noise" type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="1" />
        <feDisplacementMap in="SourceGraphic" scale="4" />
      </filter>
    </svg>
  );
}

// A tape measure down the right edge that pulls out as you scroll.
function Measure() {
  return (
    <div className="measure" aria-hidden="true">
      <div className="measure-tape">
        <span className="measure-read" />
      </div>
    </div>
  );
}

// Chapter cards rip in half along a jagged tear and fly apart.
const tear = Array.from({ length: 19 }, (_, i) => `${50 + (i % 2 ? 2.6 : -2.6) + ((i * 7) % 3) - 1}% ${(i * 100) / 18}%`).join(", ");
const TEAR_L = `polygon(0 0, ${tear}, 0 100%)`;
const TEAR_R = `polygon(100% 0, ${tear}, 100% 100%)`;

function ChapterCard({ ch }) {
  const face = (
    <div className="card-face">
      <span className="card-n">{ch.n}</span>
      <h2>{ch.name}</h2>
    </div>
  );
  return (
    <div className="card k" style={win(0.04, 0.13, { "--c": ch.color, color: ch.ink })} aria-hidden="true">
      <div className="card-half left" style={{ clipPath: TEAR_L }}>{face}</div>
      <div className="card-half right" style={{ clipPath: TEAR_R }}>{face}</div>
    </div>
  );
}

// The title plays 0 → .5 by itself on load; scrolling runs .5 → 1, where the pieces scatter off-screen.
function Title() {
  const words = title.lead.split(" ");
  const w = title.win;
  const tick = [...title.ticker, ...title.ticker];
  return (
    <Beat len={2.2} intro className="title">
      <div className="mark">{title.mark}</div>
      <div className="exit k" style={win(0.56, 1, { "--dx": "-70vw", "--rot": "-6deg" })}>
        <div className="title-copy">
          <span className="chip slap k" style={win(0.01, 0.06, { "--r": "-2deg" })}>{title.kicker}</span>
          <h1>
            {words.map((word, i) => (
              <span key={i} className="word slap k" style={win(0.04 + i * 0.012, 0.09 + i * 0.012, { "--r": `${((i % 3) - 1) * 2.5}deg` })}>
                {word}
              </span>
            ))}{" "}
            <Hl a={0.22} b={0.32}>{title.highlight}</Hl>
          </h1>
          <p className="lede slap k" style={win(0.16, 0.24)}>{title.sub}</p>
        </div>
      </div>
      <div className="exit k" style={win(0.56, 1, { "--dx": "70vw", "--rot": "8deg" })}>
        <figure className="cutout slap k" style={win(0.06, 0.16, { "--r": "3deg" })}>
          <div className="tilt">
            <img src="/vox/cutout.webp" alt="Bhanu Pratap Singh as a halftone newspaper cut-out" />
          </div>
          <Tape i={1} a={0.15} b={0.21} style={{ "--r": "-7deg", top: "-3%", left: "34%" }} />
        </figure>
        <div className="yc slap k" style={win(0.27, 0.35, { "--r": "-4deg" })}>
          <Tape i={3} a={0.33} b={0.38} style={{ "--r": "10deg", top: "-16%", right: "8%" }} />
          <span className="yc-kicker">{w.kicker}</span>
          <strong>{w.big}</strong>
          <p>{w.body}</p>
        </div>
      </div>
      <div className="exit k" style={win(0.5, 0.95, { "--dy": "60vh", "--rot": "4deg" })}>
        <div className="ticker one grow k" style={win(0.3, 0.42)}>
          <div className="ticker-run">
            {tick.map((t, i) => (
              <span key={i}>{t} ✶</span>
            ))}
          </div>
        </div>
        <div className="ticker two grow k" style={win(0.36, 0.48)}>
          <div className="ticker-run reverse">
            {tick.map((t, i) => (
              <span key={i}>{t} ✶</span>
            ))}
          </div>
        </div>
      </div>
      <a className="tag-link" href={links.site}>bpss.in →</a>
      <div className="hint">Scroll to play ↓</div>
    </Beat>
  );
}

// 01: a thermal receipt that rises out of a printer, numbers counting as they print.
function Receipts() {
  const at = (i) => 0.3 + i * 0.041;
  return (
    <Beat len={5} className="receipts">
      <ChapterCard ch={chapters[0]} />
      <div className="printer-frame">
        <div className="printer-cam" data-cam={cam([[0.84, 0, 0, 1, 0], [0.93, 0, 0, 0.8, -1.5]])}>
          <div className="feed">
            <div className="paper k" style={win(0.12, 0.86)}>
              <header className="rc-head">
                <strong>{receipt.store}</strong>
                <span>{receipt.sub}</span>
                <span className="rc-meta">
                  {receipt.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </span>
              </header>
              <div className="rc-rule" />
              {receipt.lines.map((l, i) => (
                <div className="rc-row" key={l.label}>
                  <span className="rc-label">{l.label}</span>
                  {l.to != null ? (
                    <span className="count k" style={win(at(i), at(i) + 0.05, { "--to": l.to, "--pre": str(l.pre), "--post": str(l.post) })}>
                      {l.circle && <span className="ring k" style={win(at(i) + 0.05, at(i) + 0.11)} />}
                    </span>
                  ) : (
                    <span className="rc-val">{l.text}</span>
                  )}
                </div>
              ))}
              <div className="rc-rule" />
              <div className="rc-row rc-total">
                <span>{receipt.total.label}</span>
                <Hl a={0.76} b={0.84}>{receipt.total.value}</Hl>
              </div>
              <div className="barcode" />
              {receipt.footer.map((f) => (
                <p className="rc-foot" key={f}>{f}</p>
              ))}
            </div>
          </div>
          <div className="printer">
            <span>BPSS-80 · thermal</span>
            <i className="led" />
          </div>
        </div>
      </div>
    </Beat>
  );
}

// 02: the career as a git log. The graph draws itself while the camera pans commit to commit.
function CommitLog() {
  const n = timeline.length;
  const start = (i) => 0.12 + i * 0.17;
  const step = 100 / n;
  const x = (i) => ((i * 100 + 7) / (n * 100)) * 1000;
  const keys = [];
  timeline.slice(1).forEach((_, i) => {
    const hold = start(i) + 0.145;
    keys.push([hold, -step * i, 0, 1, 0], [hold + 0.025, -step * (i + 1), 0, 1, 0]);
  });
  const fork = timeline.findIndex((t) => t.branch);
  return (
    <Beat len={6} className="climb">
      <ChapterCard ch={chapters[1]} />
      <div className="track" data-pan="" data-cam={cam(keys)} style={{ "--n": n }}>
        <svg className="git" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="git-line k" style={win(0.06, 0.9)} pathLength="1" d={`M0 50 L1000 50`} />
          {fork > 0 && (
            <path
              className="git-line branch k"
              style={win(start(fork) - 0.06, start(fork))}
              pathLength="1"
              d={`M${x(fork - 1) + 40} 50 C${x(fork - 1) + 110} 50 ${x(fork) - 70} 12 ${x(fork)} 12 L1000 12`}
            />
          )}
        </svg>
        {timeline.map((t, i) => (
          <div
            key={t.hash}
            className={`commit slap k${t.branch ? " on-branch" : ""}`}
            style={win(start(i) - 0.02, start(i) + 0.02, { left: `calc(${i * 100}vw + 7vw)` })}
          >
            <i />
            <code>{t.hash}</code>
            <span>{t.msg}</span>
          </div>
        ))}
        {timeline.map((t, i) => {
          const s = start(i);
          return (
            <article className="panel" key={t.org}>
              <div className="when slap k" style={win(s, s + 0.04)}>{t.when}</div>
              <div className={`shot slap k${t.logo ? " has-logo" : ""}`} style={win(s + 0.02, s + 0.06, { "--r": i % 2 ? "2deg" : "-2deg" })}>
                {t.logo && <img className="shot-logo" src={t.logo} alt={`${t.org} logo`} />}
                {(!t.logo || t.logoText) && <span>{t.org}</span>}
                {t.stamp && <span className="stamp slap k" style={win(s + 0.11, s + 0.14, { "--r": "-14deg" })}>{t.stamp}</span>}
              </div>
              <div className="side">
                <div className="job slap k" style={win(s + 0.06, s + 0.1, { "--r": "1deg" })}>
                  <h3>{t.role}</h3>
                  <p>{t.body}</p>
                  {t.steps && (
                    <ol className="steps">
                      {t.steps.map(([d, what]) => (
                        <li key={d}>
                          <span>{d}</span> {what}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                <div className="stat slap k" style={win(s + 0.09, s + 0.13, { "--r": "-3deg" })}>{t.stat}</div>
              </div>
            </article>
          );
        })}
      </div>
      <a className="door-link slap k" href={links.work} style={win(0.95, 0.99)}>git log --all → full work history</a>
    </Beat>
  );
}

// 03: an evidence board. Clippings are pinned, then red string runs from Newral to everything built through it.
function EvidenceBoard() {
  const { featured, minor, hub, hubLinks } = builds;
  const wrap = useRef(null);
  const [geo, setGeo] = useState({ w: 0, h: 0, pins: {}, strings: [] });
  const featuredAt = (i) => 0.18 + i * 0.065;
  const minorAt = (i) => 0.52 + i * 0.04;

  useLayoutEffect(() => {
    // Measure with offsets (layout boxes), so slap rotations and the camera don't skew the numbers.
    const measure = () => {
      const el = wrap.current;
      if (!el) return;
      const pins = {};
      el.querySelectorAll("[data-name]").forEach((c) => {
        if (!c.offsetParent) return;
        pins[c.dataset.name] = [c.offsetLeft + c.offsetWidth / 2, c.offsetTop + 6];
      });
      const h = pins[hub];
      const strings = h
        ? hubLinks
            .filter((name) => pins[name])
            .map((name) => {
              const p = pins[name];
              const sag = 40 + Math.abs(p[0] - h[0]) * 0.08;
              return { name, d: `M${h[0]} ${h[1]} Q${(h[0] + p[0]) / 2} ${Math.max(h[1], p[1]) + sag} ${p[0]} ${p[1]}` };
            })
        : [];
      setGeo({ w: el.offsetWidth, h: el.offsetHeight, pins, strings });
    };
    measure();
    document.fonts?.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [hub, hubLinks]);

  const pinWindow = (name) => {
    const fi = featured.findIndex((f) => f.name === name);
    if (fi >= 0) return featuredAt(fi) + 0.03;
    return minorAt(minor.findIndex((m) => m.name === name)) + 0.02;
  };

  return (
    <Beat len={4.5} className="builds">
      <ChapterCard ch={chapters[2]} />
      <div className="cam-frame">
        <div className="cam" data-cam={cam([[0.12, 0, 4, 1.05, -1], [0.58, 0, 0, 1, 0], [0.76, -10, -3, 1.16, 0], [0.88, -10, -3, 1.16, 0], [0.95, 0, 0, 1, 0]])}>
          <h3 className="board-title slap k" style={win(0.12, 0.17, { "--r": "-1deg" })}>
            Exhibit A: built <Hl a={0.15} b={0.2}>zero to one</Hl>
          </h3>
          <div className="board-wrap" ref={wrap}>
            <div className="board">
              {featured.map((b, i) => (
                <div key={b.name} data-name={b.name} className={`clip feature slap k${b.star ? " star" : ""}`} style={win(featuredAt(i), featuredAt(i) + 0.05, { "--r": `${b.r}deg` })}>
                  <span className="clip-tag">{b.tag}</span>
                  <div className="clip-name">
                    {b.logo && <img src={b.logo} alt={b.logoOnly ? b.name : ""} className={b.logoOnly ? "wordmark" : "mark-icon"} />}
                    {!b.logoOnly && <strong>{b.name}</strong>}
                  </div>
                  <p>{b.line}</p>
                  {b.star && (
                    <>
                      <span className="ring wide k" style={win(0.76, 0.84)} />
                      <span className="note slap k" style={win(0.84, 0.9, { "--r": "-4deg" })}>Top 10 of 30,000+</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="minor">
              {minor.map((m, i) => (
                <div key={m.name} data-name={m.name} className="clip small slap k" style={win(minorAt(i), minorAt(i) + 0.04, { "--r": `${(i - 1) * 1.5}deg` })}>
                  {m.logo ? <img src={m.logo} alt={m.name} className="wordmark" /> : <strong>{m.name}</strong>}
                  <p>{m.line}</p>
                </div>
              ))}
            </div>
            <svg className="strings" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w || 1} ${geo.h || 1}`} aria-hidden="true">
              {geo.strings.map((s, i) => (
                <path key={s.name} className="string k" style={win(0.6 + i * 0.025, 0.66 + i * 0.025)} pathLength="1" d={s.d} />
              ))}
            </svg>
            {Object.entries(geo.pins).map(([name, [px, py]]) => (
              <img key={name} className="board-pin drop k" src="/vox/pin.webp" alt="" style={win(pinWindow(name), pinWindow(name) + 0.03, { left: px, top: py })} />
            ))}
          </div>
        </div>
      </div>
      <a className="door-link slap k" href={links.site} style={win(0.93, 0.98)}>See every project on bpss.in →</a>
    </Beat>
  );
}

function Clocks() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const time = (timeZone) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(now);
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone || world.homeZone;
  const place = local.split("/").pop().replace(/_/g, " ");
  return (
    <div className="clocks">
      <div className="clock">
        <span>Bhanu · India</span>
        <strong>{time(world.homeZone)}</strong>
      </div>
      <div className="clock you">
        <span>You · {place}</span>
        <strong>{time(local)}</strong>
      </div>
    </div>
  );
}

// 04: flight arcs leave India for the places the work can reach, with live clocks for both ends.
function World() {
  const { india, flights } = world;
  const H = 56.28; // map.webp is 1672 × 941, so the SVG is 100 × 56.28 units
  const arc = (f) => {
    const [x1, y1, x2, y2] = [india.x, (india.y * H) / 100, f.x, (f.y * H) / 100];
    const lift = Math.hypot(x2 - x1, y2 - y1) * 0.35;
    return `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - lift} ${x2} ${y2}`;
  };
  const s = 2.2;
  const fx = -s * (india.x - 50);
  const fy = -s * (india.y - 50);
  const centre = (z) => [-z * (india.x - 50), -z * (india.y - 50), z];
  return (
    <Beat len={4} className="world">
      <ChapterCard ch={chapters[3]} />
      <div className="map-frame">
        <div
          className="cam map-cam"
          data-cam={cam([[0.1, fx, fy, s, -1], [0.34, fx, fy, s, 0], [0.56, 0, 0, 1.04, 0], [1, 0, 0, 1, 0]])}
          data-cam-phone={cam([[0.1, ...centre(2), 0], [0.34, ...centre(2), 0], [0.56, ...centre(0.62), 0]])}
        >
          <img className="map" src="/vox/map.webp" alt="Map of the world with flight paths from India" />
          <svg className="flights" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {flights.map((f, i) => (
              <g key={f.city}>
                <mask id={`fly-${i}`} maskUnits="userSpaceOnUse" x="0" y="-20" width="100" height={H + 40}>
                  <path className="flight-reveal k" style={win(0.56 + i * 0.04, 0.66 + i * 0.04)} pathLength="1" d={arc(f)} />
                </mask>
                <path className="flight" mask={`url(#fly-${i})`} d={arc(f)} />
              </g>
            ))}
          </svg>
          <img className="pin drop k" src="/vox/pin.webp" alt="" style={win(0.14, 0.22, { left: `${india.x}%`, top: `${india.y}%` })} />
          {flights.map((f, i) => (
            <span key={f.city} className="city slap k" style={win(0.64 + i * 0.04, 0.68 + i * 0.04, { left: `${f.x}%`, top: `${f.y}%` })}>
              {f.city}
            </span>
          ))}
        </div>
      </div>
      <div className="world-copy">
        <span className="chip slap k" style={win(0.22, 0.3, { "--r": "-2deg" })}>{world.based}</span>
        <p className="world-open slap k" style={win(0.4, 0.46)}>
          <Hl a={0.46} b={0.56}>{world.open}</Hl>
        </p>
        <div className="slap k" style={win(0.82, 0.88, { "--r": "-2deg" })}>
          <Clocks />
        </div>
        <p className="world-roles slap k" style={win(0.86, 0.9, { "--r": "-1deg" })}>{world.roles}</p>
        <p className="world-gh slap k" style={win(0.88, 0.92, { "--r": "1deg" })}>{world.github}</p>
      </div>
      <a className="door-link slap k" href={links.blog} style={win(0.93, 0.98)}>Read the engineering writing →</a>
    </Beat>
  );
}

// End: an envelope opens, the letter rises out, and the links are postage stamps.
function End() {
  return (
    <Beat len={2.6} className="end">
      <div className="post">
        <div className="env">
        {/* Back, letter, front pocket, flap: stacked so the letter rises out of the pocket. */}
        <div className="env-piece k" style={win(0.5, 0.66, { zIndex: 0 })}>
          <div className="env-back" />
        </div>
        <div className="env-piece k" style={win(0.5, 0.66, { zIndex: 3 })}>
          <div className="env-front" />
        </div>
        <div className="env-piece k" style={win(0.5, 0.66, { zIndex: "calc(4 - clamp(0, (var(--p) - 0.06) / 0.14, 1) * 3)" })}>
          <div className="env-flap k" style={win(0.06, 0.2)} />
        </div>
        <div className="letter-drop k" style={win(0.5, 0.66, { zIndex: 2 })}>
          <div className="letter k" style={win(0.2, 0.46)}>
            <span className="postmark">India · Oct 2026</span>
            <h2 className="end-title">
              {end.lead} <Hl a={0.6} b={0.7}>{end.tail}</Hl>
            </h2>
            <p className="letter-note">{end.note}</p>
            <div className="stamps">
              {end.doors.map((d, i) => (
                <a
                  key={d.label}
                  className="stamp-link slap k"
                  href={d.href}
                  style={win(0.68 + i * 0.05, 0.76 + i * 0.05, { "--c": d.color, "--r": `${(i - 1) * 3}deg`, color: d.ink })}
                >
                  <span className="stamp-face">
                    <small>21</small>
                    <strong>{d.label}</strong>
                    <span>{d.sub}</span>
                  </span>
                </a>
              ))}
            </div>
            <span className="sign">{end.sign}</span>
          </div>
        </div>
        </div>
      </div>
      <nav className="end-links">
        <a href={links.email}>Email</a>
        <a href={links.linkedin}>LinkedIn</a>
        <a href={links.x}>X</a>
        <a href={links.instagram}>Instagram</a>
        <a href={links.site}>bpss.in</a>
      </nav>
      <p className="credit">© 2026 Bhanu Pratap Singh. Company logos belong to their owners.</p>
    </Beat>
  );
}

export default function App() {
  const root = useRef(null);
  useEffect(() => startVox(root.current), []);
  return (
    <main ref={root} className="vox">
      <Filters />
      <Measure />
      <Title />
      <Receipts />
      <CommitLog />
      <EvidenceBoard />
      <World />
      <End />
    </main>
  );
}
