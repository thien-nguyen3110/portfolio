/* ============================================================
   StephenOS '26 — main.js
   3D power-on  ->  fly into the monitor  ->  Win98 desktop OS
   ============================================================ */

// Three.js is loaded lazily (dynamic import) only when the 3D intro runs,
// so reduced-motion / #os visitors never download the WebGL bundle.
let THREE;

/* ------------------------------------------------------------
   1.  RESUME DATA  (single source of truth)
   ------------------------------------------------------------ */
const DATA = {
  name: "Stephen Nguyen",
  legal: "Thien Tam Nguyen",
  role: "Software Engineer · Embedded & Full-Stack",
  location: "Ames, Iowa",
  email: "tamthien@iastate.edu",
  phone: "515-421-8693",
  linkedin: "https://linkedin.com/in/thien3110",
  linkedinLabel: "linkedin.com/in/thien3110",
  github: "https://github.com/thien-nguyen3110",
  githubLabel: "github.com/thien-nguyen3110",
  resume: "./assets/Stephen_Nguyen_Resume.pdf",

  education: {
    school: "Iowa State University",
    degree: "B.S. Computer Science & Data Science",
    gpa: "3.5 / 4.0",
    grad: "Expected Dec 2027",
    place: "Ames, IA",
    coursework:
      "Data Structures, Algorithms & Complexity · Database Management · System Design · Cloud Computing · Software Testing · Machine Learning",
  },

  stats: [
    { n: "5", l: "Engineering internships & co-ops" },
    { n: "3.5", l: "GPA — CS + Data Science" },
    { n: "10K+", l: "Users served across systems" },
    { n: "99.9%", l: "Uptime on banking services" },
  ],

  experience: [
    {
      org: "Bayer HealthCare LLC",
      role: "Embedded Software Engineering Co-op",
      date: "May 2026 – Aug 2026",
      place: "Indianola, PA",
      bullets: [
        "Developed C and C++ embedded software for Cevego Pro injector subsystems — coordinating piston motor control, injection safety checks, device-state monitoring, and operator GUI workflows across 6 software subsystems.",
        "Implemented communication logic across MCP, ICP, SCP, ISI, and display components, supporting 2 motor-control processors (Axis A & Axis B) and validating injector commands, safety states, and device events.",
        "Integrated embedded-device workflows with SPI, I²C, UART, RS-422, MongoDB, and backend services — improving how injector status, patient-case records, and long-term device data move across the system.",
        "Strengthened state-machine behavior, event logging, watchdog checks, and health signals for 2,000+ connected-device users, reducing setup and deployment time ~50%.",
      ],
    },
    {
      org: "Finbud AI",
      role: "Software Development Intern",
      date: "Sep 2025 – Dec 2025",
      place: "Chicago, IL",
      bullets: [
        "Refactored 20+ microservices on Amazon EKS; unified ingress and service routing with NGINX and Istio traffic policies, cutting downtime 70% (≈12 hrs/month) for 10K+ users.",
        "Reduced MTTR 60% by turning Prometheus alerts into auto-mitigation that triggers Kafka repartition at 70% CPU, keeping analytics pipelines stable at 8K+ RPS under load.",
        "Lowered peak 5xx errors 35% with distributed rate limiting and circuit breakers backed by AWS ElastiCache (Redis), preventing overload cascades.",
        "Hardened delivery via Jenkins pipelines + Helm releases with Docker builds and automated k6 gates (80%+ coverage); improved Nuxt.js UX with SWR (−35% bundle, +15% sessions).",
      ],
    },
    {
      org: "Techcombank — Financial Services & Digital Banking",
      role: "Software Engineer Intern · Backend & Infrastructure",
      date: "Jan 2025 – May 2025",
      place: "Hanoi, Vietnam",
      bullets: [
        "Engineered Face-ID biometric auth with JWT, OAuth2, and liveness detection — verifying logins in under 2s and securing 5K+ customers and 10K+ transactions for branch-free, in-app banking.",
        "Built an interest-calculation microservice (Java + Spring Boot) computing daily accrual & compounding across savings and loan products for 5K+ accounts; optimized SQL cut interest-posting time 90%.",
        "Developed self-service REST APIs that diagnose & auto-resolve 70% of common account/technical issues in-app, cutting branch visits 40% for 5K+ customers.",
        "Containerized microservices with Docker on Kubernetes + GitLab CI/CD, adding Redis caching, Kafka streaming, and Prometheus monitoring to sustain 10K+ daily transactions at p95 < 250 ms and 99.9% uptime.",
      ],
    },
    {
      org: "FPT Corporation",
      role: "Software Engineer Intern",
      date: "May 2024 – Aug 2024",
      place: "Da Nang, VN",
      bullets: [
        "Delivered a full-stack e-commerce platform with Next.js and MongoDB — browse, cart, and checkout workflows sustaining 6K+ requests/day at peak with stable sessions.",
        "Cut storefront latency 30% via image optimization, server-side caching, and critical render-path tuning on landing and product pages.",
        "Hardened the Stripe webhooks pipeline with event persistence, idempotency checks, and retries-with-backoff to prevent duplicate processing under burst traffic.",
        "Automated release gates with GitLab CI/CD and k6 load testing — validating 2K+ RPS at 80% coverage and reducing post-release bugs 15%.",
      ],
    },
    {
      org: "Iowa State University",
      role: "Undergraduate Teaching Assistant · Software Development Project",
      date: "Jan 2024 – May 2024",
      place: "Ames, IA",
      bullets: [
        "Mentored 30 students weekly building full-stack apps — guiding Spring Boot & WebSocket backends with HTML/JS/CSS frontends, with hands-on debugging of real-time features and client-server data flow.",
        "Reviewed student codebases for structure & correctness and automated edge-case grading scripts, standardizing feedback and cutting turnaround time 40%.",
      ],
    },
  ],

  projects: [
    {
      name: "WorkApp — HR Management System",
      date: "Aug 2024",
      tags: ["Java", "Spring Boot", "MySQL", "WebSocket", "GitLab CI/CD"],
      bullets: [
        "Built an HR management system in Spring Boot with 40+ MySQL tables and role-based access control (RBAC), applying OOP design to reduce data inconsistencies 50%.",
        "Shipped a real-time WebSocket chat interface and 40+ REST endpoints behind GitLab CI/CD quality gates, handling live message state and role-based views.",
      ],
    },
    {
      name: "ShopArround — E-Commerce Storefront",
      date: "Jan 2025",
      tags: ["Next.js", "React", "TypeScript", "Node.js", "Express", "AWS", "Docker", "MongoDB"],
      bullets: [
        "Built the storefront in Next.js + React with reusable, responsive components for browse, product, and checkout — a modular architecture with custom hooks for consistent state.",
        "Cut initial page-load time 40% with SSR, image optimization, and code splitting, keeping product and landing pages fast under peak traffic.",
      ],
    },
  ],

  skills: [
    { cat: "Languages", items: ["Java", "C / C++", "Python", "JavaScript / TypeScript", "SQL", "HTML / CSS"] },
    { cat: "Embedded & Firmware", items: ["Embedded C", "ARM Cortex-M / M7", "STM32", "PIC", "SafeRTOS", "Qt / QML", "Yocto", "SPI", "I²C", "UART", "RS-422", "GPIO / PWM", "Watchdog timers", "State machines"] },
    { cat: "Frameworks & Tools", items: ["Spring Boot", "Node.js", "Express", "Next.js", "React", "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "AWS", "GCP", "Kafka", "gRPC", "Kong Gateway", "Prometheus", "Git"] },
    { cat: "Databases", items: ["MySQL", "MongoDB", "Redis"] },
    { cat: "CS Foundations", items: ["OOP", "Data Structures & Algorithms", "Complexity Analysis", "System Design", "REST APIs", "OAuth2 / JWT", "Agile / Scrum"] },
    { cat: "Operating Systems", items: ["Linux / Unix", "Embedded Linux", "Windows"] },
    { cat: "Scripting & Automation", items: ["Python", "Shell scripting", "CI/CD pipelines", "Automated testing"] },
  ],
};

/* ------------------------------------------------------------
   2.  THREE.JS  POWER-ON SCENE
   ------------------------------------------------------------ */
const canvas = document.getElementById("three-canvas");
const loaderEl = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");
const loaderPct = document.getElementById("loader-pct");
const powerPrompt = document.getElementById("power-prompt");
const powerBtn = document.getElementById("power-btn");
const warpFlash = document.getElementById("warp-flash");

let renderer, scene, camera, computer, raf;
let flying = false;
let booted = false;
const mouse = { x: 0, y: 0 };
let clock; // THREE.Clock — created once THREE is lazily imported

async function initThree() {
  THREE = await import("three");
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
  const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  renderer.setClearColor(0xffffff, 0);

  scene = new THREE.Scene();
  // light fog so the grid + model dissolve softly into the bright background
  scene.fog = new THREE.FogExp2(0xf8fbff, 0.025);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 9.2);
  camera.lookAt(0, 0.6, 0);

  // lights — bright, with colorful rim accents
  scene.add(new THREE.AmbientLight(0xffffff, 1.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 7, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.7);
  fill.position.set(-5, 3, -4);
  scene.add(fill);
  const cyan = new THREE.PointLight(0x22d3ee, 14, 30);
  cyan.position.set(-4, 1.5, 3);
  scene.add(cyan);
  const magenta = new THREE.PointLight(0xec4899, 12, 30);
  magenta.position.set(5, 0.5, 2);
  scene.add(magenta);
  const violet = new THREE.PointLight(0x8b5cf6, 9, 26);
  violet.position.set(0, 4, -3);
  scene.add(violet);
  const screenGlow = new THREE.PointLight(0x9bf7ee, 9, 12);
  screenGlow.position.set(0, 1.0, 1.6);
  scene.add(screenGlow);

  // floor grid (light, with a violet center cross)
  const grid = new THREE.GridHelper(60, 60, 0x38bdf8, 0xd7defe);
  grid.position.y = -1.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.42;
  scene.add(grid);

  // colorful floating particles that read on a bright background
  const starGeo = new THREE.BufferGeometry();
  const starCnt = 700;
  const pos = new Float32Array(starCnt * 3);
  const col = new Float32Array(starCnt * 3);
  const palette = [0x22d3ee, 0x7c3aed, 0xec4899, 0xf59e0b, 0x10b981].map((h) => new THREE.Color(h));
  for (let i = 0; i < starCnt; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 56;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 56;
    const c = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.78, depthWrite: false })
  );
  scene.add(stars);

  // load the retro computer
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_u, loaded, total) => {
    const pct = total ? Math.round((loaded / total) * 100) : 0;
    setLoader(pct);
  };
  const gltf = new GLTFLoader(manager);
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  gltf.setDRACOLoader(draco);
  gltf.load(
    "./models/computer.glb",
    (g) => {
      computer = g.scene;
      frameModel(computer);
      // boost any screen-ish material so it glows
      computer.traverse((o) => {
        if (o.isMesh && o.material) {
          const m = o.material;
          const nm = (m.name || "").toLowerCase() + (o.name || "").toLowerCase();
          if (nm.includes("screen") || nm.includes("computer")) {
            m.emissive = new THREE.Color(0x2fe6d6);
            m.emissiveIntensity = 0.9;
          }
        }
      });
      scene.add(computer);
      console.log("[StephenOS] computer.glb loaded OK");
      finishLoading();
    },
    undefined,
    (err) => {
      console.warn("GLB load failed, using fallback monitor", err);
      computer = fallbackMonitor();
      scene.add(computer);
      finishLoading();
    }
  );

  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  animate();
}

function frameModel(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const s = 4.2 / maxDim;
  obj.scale.setScalar(s);
  // recenter
  obj.position.sub(center.multiplyScalar(s));
  obj.position.y += 0.3;
}

function fallbackMonitor() {
  const grp = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2.3, 2),
    new THREE.MeshStandardMaterial({ color: 0xd8d2bc, roughness: 0.8 })
  );
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.7),
    new THREE.MeshStandardMaterial({ color: 0x0a2230, emissive: 0x2fe6d6, emissiveIntensity: 1.1 })
  );
  screen.position.z = 1.01;
  grp.add(body, screen);
  return grp;
}

function animate() {
  raf = requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  if (computer && !flying) {
    computer.rotation.y = Math.sin(t * 0.25) * 0.32 + mouse.x * 0.25;
    computer.position.y += Math.sin(t * 1.1) * 0.0006;
    computer.rotation.x = -mouse.y * 0.08;
  }
  if (!flying) {
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (1.6 - mouse.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.6, 0);
  }
  renderer.render(scene, camera);
}

function onResize() {
  if (!renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setLoader(pct) {
  loaderFill.style.width = pct + "%";
  loaderPct.innerHTML = "LOADING ASSETS&hellip; " + pct + "%";
}

let loadingDone = false;
function finishLoading() {
  if (loadingDone) return;
  loadingDone = true;
  setLoader(100);
  setTimeout(() => {
    loaderEl.classList.add("fade-out");
    setTimeout(() => {
      loaderEl.classList.add("hidden");
      powerPrompt.classList.remove("hidden");
      powerPrompt.classList.add("fade-in-soft");
    }, 600);
  }, 350);
}

/* fly the camera "into" the monitor, then boot */
function flyIn() {
  if (flying || booted) return;
  flying = true;
  booted = true;
  powerPrompt.classList.add("fade-out");

  const start = camera.position.clone();
  const end = new THREE.Vector3(0, 0.65, 0.9);
  const dur = 2400;
  const t0 = performance.now();
  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = easeInOut(p);
    camera.position.lerpVectors(start, end, e);
    camera.lookAt(0, 0.6, 0);
    camera.fov = 45 + e * 28; // widen for "dive" feel
    camera.updateProjectionMatrix();
    if (computer) computer.rotation.y *= 0.96;
    warpFlash.style.opacity = Math.max(0, (p - 0.55) / 0.45).toFixed(3);
    if (p < 1) requestAnimationFrame(step);
    else enterBoot();
  }
  requestAnimationFrame(step);
}

function enterBoot() {
  cancelAnimationFrame(raf);
  document.getElementById("scene-stage").classList.add("hidden");
  startBootSequence();
}

// click anywhere on the scene (or the button) powers on
powerBtn.addEventListener("click", flyIn);
document.getElementById("scene-stage").addEventListener("click", (e) => {
  if (!powerPrompt.classList.contains("hidden")) flyIn();
});

/* bootstrap moved to end of module (after all declarations) */

/* ------------------------------------------------------------
   3.  BOOT SEQUENCE
   ------------------------------------------------------------ */
const bootScreen = document.getElementById("boot-screen");
const bootLog = document.getElementById("boot-log");

const BOOT_LINES = [
  { t: 'StephenOS BIOS v26.12  —  (C) 2027 Nguyen Microsystems', c: "accent" },
  { t: "Detecting CPU ............... 1x Caffeine-Core @ 3.5 GPA", c: "" },
  { t: "Memory test ................. 640K OK  (ought to be enough)", c: "ok" },
  { t: "Initializing embedded bus ... SPI / I²C / UART / RS-422 [OK]", c: "ok" },
  { t: "Mounting /dev/experience .... 5 internships found", c: "ok" },
  { t: "Mounting /dev/projects ...... WorkApp, ShopArround [OK]", c: "ok" },
  { t: "Loading drivers: java spring docker k8s aws ... done", c: "" },
  { t: "Calibrating ambition ........ MAX", c: "warn" },
  { t: "Starting StephenOS desktop environment ...", c: "accent" },
];

function startBootSequence() {
  bootScreen.classList.remove("hidden");
  bootLog.innerHTML = "";
  let i = 0;

  function nextLine() {
    if (i >= BOOT_LINES.length) {
      const c = document.createElement("div");
      c.innerHTML = '<span class="cursor"></span>';
      bootLog.appendChild(c);
      setTimeout(launchDesktop, 700);
      return;
    }
    const line = BOOT_LINES[i++];
    const div = document.createElement("div");
    if (line.c) div.className = line.c;
    bootLog.appendChild(div);
    typeLine(div, line.t, () => setTimeout(nextLine, 90 + Math.random() * 120));
  }
  nextLine();
}

function typeLine(el, text, done) {
  let j = 0;
  const speed = 9;
  (function tick() {
    el.textContent = text.slice(0, j);
    j++;
    if (j <= text.length) setTimeout(tick, speed);
    else done && done();
  })();
}

/* ------------------------------------------------------------
   4.  DESKTOP  /  WINDOW MANAGER
   ------------------------------------------------------------ */
const desktop = document.getElementById("desktop");
const windowLayer = document.getElementById("window-layer");
const taskButtons = document.getElementById("task-buttons");
const startBtn = document.getElementById("start-btn");
const startMenu = document.getElementById("start-menu");

let zTop = 100;
const windows = {}; // id -> {el, taskBtn, min}

function launchDesktop() {
  bootScreen.classList.add("fade-out");
  setTimeout(() => {
    bootScreen.classList.add("hidden");
    desktop.classList.remove("hidden");
    desktop.classList.add("fade-in-soft");
    buildDesktopIcons();
    buildStartMenu();
    startClock();
    // auto-open the showcase like the demo
    setTimeout(() => openShowcase("home"), 350);
  }, 600);
}

/* ---- desktop icons ---- */
const ICONS = [
  { id: "showcase", label: "My Showcase", ico: "🖥️", action: () => openShowcase("home") },
  { id: "about", label: "About Me", ico: "📇", action: () => openShowcase("about") },
  { id: "experience", label: "Experience", ico: "🗂️", action: () => openShowcase("experience") },
  { id: "projects", label: "Projects", ico: "🧩", action: () => openShowcase("projects") },
  { id: "resume", label: "Resume.pdf", ico: "📄", action: openResume },
  { id: "readme", label: "ReadMe.txt", ico: "📝", action: openReadme },
  { id: "contact", label: "Contact", ico: "✉️", action: () => openShowcase("contact") },
];

function buildDesktopIcons() {
  const wrap = document.getElementById("desktop-icons");
  wrap.innerHTML = "";
  ICONS.forEach((ic) => {
    const el = document.createElement("div");
    el.className = "desk-icon";
    el.innerHTML = `<div class="ico">${ic.ico}</div><div class="lbl">${ic.label}</div>`;
    let lastTap = 0;
    el.addEventListener("click", () => {
      document.querySelectorAll(".desk-icon").forEach((d) => d.classList.remove("sel"));
      el.classList.add("sel");
      const now = Date.now();
      if (now - lastTap < 450) ic.action(); // double-click (or quick tap on mobile)
      lastTap = now;
    });
    el.addEventListener("dblclick", ic.action);
    wrap.appendChild(el);
  });
  // single-click anywhere clears selection
  desktop.addEventListener("mousedown", (e) => {
    if (e.target === desktop || e.target.id === "window-layer")
      document.querySelectorAll(".desk-icon").forEach((d) => d.classList.remove("sel"));
  });
}

/* ---- generic window factory ---- */
function makeWindow({ id, title, ico, width, height, bodyHTML, bodyClass = "" }) {
  if (windows[id]) {
    restoreWindow(id);
    focusWindow(id);
    return windows[id].el;
  }
  const el = document.createElement("div");
  el.className = "win";
  el.style.width = width + "px";
  el.style.height = height + "px";
  // center-ish with slight cascade
  const offset = Object.keys(windows).length * 26;
  const left = Math.max(8, Math.min((VW() - width) / 2 + offset - 40, VW() - width - 8));
  const top = Math.max(8, (VH() - height - 34) / 2 + offset - 30);
  el.style.left = left + "px";
  el.style.top = top + "px";

  el.innerHTML = `
    <div class="win-titlebar">
      <span class="wt-ico">${ico}</span>
      <span class="wt-title">${title}</span>
      <span class="win-ctrls">
        <button data-act="min" title="Minimize">_</button>
        <button data-act="max" title="Maximize">▢</button>
        <button data-act="close" title="Close">✕</button>
      </span>
    </div>
    <div class="${bodyClass || "win-body"}">${bodyHTML}</div>`;

  windowLayer.appendChild(el);

  // taskbar button
  const tb = document.createElement("button");
  tb.className = "task-btn";
  tb.innerHTML = `<span>${ico}</span><span>${title}</span>`;
  tb.addEventListener("click", () => {
    if (windows[id].min) restoreWindow(id);
    else if (el.dataset.active === "1") minimizeWindow(id);
    focusWindow(id);
  });
  taskButtons.appendChild(tb);

  windows[id] = { el, taskBtn: tb, min: false, maxed: false, prev: null };

  // controls
  el.querySelector('[data-act="close"]').addEventListener("click", () => closeWindow(id));
  el.querySelector('[data-act="min"]').addEventListener("click", () => minimizeWindow(id));
  el.querySelector('[data-act="max"]').addEventListener("click", () => toggleMax(id));
  el.addEventListener("mousedown", () => focusWindow(id));

  makeDraggable(el, el.querySelector(".win-titlebar"), id);
  focusWindow(id);
  return el;
}

function makeDraggable(win, handle, id) {
  let sx, sy, ox, oy, dragging = false;
  const down = (e) => {
    if (windows[id].maxed) return;
    if (e.target.closest(".win-ctrls")) return;
    dragging = true;
    const p = e.touches ? e.touches[0] : e;
    sx = p.clientX; sy = p.clientY;
    ox = win.offsetLeft; oy = win.offsetTop;
    handle.style.cursor = "grabbing";
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", up);
  };
  const move = (e) => {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    const p = e.touches ? e.touches[0] : e;
    let nx = ox + (p.clientX - sx);
    let ny = oy + (p.clientY - sy);
    nx = Math.max(-win.offsetWidth + 80, Math.min(nx, window.innerWidth - 80));
    ny = Math.max(0, Math.min(ny, window.innerHeight - 60));
    win.style.left = nx + "px";
    win.style.top = ny + "px";
  };
  const up = () => {
    dragging = false;
    handle.style.cursor = "grab";
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    document.removeEventListener("touchmove", move);
    document.removeEventListener("touchend", up);
  };
  handle.addEventListener("mousedown", down);
  handle.addEventListener("touchstart", down, { passive: true });
}

function focusWindow(id) {
  Object.entries(windows).forEach(([wid, w]) => {
    const active = wid === id;
    w.el.classList.toggle("inactive", !active);
    w.el.dataset.active = active ? "1" : "0";
    w.taskBtn.classList.toggle("active", active && !w.min);
  });
  if (windows[id]) windows[id].el.style.zIndex = ++zTop;
}

function minimizeWindow(id) {
  const w = windows[id];
  if (!w) return;
  w.min = true;
  w.el.classList.add("hidden");
  w.taskBtn.classList.remove("active");
  w.el.dataset.active = "0";
}
function restoreWindow(id) {
  const w = windows[id];
  if (!w) return;
  w.min = false;
  w.el.classList.remove("hidden");
  focusWindow(id);
}
function closeWindow(id) {
  const w = windows[id];
  if (!w) return;
  w.el.remove();
  w.taskBtn.remove();
  delete windows[id];
}
function toggleMax(id) {
  const w = windows[id];
  if (!w) return;
  const el = w.el;
  if (!w.maxed) {
    w.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.width = window.innerWidth + "px";
    el.style.height = window.innerHeight - 34 + "px";
    w.maxed = true;
  } else {
    Object.assign(el.style, w.prev);
    w.maxed = false;
  }
  focusWindow(id);
}

/* ------------------------------------------------------------
   5.  SHOWCASE WINDOW  (sidebar + sections)
   ------------------------------------------------------------ */
const VW = () => window.innerWidth || document.documentElement.clientWidth || 1280;
const VH = () => window.innerHeight || document.documentElement.clientHeight || 800;

function openShowcase(section = "home") {
  const w = VW();
  const width = Math.max(320, Math.min(900, w - 24));
  const height = Math.max(360, Math.min(620, VH() - 70));

  if (!windows.showcase) {
    makeWindow({
      id: "showcase",
      title: "Stephen Nguyen — Showcase '26",
      ico: "🖥️",
      width,
      height,
      bodyHTML: showcaseHTML(),
    });
    wireShowcaseNav();
  } else {
    restoreWindow("showcase");
    focusWindow("showcase");
  }
  showSection(section);
}

function showcaseHTML() {
  const navItems = ["home", "about", "experience", "projects", "skills", "contact"];
  const nav = navItems
    .map((s) => `<a data-sec="${s}">${s.toUpperCase()}</a>`)
    .join("");

  // NOTE: makeWindow already wraps this in <div class="win-body">.
  return `
    <aside class="sc-sidebar">
      <div class="sc-brand">Stephen<br>Nguyen<small>Showcase '26</small></div>
      <nav><ul class="sc-nav">${nav}</ul></nav>
      <div class="sc-side-foot">© 2026<br>StephenOS</div>
    </aside>
    <div class="sc-content" id="sc-content">
      <div class="sc-page">
        <div class="resume-ribbon">
          <span class="rr-ico">🗜️</span>
          <div class="rr-text">
            <h4>Looking for my resume?</h4>
            <a href="${DATA.resume}" target="_blank" rel="noopener">Click here to download it!</a>
          </div>
        </div>
        ${sectionHome()}
        ${sectionAbout()}
        ${sectionExperience()}
        ${sectionProjects()}
        ${sectionSkills()}
        ${sectionContact()}
      </div>
    </div>`;
}

function wireShowcaseNav() {
  const el = windows.showcase.el;
  el.querySelectorAll(".sc-nav a").forEach((a) => {
    a.addEventListener("click", () => showSection(a.dataset.sec));
  });
}

function showSection(sec) {
  const el = windows.showcase && windows.showcase.el;
  if (!el) return;
  el.querySelectorAll(".sc-section").forEach((s) => s.classList.toggle("active", s.dataset.sec === sec));
  el.querySelectorAll(".sc-nav a").forEach((a) => a.classList.toggle("active", a.dataset.sec === sec));
  const content = el.querySelector("#sc-content");
  if (content) content.scrollTop = 0;
}

/* ---- section builders ---- */
function sectionHome() {
  const links = `
    <div class="hero-links">
      <a href="mailto:${DATA.email}">✉️ Email</a>
      <a href="${DATA.linkedin}" target="_blank" rel="noopener">💼 LinkedIn</a>
      <a href="${DATA.github}" target="_blank" rel="noopener">🐙 GitHub</a>
      <a href="${DATA.resume}" target="_blank" rel="noopener">📄 Résumé (PDF)</a>
    </div>`;
  const stats = DATA.stats.map((s) => `<div class="stat"><b>${s.n}</b><span>${s.l}</span></div>`).join("");
  return `
  <section class="sc-section active" data-sec="home">
    <div class="hero-head">Hi, I'm Stephen.</div>
    <div class="hero-sub">> ${DATA.role}</div>
    <p class="lead">I build software that has to <b>actually work</b> — from C/C++ firmware running safety-critical
      medical injectors, to Spring Boot &amp; Next.js services keeping banks and storefronts online for
      tens of thousands of users. I love the full stack of reality: the metal, the network, and the human at the screen.</p>
    ${links}
    <div class="hero-stats">${stats}</div>
    <p>Currently studying <b>Computer Science &amp; Data Science</b> at ${DATA.education.school}
      (${DATA.education.gpa} GPA, ${DATA.education.grad}) and writing embedded software at
      <b>Bayer HealthCare</b>. Use the menu on the left — or the desktop icons — to look around.</p>
  </section>`;
}

function sectionAbout() {
  return `
  <section class="sc-section" data-sec="about">
    <h2 class="sc-h2">About Me</h2>
    <figure class="sc-figure float-right">
      <img src="./assets/me-young.jpg" alt="Stephen as a child on graduation day">
      <figcaption><b>Figure 1:</b> Me, graduation day — already plotting.</figcaption>
    </figure>
    <p>From a young age I've been the kid who takes things apart just to see how they work — and (usually)
      puts them back together. That curiosity turned into a love of building, and eventually into code. The first
      time I made a machine do exactly what I told it to, I was hooked.</p>
    <p>Today I'm pursuing a <b>B.S. in Computer Science &amp; Data Science</b> at
      <b>${DATA.education.school}</b> in ${DATA.education.place} (GPA ${DATA.education.gpa}, ${DATA.education.grad}).
      My coursework spans ${DATA.education.coursework}.</p>
    <p>I've been lucky to work across the whole stack of computing — low-level embedded firmware on ARM Cortex-M
      processors at <b>Bayer</b>, backend &amp; infrastructure for digital banking at <b>Techcombank</b>, cloud
      reliability work at <b>Finbud AI</b>, and full-stack product work at <b>FPT</b>. I'm happiest where reliability
      matters: state machines, safety checks, p95 latencies, and uptime you can bet on.</p>

    <h2 class="sc-h2">Beyond the Code</h2>
    <figure class="sc-figure float-right">
      <img src="./assets/me-now.jpg" alt="Stephen today, headphones on">
      <figcaption><b>Figure 2:</b> Me, present day — headphones on, shipping.</figcaption>
    </figure>
    <p>When I'm not debugging firmware or chasing a tricky race condition, you'll find me with headphones on —
      I'm into music, gaming, and the gym, and I do some of my best thinking on a long walk away from the keyboard.</p>
    <p>I grew up between Vietnam and the U.S., which means I'm comfortable jumping between teams, time zones,
      and contexts — and I bring that same adaptability to every codebase I touch.</p>
    <p class="sig">Thanks for reading about me! Poke around the rest of the desktop — open a few windows,
      drag them around, and check out my experience and projects. — Stephen</p>
  </section>`;
}

function sectionExperience() {
  const items = DATA.experience
    .map(
      (e) => `
      <div class="xp-item">
        <h3>${e.org}</h3>
        <div class="xp-meta"><span class="role">${e.role}</span><span>${e.date}</span><span>${e.place}</span></div>
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
  return `
  <section class="sc-section" data-sec="experience">
    <h2 class="sc-h2">Experience</h2>
    <div class="xp">${items}</div>
  </section>`;
}

function sectionProjects() {
  const items = DATA.projects
    .map(
      (p) => `
      <div class="proj">
        <h3>${p.name} <span class="date">${p.date}</span></h3>
        <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <ul>${p.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
  return `
  <section class="sc-section" data-sec="projects">
    <h2 class="sc-h2">Projects</h2>
    ${items}
    <p class="sig">More on <a href="${DATA.github}" target="_blank" rel="noopener">${DATA.githubLabel}</a>.</p>
  </section>`;
}

function sectionSkills() {
  const cards = DATA.skills
    .map(
      (s) => `
      <div class="skill-card">
        <h4>${s.cat}</h4>
        <div class="chips">${s.items.map((i) => `<span class="chip">${i}</span>`).join("")}</div>
      </div>`
    )
    .join("");
  return `
  <section class="sc-section" data-sec="skills">
    <h2 class="sc-h2">Technical Skills</h2>
    <div class="skill-grid">${cards}</div>
  </section>`;
}

function sectionContact() {
  return `
  <section class="sc-section" data-sec="contact">
    <h2 class="sc-h2">Get in touch</h2>
    <p>I'm always open to interesting problems, new-grad and internship opportunities, and good conversation.
      The fastest way to reach me is email.</p>
    <div class="contact-grid">
      <a class="contact-card" href="mailto:${DATA.email}">
        <span class="ci">✉️</span><span><b>Email</b><span>${DATA.email}</span></span></a>
      <a class="contact-card" href="tel:${DATA.phone.replace(/[^0-9]/g, "")}">
        <span class="ci">📞</span><span><b>Phone</b><span>${DATA.phone}</span></span></a>
      <a class="contact-card" href="${DATA.linkedin}" target="_blank" rel="noopener">
        <span class="ci">💼</span><span><b>LinkedIn</b><span>${DATA.linkedinLabel}</span></span></a>
      <a class="contact-card" href="${DATA.github}" target="_blank" rel="noopener">
        <span class="ci">🐙</span><span><b>GitHub</b><span>${DATA.githubLabel}</span></span></a>
    </div>
    <p class="sig">Based in ${DATA.location} · open to relocation. Looking forward to hearing from you!</p>
  </section>`;
}

/* ------------------------------------------------------------
   6.  OTHER WINDOWS
   ------------------------------------------------------------ */
function openResume() {
  window.open(DATA.resume, "_blank", "noopener");
}

function openReadme() {
  const text = `STEPHENOS — ReadMe.txt
============================================================

Welcome! You're looking at ${DATA.name}'s portfolio, served up as
a (mostly) functional retro operating system.

WHO:    ${DATA.name} (${DATA.legal})
WHAT:   ${DATA.role}
WHERE:  ${DATA.location}
SCHOOL: ${DATA.education.degree}, ${DATA.education.school}
        ${DATA.education.gpa} GPA · ${DATA.education.grad}

HOW TO USE THIS DESKTOP
------------------------------------------------------------
 * Double-click any desktop icon to open a window.
 * Drag windows by their blue title bar.
 * Use _ ▢ ✕ to minimize / maximize / close.
 * The Start menu (bottom-left) jumps to any section.
 * "Resume.pdf" downloads my real resume.

CONTACT
------------------------------------------------------------
 email ... ${DATA.email}
 phone ... ${DATA.phone}
 li ...... ${DATA.linkedinLabel}
 gh ...... ${DATA.githubLabel}

Thanks for stopping by. Now go click something. :)`;
  makeWindow({
    id: "readme",
    title: "ReadMe.txt — Notepad",
    ico: "📝",
    width: Math.min(560, window.innerWidth - 24),
    height: Math.min(480, window.innerHeight - 70),
    bodyHTML: text.replace(/&/g, "&amp;").replace(/</g, "&lt;"),
    bodyClass: "note-body",
  });
}

/* ------------------------------------------------------------
   7.  START MENU  +  CLOCK
   ------------------------------------------------------------ */
function buildStartMenu() {
  startMenu.innerHTML = `
    <div class="sm-rail">Stephen<b>OS</b></div>
    <div class="sm-list">
      <div class="sm-item" data-go="home"><span class="smi">🏠</span> Home</div>
      <div class="sm-item" data-go="about"><span class="smi">📇</span> About Me</div>
      <div class="sm-item" data-go="experience"><span class="smi">🗂️</span> Experience</div>
      <div class="sm-item" data-go="projects"><span class="smi">🧩</span> Projects</div>
      <div class="sm-item" data-go="skills"><span class="smi">🛠️</span> Skills</div>
      <div class="sm-item" data-go="contact"><span class="smi">✉️</span> Contact</div>
      <div class="sm-sep"></div>
      <div class="sm-item" data-act="resume"><span class="smi">📄</span> Resume.pdf</div>
      <div class="sm-item" data-act="readme"><span class="smi">📝</span> ReadMe.txt</div>
      <div class="sm-sep"></div>
      <div class="sm-item" data-act="reboot"><span class="smi">⏻</span> Shut Down…</div>
    </div>`;

  startMenu.querySelectorAll("[data-go]").forEach((it) =>
    it.addEventListener("click", () => {
      openShowcase(it.dataset.go);
      toggleStart(false);
    })
  );
  startMenu.querySelector('[data-act="resume"]').addEventListener("click", () => { openResume(); toggleStart(false); });
  startMenu.querySelector('[data-act="readme"]').addEventListener("click", () => { openReadme(); toggleStart(false); });
  startMenu.querySelector('[data-act="reboot"]').addEventListener("click", () => { toggleStart(false); reboot(); });
}

function toggleStart(force) {
  const open = force !== undefined ? force : startMenu.classList.contains("hidden");
  startMenu.classList.toggle("hidden", !open);
  startBtn.classList.toggle("open", open);
}
startBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleStart(); });
document.addEventListener("click", (e) => {
  if (!startMenu.classList.contains("hidden") && !startMenu.contains(e.target) && e.target !== startBtn)
    toggleStart(false);
});

function reboot() {
  desktop.classList.add("fade-out");
  setTimeout(() => location.reload(), 500);
}

function startClock() {
  const clk = document.getElementById("clock");
  const tick = () => {
    const d = new Date();
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    clk.textContent = `${h}:${m} ${ap}`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ------------------------------------------------------------
   8.  BOOTSTRAP  (runs after all declarations)
   ------------------------------------------------------------ */
const prefersReduced =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const forceIntro = /(?:\?|&)intro\b/.test(location.search); // override (replay the 3D intro)
const skipIntro =
  !forceIntro &&
  (prefersReduced ||
    location.hash === "#os" ||
    location.hash === "#desktop" ||
    /(?:\?|&)(os|skipintro)\b/.test(location.search));

if (skipIntro) {
  // Jump straight to the desktop — no WebGL, no boot typing.
  loaderEl.classList.add("hidden");
  document.getElementById("scene-stage").classList.add("hidden");
  bootScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
  buildDesktopIcons();
  buildStartMenu();
  startClock();
  openShowcase("home");
} else {
  initThree().catch((e) => {
    console.warn("Three.js init failed; skipping to boot.", e);
    loaderEl.classList.add("hidden");
    document.getElementById("scene-stage").classList.add("hidden");
    startBootSequence();
  });
}
