/* =====================================================
   ALUMNIHUB — MAIN.JS
   All interactivity, data, and dynamic rendering
   ===================================================== */

const API_BASE_URL = 'https://alumni-backend-hjbi.onrender.com/';

// ─── Data ────────────────────────────────────────────

const eventsData = [
  {
    id: 1,
    title: "Annual Alumni Homecoming 2026",
    date: "Apr 15, 2026",
    time: "10:00 AM",
    location: "Main Campus Auditorium",
    type: "person",
    tag: "Networking",
  },
  {
    id: 2,
    title: "Tech Industry Panel Discussion",
    date: "Apr 22, 2026",
    time: "6:00 PM",
    location: "Virtual (Zoom)",
    type: "virtual",
    tag: "Career",
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    date: "May 5, 2026",
    time: "7:00 PM",
    location: "Innovation Hub, Building C",
    type: "person",
    tag: "Entrepreneurship",
  },
  {
    id: 4,
    title: "Resume Workshop with HR Leaders",
    date: "May 12, 2026",
    time: "3:00 PM",
    location: "Virtual (Google Meet)",
    type: "virtual",
    tag: "Career",
  },
];

const alumniData = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    classYear: "Class of 2018",
    role: "Senior Engineer at Google",
    location: "San Francisco",
    skills: ["React", "ML"],
    color: "#1e3a8a",
    category: "engineering",
  },
  {
    id: 2,
    name: "James Okafor",
    initials: "JO",
    classYear: "Class of 2016",
    role: "Product Manager at Microsoft",
    location: "Seattle",
    skills: ["Strategy", "UX"],
    color: "#0d9488",
    category: "business",
  },
  {
    id: 3,
    name: "Priya Sharma",
    initials: "PS",
    classYear: "Class of 2019",
    role: "Data Scientist at Meta",
    location: "New York",
    skills: ["Python", "AI"],
    color: "#7c3aed",
    category: "data",
  },
  {
    id: 4,
    name: "Alex Rivera",
    initials: "AR",
    classYear: "Class of 2015",
    role: "UX Lead at Apple",
    location: "Cupertino",
    skills: ["Figma", "Design Systems"],
    color: "#dc2626",
    category: "design",
  },
  {
    id: 5,
    name: "Emily Zhang",
    initials: "EZ",
    classYear: "Class of 2020",
    role: "Frontend Dev at Netflix",
    location: "Los Angeles",
    skills: ["Vue", "TypeScript"],
    color: "#0891b2",
    category: "engineering",
  },
  {
    id: 6,
    name: "David Kim",
    initials: "DK",
    classYear: "Class of 2014",
    role: "CTO at FinTech Startup",
    location: "Chicago",
    skills: ["Leadership", "Blockchain"],
    color: "#ea580c",
    category: "engineering",
  },
];

const forumData = [
  {
    id: 1,
    title: "Tips for transitioning from academia to industry?",
    preview:
      "I'm finishing my PhD and looking to move into a data science role. Any alumni who made a similar transition have advice on how to position myself?",
    tag: "Career Advice",
    author: "Maya Patel",
    initials: "MP",
    color: "#7c3aed",
    time: "2h ago",
    replies: 12,
    likes: 24,
  },
  {
    id: 2,
    title: "Best resources for system design interviews?",
    preview:
      "I have upcoming interviews at FAANG companies and want to prepare for system design rounds. What books, courses, or mock interview platforms do you recommend?",
    tag: "Interview Prep",
    author: "Ryan Choi",
    initials: "RC",
    color: "#0891b2",
    time: "5h ago",
    replies: 8,
    likes: 19,
  },
  {
    id: 3,
    title: "Remote work vs. in-office: what's working for you?",
    preview:
      "With more companies pushing RTO policies, I'm curious how alumni in tech are navigating this. Are you staying remote, going hybrid, or back in office full-time?",
    tag: "Remote Work",
    author: "Lisa Morgan",
    initials: "LM",
    color: "#dc2626",
    time: "1d ago",
    replies: 21,
    likes: 37,
  },
  {
    id: 4,
    title: "How to negotiate salary at a startup?",
    preview:
      "I received an offer from a Series B startup. The base salary is lower than market rate, but they're offering equity. How should I think about this?",
    tag: "Startups",
    author: "Tom Nguyen",
    initials: "TN",
    color: "#ea580c",
    time: "2d ago",
    replies: 15,
    likes: 28,
  },
];

// ─── DOM Ready ───────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  checkAuth();
  fetchEvents();
  fetchAlumni();
  renderForum();
  initNav();
  initModal();
  initSearch();
  initFilters();
  initMentorship();
  initScrollSpy();
  initIntersectionAnimations();
});

// ─── Theme Toggle ────────────────────────────────────

function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("alumnihub-theme");

  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else {
    // Default to light
    document.documentElement.setAttribute("data-theme", "light");
  }

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("alumnihub-theme", next);

    // Animate toggle button
    toggle.style.transform = "rotate(360deg) scale(1.1)";
    setTimeout(() => {
      toggle.style.transform = "";
    }, 400);
  });
}

// ─── Render Events ───────────────────────────────────

async function fetchEvents() {
  try {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        renderEvents(data);
        return;
      }
    }
    renderEvents(eventsData);
  } catch (err) {
    console.warn("Backend not reachable", err);
    renderEvents(eventsData);
  }
}

function renderEvents(dataArr) {
  const data = dataArr || eventsData;
  const grid = document.getElementById("events-grid");
  grid.innerHTML = data
    .map(
      (e, i) => `
    <div class="event-card" style="animation-delay: ${i * 0.1}s" id="event-${e._id || e.id}">
      <span class="event-badge ${e.type === "person" || e.type === "in-person" ? "badge-person" : "badge-virtual"}">
        ${e.type === "person" || e.type === "in-person" ? "In-Person" : "Virtual"}
      </span>
      <h3 class="event-title">${e.title}</h3>
      <div class="event-meta">
        <span class="event-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${e.date}
        </span>
        <span class="event-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ${e.time}
        </span>
        <span class="event-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${e.location}
        </span>
      </div>
      <span class="event-tag">${e.tag}</span>
    </div>
  `
    )
    .join("");
}

// ─── Render Alumni ───────────────────────────────────

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);
}

function getColorForName(name) {
  const colors = ["#1e3a8a", "#0d9488", "#7c3aed", "#dc2626", "#0891b2", "#ea580c"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

async function fetchAlumni() {
  try {
    const res = await fetch(`${API_BASE_URL}/users?role=alumni`);
    if (res.ok) {
      const rawData = await res.json();
      if (rawData && rawData.length > 0) {
        const mappedData = rawData.map(u => ({
          ...u,
          id: u._id,
          initials: getInitials(u.name),
          color: getColorForName(u.name),
          classYear: u.passingYear ? `Class of ${u.passingYear}` : (u.branch || "Alumni"),
          role: u.company || "Alumni",
          category: 'engineering'
        }));
        alumniData.length = 0;
        alumniData.push(...mappedData);
        renderAlumni(mappedData);
        return;
      }
    }
    renderAlumni(alumniData);
  } catch (err) {
    console.warn("Backend not reachable", err);
    renderAlumni(alumniData);
  }
}

function renderAlumni(dataArr) {
  const grid = document.getElementById("directory-grid");
  const data = dataArr || alumniData;
  grid.innerHTML = data
    .map(
      (a, i) => `
    <div class="alumni-card" style="animation-delay: ${i * 0.08}s" id="alumni-${a.id || a._id}" data-category="${a.category}">
      <div class="alumni-header">
        <div class="alumni-avatar" style="background: ${a.color};">${a.initials}</div>
        <div>
          <div class="alumni-name">${a.name}</div>
          <div class="alumni-class">${a.classYear}</div>
        </div>
      </div>
      <div class="alumni-info">
        <div class="alumni-info-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          ${a.role}
        </div>
        <div class="alumni-info-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${a.location}
        </div>
      </div>
      <div class="alumni-skills">
        ${a.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
      </div>
      <div class="alumni-actions">
        <button class="btn-connect" onclick="handleConnect('${a.name}')">Connect</button>
        <button class="btn-linkedin" aria-label="LinkedIn profile" title="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  if (data.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 48px 20px; color: var(--text-muted); font-size: 0.95rem;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; display:block; opacity:0.4">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      No alumni found matching your search.
    </div>`;
  }
}

// ─── Render Forum ────────────────────────────────────

function renderForum() {
  const container = document.getElementById("forum-threads");
  container.innerHTML = forumData
    .map(
      (t, i) => `
    <div class="thread-card" style="animation-delay: ${i * 0.1}s" id="thread-${t.id}">
      <div class="thread-header">
        <h3 class="thread-title">${t.title}</h3>
        <span class="thread-tag">${t.tag}</span>
      </div>
      <p class="thread-preview">${t.preview}</p>
      <div class="thread-footer">
        <div class="thread-author">
          <div class="thread-avatar" style="background: ${t.color};">${t.initials}</div>
          <span class="thread-author-name">${t.author}</span>
          <span class="thread-time">· ${t.time}</span>
        </div>
        <div class="thread-stats">
          <span class="thread-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            ${t.replies}
          </span>
          <span class="thread-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            ${t.likes}
          </span>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// ─── Navigation ──────────────────────────────────────

function initNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close on link click (mobile)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      navbar.style.boxShadow =
        "0 4px 20px rgba(0,0,0,0.08)";
    } else {
      navbar.style.boxShadow = "var(--navbar-shadow)";
    }
    lastScroll = scrollY;
  });
}

// ─── Scroll Spy ──────────────────────────────────────

function initScrollSpy() {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("data-section") === id
            );
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -70% 0px",
    }
  );

  sections.forEach((s) => observer.observe(s));
}

// ─── Intersection Animation ────────────────────────

function initIntersectionAnimations() {
  const animatedElements = document.querySelectorAll(
    ".event-card, .alumni-card, .thread-card, .stat-item, .feature-item"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
}

// ─── Modal ───────────────────────────────────────────

function initModal() {
  const signinModal = document.getElementById("signin-modal");
  const signupModal = document.getElementById("signup-modal");
  const openSigninBtn = document.getElementById("signin-btn");
  const closeSigninBtn = document.getElementById("modal-close");
  const closeSignupBtn = document.getElementById("signup-modal-close");
  const signinForm = document.getElementById("signin-form");
  const signupForm = document.getElementById("signup-form");
  
  const signupLink = document.getElementById("signup-link");
  const loginLink = document.getElementById("login-link");

  if (openSigninBtn) openSigninBtn.addEventListener("click", () => signinModal.classList.add("open"));
  if (closeSigninBtn) closeSigninBtn.addEventListener("click", () => signinModal.classList.remove("open"));
  if (closeSignupBtn) closeSignupBtn.addEventListener("click", () => signupModal.classList.remove("open"));

  if (signupLink) {
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      signinModal.classList.remove("open");
      signupModal.classList.add("open");
    });
  }

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      signupModal.classList.remove("open");
      signinModal.classList.add("open");
    });
  }

  // Close on outside click
  [signinModal, signupModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (signinModal) signinModal.classList.remove("open");
      if (signupModal) signupModal.classList.remove("open");
    }
  });

  // Signin Form submit
  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email-input").value;
      const password = document.getElementById("password-input").value;
      const btn = signinForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Signing in...";

      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
           localStorage.setItem("alumnihub-token", data.token);
           localStorage.setItem("alumnihub-user", JSON.stringify(data.user));
           signinModal.classList.remove("open");
           showToast("Welcome back! You have signed in successfully.");
           checkAuth();
        } else {
           showToast(data.message || "Failed to sign in.");
        }
      } catch (err) {
        showToast("Error connecting to server.");
      } finally {
        btn.textContent = originalText;
      }
    });
  }

  // Signup Form submit
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const role = document.getElementById("signup-role").value;
      const branch = document.getElementById("signup-branch").value;
      const passingYear = document.getElementById("signup-year").value;
      const btn = signupForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Creating...";

      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ name, email, password, role, branch, passingYear: Number(passingYear) || null })
        });
        const data = await res.json();
        
        if (res.ok) {
           signupModal.classList.remove("open");
           showToast(data.message || "Registration successful!");
           if (role === 'student') {
             setTimeout(() => { signinModal.classList.add("open"); }, 1000);
           }
        } else {
           showToast(data.message || "Failed to register.");
        }
      } catch (err) {
        showToast("Error connecting to server.");
      } finally {
        btn.textContent = originalText;
      }
    });
  }
}

// ─── Search ──────────────────────────────────────────

function initSearch() {
  const input = document.getElementById("search-input");

  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = alumniData.filter((a) => {
      return (
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.skills.some((s) => s.toLowerCase().includes(q))
      );
    });

    // Also apply active filter
    const activeChip = document.querySelector(".chip.active");
    const filterVal = activeChip
      ? activeChip.getAttribute("data-filter")
      : "all";

    const result =
      filterVal === "all"
        ? filtered
        : filtered.filter((a) => a.category === filterVal);

    renderAlumni(result);
    initIntersectionAnimations();
  });
}

// ─── Filter Chips ────────────────────────────────────

function initFilters() {
  const chips = document.querySelectorAll(".chip");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.getAttribute("data-filter");
      const searchVal = document.getElementById("search-input").value.toLowerCase().trim();

      let filtered = alumniData;
      if (filter !== "all") {
        filtered = alumniData.filter((a) => a.category === filter);
      }

      if (searchVal) {
        filtered = filtered.filter(
          (a) =>
            a.name.toLowerCase().includes(searchVal) ||
            a.role.toLowerCase().includes(searchVal) ||
            a.location.toLowerCase().includes(searchVal) ||
            a.skills.some((s) => s.toLowerCase().includes(searchVal))
        );
      }

      renderAlumni(filtered);
      initIntersectionAnimations();
    });
  });
}

// ─── Mentorship Form ─────────────────────────────────

function initMentorship() {
  const matchBtn = document.getElementById("request-match-btn");
  const mentorBtn = document.getElementById("become-mentor-btn");

  matchBtn.addEventListener("click", () => {
    const field = document.getElementById("field-select").value;
    const helpText = document.getElementById("help-textarea").value.trim();

    if (!helpText) {
      showToast("Please describe what you need help with.");
      return;
    }

    showToast(
      `Mentor match requested for ${field}! We'll notify you within 48 hours.`
    );
    document.getElementById("help-textarea").value = "";
  });

  mentorBtn.addEventListener("click", () => {
    showToast(
      "Thank you for your interest! Mentor registration form will be sent to your email."
    );
  });

  // CTA Buttons on hero
  const joinBtn = document.getElementById("join-btn");
  const exploreBtn = document.getElementById("explore-btn");

  joinBtn.addEventListener("click", () => {
    document.getElementById("signin-modal").classList.add("open");
  });

  exploreBtn.addEventListener("click", () => {
    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
  });

  // View All Events button
  const viewAllBtn = document.getElementById("view-all-events");
  viewAllBtn.addEventListener("click", () => {
    showToast("All events page coming soon!");
  });

  // New Post button
  const newPostBtn = document.getElementById("new-post-btn");
  newPostBtn.addEventListener("click", () => {
    showToast("Please sign in to create a new discussion post.");
  });
}

// ─── Connect Handler (global) ────────────────────────

function handleConnect(name) {
  showToast(`Connection request sent to ${name}!`);
}

// ─── Toast ───────────────────────────────────────────

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ─── Authentication ────────────────────────────────────

function checkAuth() {
  const token = localStorage.getItem("alumnihub-token");
  const userStr = localStorage.getItem("alumnihub-user");
  const signinBtn = document.getElementById("signin-btn");
  const userProfile = document.getElementById("user-profile");
  const userNameDisplay = document.getElementById("user-name-display");

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (signinBtn) signinBtn.style.display = "none";
      if (userProfile) userProfile.style.display = "flex";
      if (userNameDisplay) userNameDisplay.textContent = user.name || "User";
      
      // Auth-only actions
      const newPostBtn = document.getElementById("new-post-btn");
      if (newPostBtn) {
        newPostBtn.onclick = () => showToast("New post form coming soon!");
      }
    } catch (e) {
      if (signinBtn) signinBtn.style.display = "block";
      if (userProfile) userProfile.style.display = "none";
    }
  } else {
    if (signinBtn) signinBtn.style.display = "block";
    if (userProfile) userProfile.style.display = "none";
  }

  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.onclick = () => {
      localStorage.removeItem("alumnihub-token");
      localStorage.removeItem("alumnihub-user");
      showToast("You have been signed out.");
      checkAuth();
      const newPostBtn = document.getElementById("new-post-btn");
      if (newPostBtn) newPostBtn.onclick = () => showToast("Please sign in to create a new discussion post.");
    };
  }
}
