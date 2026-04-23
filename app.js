/**
 * app.js — Application Entry Point
 * ==================================
 * Bootstraps the entire SPA:
 *   1. Initializes the Router with all routes
 *   2. Loads initial data (sections) for sidebar
 *   3. Wires up global UI events (sidebar toggle, search)
 *
 * Import order: core modules first, then feature modules.
 */

import { Router } from "./core/router.js";
import { store } from "./core/store.js";
import {
  renderSidebarNav,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  escapeHtml,
} from "./core/renderer.js";
import { renderHome } from "./modules/home.js";
import { renderSection, renderSubSection } from "./modules/section.js";
import { renderDtcList, renderDtcDetail } from "./modules/dtc.js";

// ─── 1. Define Routes ────────────────────────────────────────────

const router = new Router({
  "": (p, q) => renderHome(),
  "/": (p, q) => renderHome(),
  "/section/:id": (p, q) => renderSection(p),
  "/section/:id/:subId": (p, q) => renderSubSection(p),
  "/dtc": (p, q) => renderDtcList(p, q),
  "/dtc/:code": (p, q) => renderDtcDetail(p),
});

// ─── 2. Bootstrap ────────────────────────────────────────────────

async function init() {
  try {
    // Pre-load sections data so sidebar renders immediately
    const sections = await store.loadSections();
    renderSidebarNav(sections);
  } catch (err) {
    console.error("[App] Could not load sections for sidebar:", err);
  }

  // Start the router (triggers initial route)
  router.init();

  // Wire up global UI
  _initSidebarControls();
  _initSearch();
}

// ─── 3. Sidebar Controls ─────────────────────────────────────────

function _initSidebarControls() {
  const btnToggle = document.getElementById("btn-sidebar-toggle");
  const btnClose = document.getElementById("btn-sidebar-close");
  const overlay = document.getElementById("sidebar-overlay");

  btnToggle?.addEventListener("click", toggleSidebar);
  btnClose?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (store.get("sidebarOpen")) closeSidebar();
      if (store.get("searchOpen")) closeSearch();
    }
  });

  // On desktop resize, ensure sidebar state is reset
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      // Desktop — always visible, clear mobile classes
      document.getElementById("sidebar")?.classList.remove("is-open");
      document
        .getElementById("sidebar-overlay")
        ?.classList.remove("is-visible");
      document.body.style.overflow = "";
      store.set("sidebarOpen", false);
    }
  });
}

// ─── 4. Search ───────────────────────────────────────────────────

let _searchIndex = null; // Built lazily on first search open

function _initSearch() {
  const btnSearch = document.getElementById("btn-search");
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  btnSearch?.addEventListener("click", openSearch);

  // Close when clicking outside modal-box
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  // Keyboard shortcut: Ctrl+K or Cmd+K
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  // Live search
  input?.addEventListener("input", () => {
    const query = input.value.trim();
    if (query.length < 2) {
      results.innerHTML = '<p class="search-hint">Nhập ít nhất 2 ký tự...</p>';
      return;
    }
    _performSearch(query, results);
  });
}

function openSearch() {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input");
  if (!modal) return;

  modal.hidden = false;
  store.set("searchOpen", true);
  setTimeout(() => input?.focus(), 50);

  // Build index lazily
  _buildSearchIndex();
}

function closeSearch() {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!modal) return;

  modal.hidden = true;
  store.set("searchOpen", false);
  if (input) input.value = "";
  if (results)
    results.innerHTML =
      '<p class="search-hint">Nhập từ khóa để tìm kiếm...</p>';
}

/**
 * Build a flat search index from cached JSON data.
 * Structure: [ { type, title, subtitle, href, keywords } ]
 */
async function _buildSearchIndex() {
  if (_searchIndex) return;
  _searchIndex = [];

  try {
    const sections = await store.loadSections();

    for (const section of sections) {
      // Add section itself
      _searchIndex.push({
        type: "section",
        title: `Chương ${section.id}: ${section.title}`,
        subtitle: section.description,
        href: `#/section/${section.id}`,
        keywords: _removeDiacritics(`${section.title} ${section.description}`),
      });

      // Add each subsection (from section metadata)
      for (const sub of section.subsections || []) {
        _searchIndex.push({
          type: "section",
          title: `${sub.id} — ${sub.title}`,
          subtitle: `Chương ${section.id}: ${section.title}`,
          href: `#/section/${section.id}/${sub.id}`,
          keywords: _removeDiacritics(
            `${sub.id} ${sub.title} ${section.title}`,
          ),
        });
      }
    }

    // Add DTC codes
    const dtcData = await store.loadDtc();
    for (const dtc of dtcData.codes) {
      _searchIndex.push({
        type: "dtc",
        title: `${dtc.code} — ${dtc.title}`,
        subtitle: `Triệu chứng: ${dtc.symptom.substring(0, 80)}...`,
        href: `#/dtc/${dtc.code}`,
        keywords: _removeDiacritics(`${dtc.code} ${dtc.title} ${dtc.symptom}`),
      });
    }
  } catch (err) {
    console.warn("[Search] Could not build index:", err);
  }
}

function _performSearch(query, resultsEl) {
  if (!_searchIndex) {
    resultsEl.innerHTML =
      '<p class="search-hint">Đang tải dữ liệu tìm kiếm...</p>';
    return;
  }

  const normalizedQuery = _removeDiacritics(query);
  const matches = _searchIndex
    .filter((item) => item.keywords.includes(normalizedQuery))
    .slice(0, 8); // max 8 results

  if (!matches.length) {
    resultsEl.innerHTML = `<p class="search-hint">Không tìm thấy kết quả cho "<strong>${escapeHtml(query)}</strong>"</p>`;
    return;
  }

  const html = matches
    .map((item) => {
      // Highlight matching text
      const titleHighlighted = _highlight(item.title, query);
      return `
      <a href="${item.href}" class="search-result-item" data-href="${item.href}">
        <div class="search-result-title">
          <span class="search-result-type type-${item.type}">
            ${item.type === "dtc" ? "DTC" : "Mục"}
          </span>
          ${titleHighlighted}
        </div>
        <div class="search-result-meta">${escapeHtml(item.subtitle)}</div>
      </a>
    `;
    })
    .join("");

  resultsEl.innerHTML = html;

  // Close search when a result is clicked
  resultsEl.querySelectorAll(".search-result-item").forEach((link) => {
    link.addEventListener("click", () => {
      closeSearch();
    });
  });
}

/**
 * Highlight matching query substring in text.
 */
function _highlight(text, query) {
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${_escapeRegex(query)})`, "gi");
  return escaped.replace(regex, "<mark>$1</mark>");
}

function _escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Remove Vietnamese diacritics for accent-insensitive search.
 * Example: "Biến Mô Thủy Lực" → "bien mo thuy luc"
 *
 * Works by:
 *   1. Normalizing to NFD (separates base chars from combining marks)
 *   2. Removing all combining diacritical marks (U+0300–U+036F)
 *   3. Handling đ/Đ specially (not decomposable in Unicode)
 *   4. Lowercasing the result
 */
function _removeDiacritics(str) {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

// ─── Start ───────────────────────────────────────────────────────
init();
