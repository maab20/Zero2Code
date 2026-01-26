document.addEventListener("DOMContentLoaded", () => {
  // ===== AOS (مرة واحدة فقط) =====
  if (window.AOS) {
    AOS.init({ duration: 700, once: true });
  }

  // ===== Top Button (safe) =====
  const topBtn = document.getElementById("topBtn");
  if (topBtn) {
    window.addEventListener("scroll", () => {
      topBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== Mission Toggle (About page) =====
  const goalCard = document.getElementById("goalCard");
  const goalToggle = document.getElementById("goalToggle");
  const goalMore = document.getElementById("goalMore");

  if (goalCard && goalToggle && goalMore) {
    goalToggle.addEventListener("click", () => {
      const isOpen = goalCard.classList.toggle("is-open");

      goalToggle.setAttribute("aria-expanded", String(isOpen));
      goalMore.setAttribute("aria-hidden", String(!isOpen));

      // غير النص بدون ما نخرب السهم
      const firstSpan = goalToggle.querySelector("span");
      if (firstSpan) firstSpan.textContent = isOpen ? "Show less" : "Read more";
    });
  }

  // ===== FAQ (Accordion + Search + Filters) =====
  const faqGrid = document.getElementById("faqGrid");
  if (faqGrid) {
    const items = Array.from(document.querySelectorAll(".faq-item"));
    const searchInput = document.getElementById("faqSearch");
    const tags = Array.from(document.querySelectorAll(".faq-tag"));

    // Accordion: افتح واحد بس
    items.forEach((item) => {
      const btn = item.querySelector(".faq-q");
      const ans = item.querySelector(".faq-a");

      if (!btn || !ans) return;

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // close all
        items.forEach((i) => {
          i.classList.remove("is-open");
          const b = i.querySelector(".faq-q");
          const a = i.querySelector(".faq-a");
          b?.setAttribute("aria-expanded", "false");
          a?.setAttribute("aria-hidden", "true");
        });

        // open current if was closed
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          ans.setAttribute("aria-hidden", "false");
        }
      });
    });

    // Filter logic
    let currentFilter = "all";
    function applyFilter() {
      const q = (searchInput?.value || "").trim().toLowerCase();

      items.forEach((item) => {
        const cat = item.dataset.category || "";
        const text = item.innerText.toLowerCase();

        const matchCat = currentFilter === "all" || cat === currentFilter;
        const matchSearch = q === "" || text.includes(q);

        item.style.display = (matchCat && matchSearch) ? "" : "none";
      });
    }

    // Tags click
    tags.forEach((t) => {
      t.addEventListener("click", () => {
        tags.forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        currentFilter = t.dataset.filter || "all";
        applyFilter();
      });
    });

    // Search input
    searchInput?.addEventListener("input", applyFilter);
  }

  // ===== Contact Page Validation + Redirect =====
  const form = document.getElementById("contactForm");
  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const sendBtn = document.getElementById("sendBtn");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    const resetField = (input, errorEl) => {
      if (!input || !errorEl) return;
      errorEl.style.display = "none";
      input.style.borderColor = "rgba(255,255,255,0.12)";
    };

    const setError = (input, errorEl, msg) => {
      if (!input || !errorEl) return;
      errorEl.textContent = msg;
      errorEl.style.display = "block";
      input.style.borderColor = "#f87171";
    };

    const isValidEmail = (email) => {
      if (!email.includes("@") || !email.includes(".")) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    };

    // Live clear errors
    [nameInput, emailInput, messageInput].forEach((el) => {
      el?.addEventListener("input", () => {
        if (el === nameInput) resetField(nameInput, nameError);
        if (el === emailInput) resetField(emailInput, emailError);
        if (el === messageInput) resetField(messageInput, messageError);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (nameInput?.value || "").trim();
      const email = (emailInput?.value || "").trim();
      const message = (messageInput?.value || "").trim();

      let ok = true;
      resetField(nameInput, nameError);
      resetField(emailInput, emailError);
      resetField(messageInput, messageError);

      if (name.length < 2) {
        setError(nameInput, nameError, "Please enter your name (at least 2 characters).");
        ok = false;
      }

      if (!isValidEmail(email)) {
        setError(emailInput, emailError, "Please enter a valid email (must include @ and .)");
        ok = false;
      }

      if (message.length < 10) {
        setError(messageInput, messageError, "Please write a message (at least 10 characters).");
        ok = false;
      }

      if (!ok) return;

      // loading
      sendBtn?.classList.add("is-loading");
      sendBtn?.setAttribute("disabled", "true");

      setTimeout(() => {
        sendBtn?.classList.remove("is-loading");
        sendBtn?.removeAttribute("disabled");

        // Redirect to Thank You page
        window.location.href = "thankyou.html";
      }, 900);
    });
  }
});

// ===== Learning Path Page =====
document.addEventListener("DOMContentLoaded", () => {
  const learnPage = document.querySelector(".learn-page");
  if (!learnPage) return;

  const cards = Array.from(document.querySelectorAll(".level-card"));
  const startBtns = Array.from(document.querySelectorAll(".level-start"));
  const markBtns = Array.from(document.querySelectorAll(".level-mark"));

  const overallFill = document.getElementById("overallFill");
  const overallValue = document.getElementById("overallValue");

  // Open/Close details (accordion one open)
  startBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const card = btn.closest(".level-card");
      const details = document.getElementById(targetId);

      if (!card || !details) return;

      const isOpen = card.classList.contains("is-open");

      // close all
      cards.forEach((c) => c.classList.remove("is-open"));

      // toggle current
      if (!isOpen) {
        card.classList.add("is-open");
        details.setAttribute("aria-hidden", "false");
        details.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        details.setAttribute("aria-hidden", "true");
      }
    });
  });

  // Save progress (localStorage)
  const KEY = "zero2code_learning_progress";
  const saved = JSON.parse(localStorage.getItem(KEY) || "{}"); // {1:true,2:true...}

  function computeOverall() {
    const doneCount = Object.values(saved).filter(Boolean).length;
    const percent = Math.round((doneCount / 4) * 100);
    if (overallFill) overallFill.style.width = percent + "%";
    if (overallValue) overallValue.textContent = percent + "%";
  }

  computeOverall();

  markBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.mark;
      if (!level) return;

      // toggle
      saved[level] = !saved[level];
      localStorage.setItem(KEY, JSON.stringify(saved));

      btn.textContent = saved[level] ? "Marked ✅" : "Mark In Progress";
      computeOverall();
    });

    // set initial label
    const level = btn.dataset.mark;
    if (level && saved[level]) btn.textContent = "Marked ✅";
  });
});

// ===== About Page: Skill Bars Reveal + Stars Parallax =====
document.addEventListener("DOMContentLoaded", () => {
  const about = document.querySelector(".aboutMY");
  if (!about) return;

  // 1) Skill bars animate on view
  const fills = Array.from(about.querySelectorAll(".fill"));
  if (fills.length) {
    // start from 0
    fills.forEach(f => (f.style.width = "0%"));

    const obs = new IntersectionObserver((entries) => {
      const anyVisible = entries.some(e => e.isIntersecting);
      if (!anyVisible) return;

      fills.forEach((f, idx) => {
        const w = getComputedStyle(f).getPropertyValue("--w").trim() || "0%";
        setTimeout(() => (f.style.width = w), idx * 80);
      });

      obs.disconnect(); // once
    }, { threshold: 0.35 });

    obs.observe(about);
  }

  // 2) Stars parallax (desktop only)
  const bg = document.querySelector(".stars-bg");
  const l1 = document.querySelector(".stars.layer1");
  const l2 = document.querySelector(".stars.layer2");
  const l3 = document.querySelector(".stars.layer3");

  if (!bg || !l1 || !l2 || !l3) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) return;

  bg.addEventListener("mousemove", (e) => {
    const rect = bg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    l1.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    l2.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
    l3.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
  });

  bg.addEventListener("mouseleave", () => {
    l1.style.transform = "translate(0,0)";
    l2.style.transform = "translate(0,0)";
    l3.style.transform = "translate(0,0)";
  });
});

// ===== Learning: Lessons Builder (ADD THIS) =====
document.addEventListener("DOMContentLoaded", () => {
  // only on learning page
  const lessonsSection = document.getElementById("lessons");
  const lessonsList = document.getElementById("lessonsList");
  const lessonView = document.getElementById("lessonView");
  const subtitle = document.getElementById("lessonsSubtitle");

  if (!lessonsSection || !lessonsList || !lessonView) return;

  // lessons data (you can edit text anytime)
  const DATA = {
    1: {
      title: "Level 1 — Foundations",
      lessons: [
        {
          t: "Lesson 1: How the Web Works",
          text: "You’ll understand what a browser is, what HTML/CSS/JS do, and how websites load.",
          code: `HTML = structure
CSS  = style
JS   = interaction`,
          task: {
            q: "Quick Task: Write 3 words describing what HTML does.",
            check: (v) => v.trim().length >= 5
          }
        },
        {
          t: "Lesson 2: HTML Structure",
          text: "Learn basic tags, semantic layout, and clean structure.",
          code: `<header>...</header>
<main>...</main>
<footer>...</footer>`,
          task: {
            q: "Quick Task: Type any HTML tag example (like <h1>Title</h1>).",
            check: (v) => v.includes("<") && v.includes(">")
          }
        },
        {
          t: "Lesson 3: CSS Basics",
          text: "Box model, spacing, fonts, colors — the base of beautiful design.",
          code: `.box{
  padding:16px;
  border-radius:14px;
}`,
          task: {
            q: "Quick Task: Type 'padding' and a number (example: padding: 10px;).",
            check: (v) => v.toLowerCase().includes("padding") && v.includes("px")
          }
        }
      ]
    },

    2: {
      title: "Level 2 — Core Skills",
      lessons: [
        {
          t: "Lesson 1: JavaScript Basics",
          text: "Variables, conditions, loops — core logic.",
          code: `let x = 5;
if(x > 3){ console.log("ok"); }`,
          task: {
            q: "Quick Task: Write a variable (example: let age = 20;).",
            check: (v) => v.toLowerCase().includes("let") || v.toLowerCase().includes("const")
          }
        },
        {
          t: "Lesson 2: DOM & Events",
          text: "Click a button, change text, open sections — this is where pages become alive.",
          code: `document.querySelector("button")
  .addEventListener("click", ()=> alert("Hi"));`,
          task: {
            q: "Quick Task: Type the word 'addEventListener' (just to remember it).",
            check: (v) => v.includes("addEventListener")
          }
        },
        {
          t: "Lesson 3: Forms & Validation",
          text: "Learn how to validate input like email, message length, etc.",
          code: `const ok = email.includes("@") && email.includes(".");`,
          task: {
            q: "Quick Task: Type an email example (example@mail.com).",
            check: (v) => v.includes("@") && v.includes(".")
          }
        }
      ]
    },

    3: {
      title: "Level 3 — Real Projects",
      lessons: [
        {
          t: "Lesson 1: Project Planning",
          text: "Before coding: plan sections, components, pages.",
          code: `Pages:
- Home
- About
- Media
- FAQ
- Contact`,
          task: {
            q: "Quick Task: Write 3 pages you want in your project.",
            check: (v) => v.trim().split(/\s+/).length >= 3
          }
        },
        {
          t: "Lesson 2: Build & Rebuild",
          text: "Build small, break, fix, improve — that’s the real learning method.",
          code: `Build → Break → Fix → Improve`,
          task: {
            q: "Quick Task: Type 'Build Break Fix Improve'.",
            check: (v) => v.toLowerCase().includes("build") && v.toLowerCase().includes("fix")
          }
        }
      ]
    },

    4: {
      title: "Level 4 — Job Ready",
      lessons: [
        {
          t: "Lesson 1: Portfolio Rules",
          text: "A professional portfolio = clean UI + clear projects + live links.",
          code: `✅ Live Demo
✅ GitHub Repo
✅ Short description`,
          task: {
            q: "Quick Task: Type 1 thing every project must have.",
            check: (v) => v.trim().length >= 3
          }
        }
      ]
    }
  };

  let currentLevel = null;
  let currentIndex = 0;

  function renderList(level) {
    currentLevel = level;
    currentIndex = 0;

    const pack = DATA[level];
    if (!pack) return;

    subtitle.textContent = pack.title;

    lessonsList.innerHTML = pack.lessons.map((L, i) => {
      return `
        <button class="lesson-item ${i === 0 ? "active" : ""}" data-i="${i}" type="button">
          <span>${L.t}</span>
          <span class="lesson-badge">Lesson ${i + 1}</span>
        </button>
      `;
    }).join("");

    lessonsList.querySelectorAll(".lesson-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.i || "0");
        currentIndex = i;
        setActive(i);
        renderLesson();
      });
    });

    renderLesson();
  }

  function setActive(i){
    lessonsList.querySelectorAll(".lesson-item").forEach((b, idx) => {
      b.classList.toggle("active", idx === i);
    });
  }

  function renderLesson() {
    const pack = DATA[currentLevel];
    if (!pack) return;

    const L = pack.lessons[currentIndex];

    lessonView.innerHTML = `
      <h3 class="lesson-title">${L.t}</h3>
      <p class="lesson-text">${L.text}</p>
      <pre class="lesson-code"><code>${escapeHtml(L.code || "")}</code></pre>

      <div class="lesson-actions">
        <button class="lesson-btn" id="prevLesson" type="button">Prev</button>
        <button class="lesson-btn" id="nextLesson" type="button">Next</button>
        <button class="lesson-btn primary" id="scrollTopLessons" type="button">Back to list</button>
      </div>

      <div class="lesson-task">
        <h4>Mini Task</h4>
        <p>${L.task?.q || "Try to write something related to this lesson."}</p>
        <input class="task-input" id="taskInput" placeholder="Type your answer here..." />
        <button class="lesson-btn primary" id="checkTask" type="button" style="margin-top:10px;">Check</button>
        <div class="task-msg" id="taskMsg"></div>
      </div>
    `;

    // buttons
    const prev = document.getElementById("prevLesson");
    const next = document.getElementById("nextLesson");
    const back = document.getElementById("scrollTopLessons");
    const check = document.getElementById("checkTask");
    const input = document.getElementById("taskInput");
    const msg = document.getElementById("taskMsg");

    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === pack.lessons.length - 1;

    prev.addEventListener("click", () => {
      if (currentIndex <= 0) return;
      currentIndex--;
      setActive(currentIndex);
      renderLesson();
    });

    next.addEventListener("click", () => {
      if (currentIndex >= pack.lessons.length - 1) return;
      currentIndex++;
      setActive(currentIndex);
      renderLesson();
    });

    back.addEventListener("click", () => {
      lessonsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    check.addEventListener("click", () => {
      const val = (input.value || "").trim();
      const ok = typeof L.task?.check === "function" ? L.task.check(val) : val.length >= 3;

      msg.textContent = ok ? "✅ Nice! You’re on the right track." : "❌ Try again (be more specific).";
      msg.style.color = ok ? "#86efac" : "#fca5a5";
    });
  }

  // Connect your existing "Start" buttons on levels
  document.querySelectorAll(".level-start").forEach((btn) => {
    btn.addEventListener("click", () => {
      // choose level based on card data-level OR button data-level
      const card = btn.closest("[data-level]");
      const level = Number(btn.dataset.level || card?.dataset.level || "0");
      if (!level || !DATA[level]) return;

      renderList(level);
      // scroll to lessons
      document.getElementById("lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // helper
  function escapeHtml(s){
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;");
  }
});

// ===== Learning: Auto open level + accordion + load lessons =====
document.addEventListener("DOMContentLoaded", () => {
  // اشتغل فقط إذا هاي صفحة learning فيها path
  const path = document.getElementById("path");
  if (!path) return;

  const levelCards = Array.from(document.querySelectorAll(".level-card"));
  const startBtns = Array.from(document.querySelectorAll(".level-start"));

  // افتح/سكر تفاصيل مستوى
  function toggleLevel(card, open = true) {
    const details = card.querySelector(".level-details");
    const btn = card.querySelector(".level-start");
    if (!details || !btn) return;

    // close all first (احترافي)
    levelCards.forEach(c => {
      const d = c.querySelector(".level-details");
      const b = c.querySelector(".level-start");
      if (d && b) {
        d.style.display = "none";
        d.setAttribute("aria-hidden", "true");
        b.setAttribute("aria-expanded", "false");
        c.classList.remove("is-open");
      }
    });

    if (open) {
      details.style.display = "block";
      details.setAttribute("aria-hidden", "false");
      btn.setAttribute("aria-expanded", "true");
      card.classList.add("is-open");
    }
  }

  // Load lessons بنفس الليفل (يعتمد على كود lessons اللي عندك)
  function loadLessonsForLevel(level) {
    // نحاكي كبسة زر Start على الlevel (اللي كاتبينه في lessons builder)
    // إذا عندك renderList داخلي، أسهل حل: نعمل click على زر start تبع نفس الكرت
    const card = document.querySelector(`.level-card[data-level="${level}"]`);
    if (!card) return;

    const btn = card.querySelector(".level-start");
    if (btn) btn.click(); // هذا رح ينفذ كود lessons builder تبعك
  }

  // زر Start يفتح التفاصيل + ينزل للدروس
  startBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".level-card");
      if (!card) return;

      const level = Number(card.dataset.level || "0");
      toggleLevel(card, true);

      // نزّل على الدروس
      const lessons = document.getElementById("lessons");
      if (lessons) lessons.scrollIntoView({ behavior: "smooth", block: "start" });

      // IMPORTANT:
      // إذا كود Lessons Builder عندك مربوط على .level-start
      // رح يشتغل لحاله لأنه نفس الزر انضغط.
      // (لو مش مربوط، خبرني وبخليه مباشر)
    });
  });

  // Auto-open from URL ?level=1
  const params = new URLSearchParams(window.location.search);
  const levelFromUrl = Number(params.get("level") || "0");
  if (levelFromUrl) {
    const card = document.querySelector(`.level-card[data-level="${levelFromUrl}"]`);
    if (card) {
      toggleLevel(card, true);

      // نزّل على الدروس بعد شوي حتى الصفحة تلحق تحمل
      setTimeout(() => {
        document.getElementById("lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
        // شغّل الدروس كمان (إذا حبيت)
        // loadLessonsForLevel(levelFromUrl);
      }, 300);
    }
  }
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // سكّر المنيو لما تضغط على رابط
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // سكّر المنيو إذا ضغطت برا
  document.addEventListener("click", (e) => {
    const clickedInside = mainNav.contains(e.target) || navToggle.contains(e.target);
    if (!clickedInside) {
      mainNav.classList.remove("open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}