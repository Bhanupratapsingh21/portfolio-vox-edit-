import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { startVox } from "./engine.js";
import { builds, chapters, end, links, report, timeline, title, world } from "./content.js";

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

// Chapter cards rip in half along a jagged tear and the halves fly apart.
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

// The title plays 0 → .5 by itself on load; scrolling runs .5 → 1, where the camera pushes in.
function Title() {
  const w = title.win;
  return (
    <Beat len={2.2} intro className="title">
      <div className="title-cam" data-cam={cam([[0.5, 0, 0, 1, 0], [1, 0, 0, 1.22, 0]])}>
        <div className="mark">{title.mark}</div>
        <div className="title-copy">
          <span className="chip slap k" style={win(0.01, 0.07, { "--r": "-2deg" })}>{title.kicker}</span>
          <h1>
            {title.lead} <Hl a={0.22} b={0.33}>{title.highlight}</Hl>
          </h1>
          <p className="lede slap k" style={win(0.12, 0.2)}>{title.sub}</p>
        </div>
        <figure className="cutout slap k" style={win(0.06, 0.17, { "--r": "3deg" })}>
          <img src="/vox/cutout.webp" alt="Bhanu Pratap Singh as a halftone newspaper cut-out" />
          <Tape i={1} a={0.15} b={0.21} style={{ "--r": "-7deg", top: "-3%", left: "34%" }} />
        </figure>
        <div className="yc slap k" style={win(0.27, 0.35, { "--r": "-4deg" })}>
          <Tape i={3} a={0.33} b={0.38} style={{ "--r": "10deg", top: "-16%", right: "8%" }} />
          <span className="yc-kicker">
            {w.kicker}
          </span>
          <strong>{w.big}</strong>
          <p>{w.body}</p>
        </div>
        <div className="strips">
          <div className="torn grow k" style={win(0.3, 0.4, { "--c": "var(--blue)", "--rr": "-1.2deg" })} />
          <div className="torn grow k" style={win(0.34, 0.44, { "--c": "var(--red)", "--rr": "0.5deg" })} />
          <div className="torn grow k" style={win(0.38, 0.48, { "--c": "var(--yellow)", "--rr": "-0.4deg" })} />
        </div>
      </div>
      <a className="tag-link" href={links.site}>bpss.in →</a>
      <div className="hint">Scroll to play ↓</div>
    </Beat>
  );
}

// 01: a newspaper front page. The camera reads the "By the numbers" column first, where every
// figure counts up, then crosses to the story, where the highlighter picks out each win.
function Wins() {
  const numAt = (i) => 0.2 + i * 0.06;
  const lineAt = (i) => 0.57 + i * 0.05;
  return (
    <Beat len={5} className="numbers">
      <ChapterCard ch={chapters[0]} />
      <div className="cam-frame">
        <div
          className="cam"
          data-cam={cam([
            [0.1, 0, 3, 0.96, 1.5],
            [0.18, -22, 4, 1.22, 1],
            [0.5, -22, 4, 1.22, 1],
            [0.56, 12, 2, 1.16, -1],
            [0.82, 12, 2, 1.16, -1],
            [0.9, 0, 0, 0.94, 0],
          ])}
          data-cam-phone={cam([
            [0.1, 0, 0, 0.86, 0],
            [0.18, 0, -24, 1, 0],
            [0.5, 0, -24, 1, 0],
            [0.56, 0, 14, 1, 0],
            [0.82, 0, 14, 1, 0],
            [0.9, 0, 0, 0.86, 0],
          ])}
        >
          <article className="front">
            <header className="front-head">
              <span>{report.dateline}</span>
              <strong className="front-mast">{report.masthead}</strong>
              <span>Vol. 21 · Free</span>
            </header>
            <div className="front-cols">
              <div className="story">
                <h3>{report.heading}</h3>
                {report.lines.map((l, i) => (
                  <p key={i}>
                    {l.pre}
                    {l.hl && <Hl a={lineAt(i)} b={lineAt(i) + 0.045}>{l.hl}</Hl>}
                    {l.post}
                  </p>
                ))}
              </div>
              <aside className="by-numbers">
                <h4>By the numbers</h4>
                {report.numbers.map((n, i) => (
                  <div className="fig slap k" key={n.label} style={win(numAt(i), numAt(i) + 0.03)}>
                    <span className="count k" style={win(numAt(i), numAt(i) + 0.05, { "--to": n.to, "--pre": str(n.pre), "--post": str(n.post) })}>
                      {n.circle && <span className="ring k" style={win(numAt(i) + 0.05, numAt(i) + 0.11)} />}
                    </span>
                    <small>{n.label}</small>
                  </div>
                ))}
              </aside>
            </div>
          </article>
        </div>
      </div>
    </Beat>
  );
}

function Climb() {
  const start = (i) => 0.12 + i * 0.17;
  const step = 100 / timeline.length;
  const keys = [];
  timeline.slice(1).forEach((_, i) => {
    const hold = start(i) + 0.145;
    keys.push([hold, -step * i, 0, 1, 0], [hold + 0.025, -step * (i + 1), 0, 1, 0]);
  });
  // The career as a git graph: the line draws itself and each job is a commit; PetTrace forks off.
  const n = timeline.length;
  const x = (i) => ((i * 100 + 7) / (n * 100)) * 1000;
  const fork = timeline.findIndex((t) => t.branch);
  return (
    <Beat len={6} className="climb">
      <ChapterCard ch={chapters[1]} />
      <div className="track" data-pan="" data-cam={cam(keys)} style={{ "--n": n }}>
        <svg className="git" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="git-line k" style={win(0.06, 0.9)} pathLength="1" d="M0 50 L1000 50" />
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
      <a className="door-link slap k" href={links.work} style={win(0.95, 0.99)}>Open the full work history →</a>
    </Beat>
  );
}

// 03: clippings get pinned, then red string runs from Newral to everything built through it.
function Builds() {
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
              const sag = 14 + Math.abs(p[0] - h[0]) * 0.04;
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

  const pinAt = (name) => {
    const fi = featured.findIndex((f) => f.name === name);
    if (fi >= 0) return featuredAt(fi) + 0.03;
    return minorAt(minor.findIndex((m) => m.name === name)) + 0.02;
  };

  return (
    <Beat len={4.5} className="builds">
      <ChapterCard ch={chapters[2]} />
      <div className="cam-frame">
        <div className="cam" data-cam={cam([[0.12, 0, 4, 1.06, -1], [0.62, 0, 0, 1, 0], [0.7, -10, -3, 1.18, 0], [0.86, -10, -3, 1.18, 0], [0.94, 0, 0, 1, 0]])}>
          <h3 className="board-title slap k" style={win(0.12, 0.17, { "--r": "-1deg" })}>
            Built from <Hl a={0.15} b={0.2}>zero to one</Hl>
          </h3>
          <div className="board-wrap" ref={wrap}>
          <div className="board">
            {featured.map((b, i) => {
              const s = featuredAt(i);
              return (
                <div data-name={b.name} className={`clip feature slap k${b.star ? " star" : ""}`} key={b.name} style={win(s, s + 0.05, { "--r": `${b.r}deg` })}>
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
              );
            })}
          </div>
          <div className="minor">
            {minor.map((m, i) => {
              const s = minorAt(i);
              return (
                <div data-name={m.name} className="clip small slap k" key={m.name} style={win(s, s + 0.04, { "--r": `${(i - 1) * 1.5}deg` })}>
                  {m.logo ? <img src={m.logo} alt={m.name} className="wordmark" /> : <strong>{m.name}</strong>}
                  <p>{m.line}</p>
                </div>
              );
            })}
          </div>
          <svg className="strings" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w || 1} ${geo.h || 1}`} aria-hidden="true">
            {geo.strings.map((s, i) => (
              <path key={s.name} className="string k" style={win(0.6 + i * 0.025, 0.66 + i * 0.025)} pathLength="1" d={s.d} />
            ))}
          </svg>
          {Object.entries(geo.pins).map(([name, [px, py]]) => (
            <img key={name} className="board-pin drop k" src="/vox/pin.webp" alt="" style={win(pinAt(name), pinAt(name) + 0.03, { left: px, top: py })} />
          ))}
          </div>
        </div>
      </div>
      <a className="door-link slap k" href={links.site} style={win(0.93, 0.98)}>See every project on bpss.in →</a>
    </Beat>
  );
}

function World() {
  const { india } = world;
  const s = 2.2;
  const fx = -s * (india.x - 50);
  const fy = -s * (india.y - 50);
  // Phones see a narrow slice of the map, so keep India centred and pull out further.
  const centre = (z) => [-z * (india.x - 50), -z * (india.y - 50), z];
  return (
    <Beat len={4} className="world">
      <ChapterCard ch={chapters[3]} />
      <div className="map-frame">
        <div
          className="cam map-cam"
          data-cam={cam([[0.1, fx, fy, s, -1], [0.34, fx, fy, s, 0], [0.62, 0, 0, 1.04, 0], [1, 0, 0, 1, 0]])}
          data-cam-phone={cam([[0.1, ...centre(2), 0], [0.34, ...centre(2), 0], [0.62, ...centre(0.62), 0]])}
        >
          <img className="map" src="/vox/map.webp" alt="Map of the world with a pin on India" />
          <img className="pin drop k" src="/vox/pin.webp" alt="" style={win(0.14, 0.22, { left: `${india.x}%`, top: `${india.y}%` })} />
          {world.arrows.map((a, i) => (
            <span key={a.label}>
              <span
                className="arrow-ink map-arrow k"
                style={win(0.6 + i * 0.05, 0.7 + i * 0.05, { left: `${india.x}%`, top: `${india.y}%`, width: `${a.len}%`, "--rot": `${a.rot}deg` })}
              />
              <span className="map-label slap k" style={win(0.66 + i * 0.05, 0.72 + i * 0.05, { left: `${a.x}%`, top: `${a.y}%` })}>
                {a.label}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="world-copy">
        <span className="chip slap k" style={win(0.22, 0.3, { "--r": "-2deg" })}>{world.based}</span>
        <p className="world-open slap k" style={win(0.4, 0.46)}>
          <Hl a={0.46} b={0.56}>{world.open}</Hl>
        </p>
        <p className="world-roles slap k" style={win(0.78, 0.84, { "--r": "-1deg" })}>{world.roles}</p>
        <p className="world-gh slap k" style={win(0.84, 0.9, { "--r": "1deg" })}>{world.github}</p>
      </div>
      <a className="door-link slap k" href={links.blog} style={win(0.93, 0.98)}>Read the engineering writing →</a>
    </Beat>
  );
}

function End() {
  return (
    <Beat len={2} className="end">
      <h2 className="end-title">
        {end.lead} <Hl a={0.2} b={0.36}>{end.tail}</Hl>
      </h2>
      <div className="doors">
        {end.doors.map((d, i) => (
          <a
            key={d.label}
            className="door slap k"
            href={d.href}
            style={win(0.3 + i * 0.08, 0.42 + i * 0.08, { "--c": d.color, "--r": `${(i - 1) * 2}deg`, color: d.ink })}
          >
            <strong>{d.label}</strong>
            <span>{d.sub}</span>
          </a>
        ))}
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
      <Title />
      <Wins />
      <Climb />
      <Builds />
      <World />
      <End />
    </main>
  );
}
