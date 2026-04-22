/**
 * renderer.js — Shared DOM Rendering Utilities
 * ==============================================
 * Handles:
 *   - Page root swaps (with loading state)
 *   - Sidebar navigation tree
 *   - Breadcrumb updates
 *   - Sidebar open/close state
 *   - Generic HTML helpers
 */

import { store } from "./store.js";

// ── DOM References ───────────────────────────────────────────────
const pageRoot = document.getElementById("page-root");
const sidebarNav = document.getElementById("sidebar-nav");
const breadcrumbEl = document.getElementById("header-breadcrumb");
const loadingEl = document.getElementById("content-loading");
const sidebarEl = document.getElementById("sidebar");
const overlayEl = document.getElementById("sidebar-overlay");

// ── Page Rendering ───────────────────────────────────────────────

/**
 * Replace the main content area with new HTML.
 * Triggers a subtle fade-in animation.
 * @param {string} html
 */
export function renderPage(html) {
  hideLoading();
  pageRoot.innerHTML = html;
  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function showLoading() {
  loadingEl.hidden = false;
  pageRoot.innerHTML = "";
}

export function hideLoading() {
  loadingEl.hidden = true;
}

// ── Sidebar Navigation ───────────────────────────────────────────

/**
 * Render the full sidebar navigation tree from sections data.
 * Called once after sections.json is loaded.
 * @param {Array} sections
 */
export function renderSidebarNav(sections) {
  if (!sections) return;

  const activeSectionId = store.get("activeSectionId");
  const activeSubId = store.get("activeSubId");
  const activeDtcCode = store.get("activeDtcCode");

  let html = "";

  sections.forEach((section) => {
    const isActive = activeSectionId === section.id;
    const isExpanded = isActive;

    // Section button
    html += `
      <div class="nav-section" data-section-id="${section.id}">
        <button
          class="nav-section-btn ${isActive ? "active-section" : ""}"
          aria-expanded="${isExpanded}"
          data-section-id="${section.id}"
          data-is-dtc="${section.isDtcSection || false}"
        >
          <span class="nav-section-num">${section.id}</span>
          <span class="nav-section-label">${escapeHtml(section.title)}</span>
          <svg class="nav-section-arrow" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
    `;

    // Subsection list (only for non-DTC sections with subsections)
    if (!section.isDtcSection && section.subsections?.length > 0) {
      html += `<ul class="nav-subsection-list ${isExpanded ? "is-open" : ""}"
                   id="nav-sub-list-${section.id}">`;

      section.subsections.forEach((sub) => {
        const isActiveSub = activeSubId === sub.id;
        html += `
          <li>
            <a href="#/section/${section.id}/${sub.id}"
               class="nav-subsection-link ${isActiveSub ? "active-sub" : ""}"
               data-sub-id="${sub.id}">
              <span class="nav-sub-id">${escapeHtml(sub.id)}</span>
              <span class="nav-sub-label">${escapeHtml(sub.title)}</span>
            </a>
          </li>
        `;
      });

      html += `</ul>`;
    }

    html += `</div>`; // end nav-section
  });

  // DTC standalone nav link (always at bottom)
  html += `
    <a href="#/dtc"
       class="nav-dtc-link ${activeDtcCode ? "active-dtc" : ""}"
       aria-label="Danh mục mã lỗi DTC">
      <span class="nav-dtc-dot"></span>
      <span class="nav-dtc-label">Tra Cứu Mã Lỗi DTC</span>
    </a>
  `;

  sidebarNav.innerHTML = html;

  // Wire up toggle buttons
  _bindSidebarToggles();
}

/**
 * Update the active highlights in the sidebar without full re-render.
 * More efficient than calling renderSidebarNav() on every nav.
 */
export function updateSidebarActive() {
  const activeSectionId = store.get("activeSectionId");
  const activeSubId = store.get("activeSubId");

  // Update section buttons
  sidebarNav.querySelectorAll(".nav-section-btn").forEach((btn) => {
    const id = parseInt(btn.dataset.sectionId, 10);
    btn.classList.toggle("active-section", id === activeSectionId);

    // Update num badge style (done via class above)
  });

  // Update subsection links
  sidebarNav.querySelectorAll(".nav-subsection-link").forEach((link) => {
    link.classList.toggle("active-sub", link.dataset.subId === activeSubId);
  });

  // Expand/collapse subsection lists
  sidebarNav.querySelectorAll(".nav-subsection-list").forEach((list) => {
    const sectionId = parseInt(list.id.replace("nav-sub-list-", ""), 10);
    list.classList.toggle("is-open", sectionId === activeSectionId);
  });

  // Update section btn aria-expanded
  sidebarNav.querySelectorAll(".nav-section-btn").forEach((btn) => {
    const id = parseInt(btn.dataset.sectionId, 10);
    btn.setAttribute(
      "aria-expanded",
      id === activeSectionId ? "true" : "false",
    );
  });
}

// ── Breadcrumb ───────────────────────────────────────────────────

/**
 * Update the header breadcrumb.
 * @param {Array<{label: string, href?: string}>} items
 */
export function renderBreadcrumb(items) {
  if (!items.length) {
    breadcrumbEl.innerHTML = "";
    return;
  }

  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const sep = i > 0 ? `<span class="breadcrumb-sep">›</span>` : "";

    if (isLast || !item.href) {
      return `${sep}<span class="breadcrumb-item active">${escapeHtml(item.label)}</span>`;
    }
    return `${sep}<a href="${item.href}" class="breadcrumb-item">${escapeHtml(item.label)}</a>`;
  });

  breadcrumbEl.innerHTML = parts.join("");
}

// ── Sidebar Open/Close ───────────────────────────────────────────

export function openSidebar() {
  sidebarEl.classList.add("is-open");
  overlayEl.classList.add("is-visible");
  store.set("sidebarOpen", true);
  document.body.style.overflow = "hidden"; // prevent background scroll
}

export function closeSidebar() {
  sidebarEl.classList.remove("is-open");
  overlayEl.classList.remove("is-visible");
  store.set("sidebarOpen", false);
  document.body.style.overflow = "";
}

export function toggleSidebar() {
  store.get("sidebarOpen") ? closeSidebar() : openSidebar();
}

// ── HTML Helpers ─────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escapeHtml(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build a simple back button HTML string.
 * @param {string} href
 * @param {string} label
 */
export function backButtonHtml(href, label = "Quay lại") {
  return `
    <a href="${href}" class="btn-back">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      ${escapeHtml(label)}
    </a>
  `;
}

/**
 * Image or placeholder if src not provided.
 */
export function imageOrPlaceholder(img) {
  if (img.src) {
    return `
      <figure style="margin: var(--space-6) 0;">
        <img src="${escapeHtml(img.src)}"
             alt="${escapeHtml(img.alt || "")}"
             style="max-width:100%; border-radius: var(--radius-md); border: var(--border-thin);"
             loading="lazy" />
        ${
          img.caption
            ? `<figcaption style="font-size:var(--text-sm); color:var(--color-slate-500);
                                 margin-top:var(--space-2); font-style:italic; text-align:center;">
               ${escapeHtml(img.caption)}
             </figcaption>`
            : ""
        }
      </figure>
    `;
  }

  return `
    <div class="img-placeholder">
      <span class="img-placeholder-icon">🖼️</span>
      <span class="img-placeholder-caption">
        ${escapeHtml(img.caption || "Hình ảnh sẽ được bổ sung")}
      </span>
    </div>
  `;
}

/**
 * Severity badge HTML.
 */
export function severityBadge(severity) {
  const labels = { high: "Nghiêm trọng", medium: "Trung bình", low: "Nhẹ" };
  const label = labels[severity] || severity;
  return `<span class="badge badge-severity-${severity}">${escapeHtml(label)}</span>`;
}

// ── Private ──────────────────────────────────────────────────────

function _bindSidebarToggles() {
  sidebarNav.querySelectorAll(".nav-section-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = parseInt(btn.dataset.sectionId, 10);
      const isDtc = btn.dataset.isDtc === "true";

      if (isDtc) {
        window.location.hash = "#/dtc";
        closeSidebar();
        return;
      }

      // Navigate to section overview
      window.location.hash = `#/section/${sectionId}`;

      // On mobile, clicking a section doesn't close sidebar
      // (user still needs to pick a sub-section)
    });
  });

  // Close sidebar when a sub-section link is clicked on mobile
  sidebarNav.querySelectorAll(".nav-subsection-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });
}
