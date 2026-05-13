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
import { initLightbox } from "./core/lightbox.js";
import { renderHome } from "./modules/home.js";
import { renderSection, renderSubSection } from "./modules/section.js";
import { renderDtcList, renderDtcDetail } from "./modules/dtc.js";

// ─── 1. Define Routes ────────────────────────────────────────────

const router = new Router({
  "": (p, q) => {
    _setHomeMode(true);
    return renderHome();
  },
  "/": (p, q) => {
    _setHomeMode(true);
    return renderHome();
  },
  "/section/:id": (p, q) => {
    _setHomeMode(false);
    return renderSection(p);
  },
  "/section/:id/:subId": (p, q) => {
    _setHomeMode(false);
    return renderSubSection(p);
  },
  "/dtc": (p, q) => {
    _setHomeMode(false);
    return renderDtcList(p, q);
  },
  "/dtc/:code": (p, q) => {
    _setHomeMode(false);
    return renderDtcDetail(p);
  },
});

/**
 * Toggle body class `is-home` — used to hide site-footnote on home page
 * (since home has its own university card).
 */
function _setHomeMode(isHome) {
  document.body.classList.toggle("is-home", isHome);
}

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
  _initLightbox();
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

  // On resize between mobile/desktop, clean up overlay-mode state
  // (do NOT touch sidebar-collapsed class — that's user preference for desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      // Going to desktop — clear mobile-overlay mode artifacts
      document.getElementById("sidebar")?.classList.remove("is-open");
      document
        .getElementById("sidebar-overlay")
        ?.classList.remove("is-visible");
      document.body.style.overflow = "";
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
 * Structure: [ { type, title, subtitle, href, keywords, excerpt? } ]
 *
 * Indexes BOTH metadata (titles) AND full content (intro, keyPoints, explain, table)
 * from each section-N.json file, plus all DTC codes.
 */
async function _buildSearchIndex() {
  if (_searchIndex) return;
  _searchIndex = [];

  try {
    const sections = await store.loadSections();

    for (const section of sections) {
      // 1) Add section itself (chapter-level)
      _searchIndex.push({
        type: "section",
        title: `Chương ${section.id}: ${section.title}`,
        subtitle: section.description || "",
        href: `#/section/${section.id}`,
        keywords: _removeDiacritics(
          `${section.title} ${section.description || ""}`,
        ),
      });

      // 2) Add each subsection (title only — for quick top match)
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

      // 3) NEW: Load full section data and index content of each subsection
      // Skip DTC sections (no subsection content files)
      if (section.isDtcSection) continue;

      try {
        const sectionData = await store.loadSection(section.id);
        if (!sectionData || !sectionData.subsections) continue;

        for (const sub of sectionData.subsections) {
          const content = sub.content;
          if (!content) continue;

          // 3a) Intro paragraph
          if (content.intro) {
            _addContentEntry(
              _searchIndex,
              section,
              sub,
              "Giới thiệu",
              content.intro,
            );
          }

          // 3b) Key points (array of strings)
          if (Array.isArray(content.keyPoints)) {
            content.keyPoints.forEach((point) => {
              _addContentEntry(_searchIndex, section, sub, "Ý chính", point);
            });
          }

          // 3c) Explain blocks (array of {title, text, caption})
          if (Array.isArray(content.explain)) {
            content.explain.forEach((block) => {
              const blockTitle = block.title || "Nội dung chi tiết";
              if (block.text) {
                _addContentEntry(
                  _searchIndex,
                  section,
                  sub,
                  blockTitle,
                  block.text,
                );
              }
              if (block.caption) {
                _addContentEntry(
                  _searchIndex,
                  section,
                  sub,
                  blockTitle,
                  block.caption,
                );
              }
            });
          }

          // 3d) Table headers + rows
          if (content.table) {
            const tableTitle = content.table.title || "Bảng dữ liệu";
            if (Array.isArray(content.table.rows)) {
              content.table.rows.forEach((row) => {
                const rowText = Array.isArray(row) ? row.join(" — ") : "";
                if (rowText) {
                  _addContentEntry(
                    _searchIndex,
                    section,
                    sub,
                    tableTitle,
                    rowText,
                  );
                }
              });
            }
          }
        }
      } catch (e) {
        console.warn(`[Search] Could not load section ${section.id}:`, e);
      }
    }

    // 4) Add DTC codes
    const dtcData = await store.loadDtc();
    for (const dtc of dtcData.codes) {
      _searchIndex.push({
        type: "dtc",
        title: `${dtc.code} — ${dtc.title}`,
        subtitle: `Triệu chứng: ${(dtc.symptom || "").substring(0, 80)}...`,
        href: `#/dtc/${dtc.code}`,
        keywords: _removeDiacritics(
          `${dtc.code} ${dtc.title} ${dtc.symptom || ""}`,
        ),
      });
    }

    console.log(`[Search] Built index with ${_searchIndex.length} entries`);
  } catch (err) {
    console.warn("[Search] Could not build index:", err);
  }
}

/**
 * Helper: Push a content-level search entry into the index.
 * `text` is the original (with diacritics) — stored as excerpt for display.
 * `keywords` is the diacritics-removed lowercase version for matching.
 */
function _addContentEntry(index, section, sub, blockTitle, text) {
  // Strip markdown markers (** for bold, • for bullets) for cleaner display
  const cleanText = String(text)
    .replace(/\*\*/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleanText) return;

  index.push({
    type: "content",
    title: `${sub.id} — ${sub.title}`,
    subtitle: `Chương ${section.id}: ${section.title} › ${blockTitle}`,
    href: `#/section/${section.id}/${sub.id}`,
    keywords: _removeDiacritics(cleanText),
    excerpt: cleanText, // original text for context display
  });
}

function _performSearch(query, resultsEl) {
  if (!_searchIndex) {
    resultsEl.innerHTML =
      '<p class="search-hint">Đang tải dữ liệu tìm kiếm...</p>';
    return;
  }

  const normalizedQuery = _removeDiacritics(query);
  let matches = _searchIndex.filter((item) =>
    item.keywords.includes(normalizedQuery),
  );

  // Dedup: each href appears only ONCE, with the best (first) match
  // BUT keep section-level matches and content matches separate so user
  // sees both "the section" and "specific content within"
  const seen = new Set();
  matches = matches.filter((item) => {
    const key = `${item.type}::${item.href}::${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Cap results, prioritize section/dtc results above content matches
  const sectionMatches = matches.filter((m) => m.type !== "content");
  const contentMatches = matches.filter((m) => m.type === "content");
  matches = [...sectionMatches.slice(0, 5), ...contentMatches.slice(0, 8)];

  if (!matches.length) {
    resultsEl.innerHTML = `<p class="search-hint">Không tìm thấy kết quả cho "<strong>${escapeHtml(query)}</strong>"</p>`;
    return;
  }

  const html = matches
    .map((item) => {
      const titleHighlighted = _highlight(item.title, query);
      const subtitleHighlighted = _highlight(item.subtitle || "", query);

      // For content matches: show excerpt with highlighted context window
      let excerptHtml = "";
      if (item.type === "content" && item.excerpt) {
        const context = _extractContext(item.excerpt, query, 100);
        excerptHtml = `<div class="search-result-excerpt">${_highlight(context, query)}</div>`;
      }

      const typeLabel =
        item.type === "dtc"
          ? "DTC"
          : item.type === "content"
            ? "Nội dung"
            : "Mục";

      return `
      <a href="${item.href}" class="search-result-item" data-href="${item.href}">
        <div class="search-result-title">
          <span class="search-result-type type-${item.type}">${typeLabel}</span>
          ${titleHighlighted}
        </div>
        <div class="search-result-meta">${subtitleHighlighted}</div>
        ${excerptHtml}
      </a>
    `;
    })
    .join("");

  resultsEl.innerHTML = html;

  resultsEl.querySelectorAll(".search-result-item").forEach((link) => {
    link.addEventListener("click", () => {
      closeSearch();
    });
  });
}

/**
 * Extract a window of text around the first occurrence of query.
 * Returns ~contextLen chars on each side, with "..." if truncated.
 *
 * Note: matching is done on diacritics-removed text to find position,
 * but returned text is original (with diacritics).
 */
function _extractContext(text, query, contextLen = 100) {
  const normalizedText = _removeDiacritics(text);
  const normalizedQuery = _removeDiacritics(query);
  const idx = normalizedText.indexOf(normalizedQuery);

  if (idx === -1) {
    // Fallback: just truncate
    return text.length > contextLen * 2
      ? text.substring(0, contextLen * 2) + "…"
      : text;
  }

  // Calc window in original text (positions match since normalize is char-aligned)
  const start = Math.max(0, idx - contextLen);
  const end = Math.min(text.length, idx + query.length + contextLen);

  let snippet = text.substring(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < text.length) snippet = snippet + "…";
  return snippet;
}

/**
 * Highlight matching query substring in text.
 * Accent-insensitive: query "bien mo" highlights "Biến Mô" in source.
 *
 * Works by finding match positions in diacritics-removed text,
 * then wrapping the SAME positions in original text with <mark>.
 */
function _highlight(text, query) {
  if (!text || !query) return escapeHtml(text || "");
  const normalizedText = _removeDiacritics(text);
  const normalizedQuery = _removeDiacritics(query);
  if (!normalizedQuery) return escapeHtml(text);

  const result = [];
  let lastEnd = 0;
  let pos = normalizedText.indexOf(normalizedQuery);

  while (pos !== -1) {
    // Append text before match
    if (pos > lastEnd) {
      result.push(escapeHtml(text.substring(lastEnd, pos)));
    }
    // Append highlighted match (from ORIGINAL text — preserves diacritics)
    const matchEnd = pos + normalizedQuery.length;
    result.push(
      "<mark>" + escapeHtml(text.substring(pos, matchEnd)) + "</mark>",
    );
    lastEnd = matchEnd;
    pos = normalizedText.indexOf(normalizedQuery, matchEnd);
  }
  // Append remaining text
  if (lastEnd < text.length) {
    result.push(escapeHtml(text.substring(lastEnd)));
  }
  return result.join("");
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

// ─── Lightbox ────────────────────────────────────────────────────

/**
 * Initialize image lightbox using event delegation.
 * One-time setup — handles all current and future images automatically.
 */
function _initLightbox() {
  initLightbox();
}

// ─── Start ───────────────────────────────────────────────────────
init();
