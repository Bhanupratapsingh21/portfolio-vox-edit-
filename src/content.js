// Everything the page says lives here. Source: content/profile.md (from bpss.in).
// Edit copy and numbers here; components only lay it out.

export const links = {
  call: "https://cal.com/whybhanu",
  resume: "https://drive.google.com/drive/folders/1suWEU3s50t9GHvCHJEOAY9J2pG0y6BYk?usp=drive_link",
  email: "mailto:bhanupss137@gmail.com",
  github: "https://github.com/bhanupratapsingh21",
  linkedin: "https://www.linkedin.com/in/bhanu-pratap-singh-bbb976257/",
  x: "https://x.com/bhanu_pratap_21",
  instagram: "https://www.instagram.com/bhanu_pratap.2103/",
  site: "https://bpss.in",
  work: "https://bpss.in/work",
  blog: "https://bpss.in/blog",
};

export const title = {
  mark: "Bhanu.",
  kicker: "Explained",
  lead: "Four years ago he was learning to code. At 21, he’s a",
  highlight: "founding engineer.",
  sub: "Bhanu Pratap Singh builds and leads Synappses at Newral, and won the Wingathon at Y Combinator × Emergent’s VibeCon India. Here is how it happened.",
  ticker: ["Founding engineer", "Top 10 / 30,000+ at VibeCon", "$0 → $6K MRR", "10,000+ students at once", "Senior in 7 months", "PetTrace: built & sold"],
  win: {
    kicker: "VibeCon India 2026 · Y Combinator × Emergent",
    big: "Top 10 of 30,000+ applicants",
    body: "Wingathon winner. Built Wingman, an autonomous AI agent, in 24 hours.",
  },
};

export const chapters = [
  { n: "01", name: "The receipts", color: "var(--orange)", ink: "var(--ink)" },
  { n: "02", name: "The commit log", color: "var(--cobalt)", ink: "var(--paper)" },
  { n: "03", name: "The evidence board", color: "var(--ink)", ink: "var(--paper)" },
  { n: "04", name: "Remote, worldwide", color: "var(--green)", ink: "var(--ink)" },
];

// 01: a thermal receipt that prints itself. Numbers with `to` count up; `text` prints as is.
export const receipt = {
  store: "BPSS BUILD CO.",
  sub: "Founding engineering since 2022",
  meta: ["Receipt #2026-10", "Cashier: Bhanu", "India"],
  lines: [
    { label: "Synappses MRR", pre: "$0 → $", to: 6, post: "K" },
    { label: "Revenue growth", pre: "+", to: 75, post: "%" },
    { label: "Cloud cost", pre: "−", to: 50, post: "%" },
    { label: "Manual hours saved / mo", to: 90, post: "+" },
    { label: "Students online at once", to: 10, post: ",000+", circle: true },
    { label: "Team led", text: "4 eng + 2 interns" },
    { label: "SDE → Senior", to: 7, post: " months" },
    { label: "VibeCon · YC × Emergent", text: "Top 10 / 30,000+" },
    { label: "Wingathon, 24 hrs", text: "Won" },
    { label: "PetTrace", text: "Sold" },
  ],
  total: { label: "Total", value: "Founding engineer, 21" },
  footer: ["No refunds on shipped code", "Thank you for scrolling"],
};

export const timeline = [
  {
    when: "2022 to 2023",
    org: "Masai School",
    hash: "a1f3c9e",
    msg: "init: learn MERN at Masai",
    logo: "/logos/masai.png",
    role: "Trainee → Instructional Associate",
    body: "A year and a half of MERN, data structures and system design. Then stayed on to help other students debug and ship.",
    stat: "100+ students mentored",
  },
  {
    when: "2023 to 2024",
    org: "Eventory",
    hash: "4be72d0",
    msg: "feat: ship an event marketplace",
    logo: "/logos/eventory.svg",
    logoText: true,
    role: "Full-Stack Intern → SDE",
    body: "A two-sided event marketplace: vendor SaaS tiers, ticketing, and Razorpay + Stripe checkout with automatic reconciliation.",
    stat: "35% faster page loads",
  },
  {
    when: "Dec 2024 to now",
    org: "Newral Softwares",
    hash: "9c0d1aa",
    msg: "feat: join Newral, senior in 7 months",
    logo: "/logos/newral.svg",
    role: "SDE → Senior Software Developer",
    body: "Client products from zero to one across EdTech, fintech, healthcare and AI: Competishun, AssumeChat, Fizz, Rapid Stroke, Agrevon.",
    steps: [
      ["Dec 2024", "Joined as SDE"],
      ["Apr 2025", "Full-time"],
      ["Jul 2025", "Senior Software Developer"],
    ],
    stat: "Senior in 7 months",
  },
  {
    when: "Jul 2025 to now",
    org: "Synappses",
    hash: "e57b3f2",
    msg: "feat: found Synappses, $0 → $6K MRR",
    logo: "/logos/synappses.svg",
    logoText: true,
    role: "Founding Engineer · a Newral product",
    body: "A white-label enterprise LMS with live classrooms, DRM video and 12+ payment gateways. Now leading 4 engineers and 2 interns.",
    stat: "$0 → $6K MRR",
  },
  {
    when: "Apr to Jun 2026",
    org: "PetTrace",
    hash: "f00d4e1",
    msg: "branch pettrace: build, film, sell",
    role: "My own product · built solo",
    body: "QR pet tags that ping the owner’s phone with a GPS location, no app needed. Made one reel, showed it to a founder, and sold the whole product.",
    stat: "Built in April, sold in June",
    stamp: "Sold",
    branch: true,
  },
];

export const builds = {
  featured: [
    { name: "Synappses", logo: "/logos/synappses.svg", tag: "Founding engineer · Enterprise LMS", line: "$0 → $6K MRR. Live classrooms, DRM video, 12+ payment gateways.", r: -2 },
    { name: "Competishun", logo: "/logos/competishun.svg", logoOnly: true, tag: "EdTech · Product lead", line: "14+ microservices that hold up under 10,000+ students at once.", r: 1.5 },
    { name: "Wingman", tag: "Y Combinator × Emergent · 24 hours", line: "An autonomous real-time AI agent. Won the Wingathon at VibeCon India.", r: -1, star: true },
    { name: "Newral Softwares", logo: "/logos/newral.svg", logoOnly: true, tag: "SDE → Senior in 7 months", line: "Client products from zero to one across EdTech, fintech, healthcare and AI.", r: 2 },
    { name: "AssumeChat", tag: "AI · Solo founding engineer", line: "MVP and V1 for venture capital demos and funding rounds.", r: -1.5 },
  ],
  // Red string runs from this clipping to every project done through it.
  hub: "Newral Softwares",
  hubLinks: ["Synappses", "Competishun", "AssumeChat", "Fizz Social", "Rapid Stroke", "Agrevon"],
  minor: [
    { name: "Fizz Social", logo: "/logos/fizz.svg", line: "Telemetry and CI/CD from zero" },
    { name: "Rapid Stroke", line: "Healthcare diagnostics backend" },
    { name: "Agrevon", line: "MVP that won Startup India seed backing" },
  ],
};

export const world = {
  // Where India sits on map.webp, in % of the image.
  india: { x: 65.6, y: 47 },
  based: "Based in India",
  open: "Open to Remote — Worldwide",
  roles: "Senior SWE · SDE-2 · SDE-3",
  github: "1,633 GitHub contributions in the last year",
  // Flight arcs from India, in % of the map image.
  flights: [
    { city: "San Francisco", x: 11.6, y: 35 },
    { city: "London", x: 41.4, y: 27.5 },
    { city: "Dubai", x: 59.3, y: 42.6 },
    { city: "Singapore", x: 74.2, y: 55.5 },
    { city: "Sydney", x: 88.2, y: 80 },
  ],
  homeZone: "Asia/Kolkata",
};

export const end = {
  lead: "One engineer.",
  tail: "Ready to ship.",
  note: "Open to Senior SWE, SDE-2 and SDE-3 roles. Remote, worldwide.",
  sign: "— Bhanu",
  doors: [
    { label: "Book a call", sub: "cal.com/whybhanu", href: links.call, color: "var(--cobalt)", ink: "var(--paper)" },
    { label: "Resume", sub: "The full record", href: links.resume, color: "var(--orange)", ink: "var(--ink)" },
    { label: "GitHub", sub: "@bhanupratapsingh21", href: links.github, color: "var(--ink)", ink: "var(--paper)" },
  ],
};
