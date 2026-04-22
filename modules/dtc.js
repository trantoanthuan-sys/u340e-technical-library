/**
 * modules/dtc.js — DTC List & Detail Pages
 * ==========================================
 * Handles two views:
 *   1. DTC List   → #/dtc (with group filter)
 *   2. DTC Detail → #/dtc/:code
 */

import { store } from "../core/store.js";
import {
  renderPage,
  renderBreadcrumb,
  updateSidebarActive,
  showLoading,
  backButtonHtml,
  escapeHtml,
  severityBadge,
} from "../core/renderer.js";

// ─── DTC List ────────────────────────────────────────────────────

/**
 * Render the full DTC list with group filter tabs.
 * @param {Object} params
 * @param {Object} query - { group: 'P07' } (optional filter)
 */
export async function renderDtcList(params = {}, query = {}) {
  showLoading();

  // Update store state
  store.set("activeSectionId", 5); // Section 5 = DTC
  store.set("activeSubId", null);
  store.set("activeDtcCode", null);
  updateSidebarActive();

  renderBreadcrumb([
    { label: "Trang Chủ", href: "#/" },
    { label: "Tra Cứu Mã Lỗi DTC" },
  ]);

  try {
    const dtcData = await store.loadDtc();
    renderPage(_buildDtcListHtml(dtcData, query.group || null));
    _bindDtcListEvents(dtcData);
  } catch (err) {
    console.error("[DTC] Failed to load DTC data:", err);
    renderPage(_buildErrorHtml());
  }
}

// ─── DTC Detail ──────────────────────────────────────────────────

/**
 * Render a single DTC detail page.
 * @param {Object} params - { code: 'P0715' }
 */
export async function renderDtcDetail({ code }) {
  showLoading();

  const upperCode = code.toUpperCase();

  // Update store state
  store.set("activeDtcCode", upperCode);
  store.set("activeSectionId", null);
  store.set("activeSubId", null);
  updateSidebarActive();

  try {
    const dtcEntry = await store.getDtcByCode(upperCode);

    if (!dtcEntry) {
      renderBreadcrumb([
        { label: "Trang Chủ", href: "#/" },
        { label: "Mã Lỗi DTC", href: "#/dtc" },
        { label: upperCode },
      ]);
      renderPage(_buildDtcNotFoundHtml(upperCode));
      return;
    }

    renderBreadcrumb([
      { label: "Trang Chủ", href: "#/" },
      { label: "Mã Lỗi DTC", href: "#/dtc" },
      { label: `${dtcEntry.code} — ${dtcEntry.title}` },
    ]);

    renderPage(_buildDtcDetailHtml(dtcEntry));
  } catch (err) {
    console.error(`[DTC] Failed to render DTC ${code}:`, err);
    renderPage(_buildErrorHtml());
  }
}

// ─── HTML Builders — DTC List ────────────────────────────────────

function _buildDtcListHtml(dtcData, activeGroup) {
  // Build filter tabs
  const allFilterHtml = `
    <button class="filter-btn ${!activeGroup ? "active" : ""}"
            data-group="">Tất Cả (${dtcData.codes.length})</button>
  `;

  const groupFiltersHtml = dtcData.meta.groups
    .map((g) => {
      const count = dtcData.codes.filter((c) => c.group === g.id).length;
      return `
      <button class="filter-btn ${activeGroup === g.id ? "active" : ""}"
              data-group="${escapeHtml(g.id)}">
        ${escapeHtml(g.id)} — ${escapeHtml(g.label)} (${count})
      </button>
    `;
    })
    .join("");

  // Filter codes
  const filtered = activeGroup
    ? dtcData.codes.filter((c) => c.group === activeGroup)
    : dtcData.codes;

  const rowsHtml = filtered.length
    ? filtered.map((entry) => _buildDtcRow(entry)).join("")
    : `<div class="empty-state" style="padding: var(--space-10);">
         <div class="empty-state-icon">🔍</div>
         <div class="empty-state-title">Không có mã lỗi nào trong nhóm này</div>
       </div>`;

  return `
    <div class="content-wrapper animate-fade-in">

      ${backButtonHtml("#/", "Về Trang Chủ")}

      <!-- Page header -->
      <div class="page-title-block">
        <div class="page-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          CHẨN ĐOÁN & BẢO DƯỠNG
        </div>
        <h1 class="page-title">Danh Mục Mã Lỗi <span style="color:var(--color-amber-600)">DTC</span></h1>
        <p class="page-subtitle">
          ${dtcData.codes.length} mã lỗi hộp số U340E. Click vào mã lỗi để xem quy trình chẩn đoán chi tiết.
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="dtc-filter-bar" id="dtc-filter-bar">
        ${allFilterHtml}
        ${groupFiltersHtml}
      </div>

      <!-- DTC Table -->
      <div class="dtc-table-wrap" id="dtc-table">
        <!-- Header -->
        <div style="display:grid; grid-template-columns:120px 1fr auto;
                    gap:var(--space-4); padding:var(--space-3) var(--space-5);
                    background:var(--color-navy-900); border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <span style="font-size:var(--text-xs); font-weight:600; letter-spacing:var(--tracking-wider);
                       text-transform:uppercase; color:var(--color-navy-300);">Mã Lỗi</span>
          <span style="font-size:var(--text-xs); font-weight:600; letter-spacing:var(--tracking-wider);
                       text-transform:uppercase; color:var(--color-navy-300);">Tên Lỗi</span>
          <span style="font-size:var(--text-xs); font-weight:600; letter-spacing:var(--tracking-wider);
                       text-transform:uppercase; color:var(--color-navy-300);">Mức Độ</span>
        </div>

        <!-- Rows -->
        <div id="dtc-rows">
          ${rowsHtml}
        </div>
      </div>

    </div>
  `;
}

function _buildDtcRow(entry) {
  return `
    <a href="#/dtc/${escapeHtml(entry.code)}" class="dtc-row">
      <span class="dtc-row-code">${escapeHtml(entry.code)}</span>
      <span class="dtc-row-title">${escapeHtml(entry.title)}</span>
      <span class="dtc-row-severity">${severityBadge(entry.severity)}</span>
    </a>
  `;
}

// ─── HTML Builders — DTC Detail ──────────────────────────────────

function _buildDtcDetailHtml(entry) {
  // Possible Causes list
  const causesHtml = entry.possibleCauses
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join("");

  // Diagnosis steps
  const stepsHtml = entry.diagnosis
    .map(
      (step) => `
    <li class="diagnosis-step">
      <div class="step-body">
        <div class="step-action">${escapeHtml(step.action)}</div>
        <div class="step-meta">
          ${
            step.tool
              ? `<span class="step-tool">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2">
                   <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                 </svg>
                 Dụng cụ: <span class="step-tool-val">${escapeHtml(step.tool)}</span>
               </span>`
              : ""
          }
          ${
            step.expected
              ? `<span class="step-expected">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2">
                   <polyline points="20 6 9 17 4 12"/>
                 </svg>
                 Kỳ vọng: <span class="step-expected-val">${escapeHtml(step.expected)}</span>
               </span>`
              : ""
          }
        </div>
      </div>
    </li>
  `,
    )
    .join("");

  // Related codes
  const relatedCodesHtml = entry.relatedCodes?.length
    ? `<div style="display:flex; align-items:center; flex-wrap:wrap; gap:var(--space-2); margin-top:var(--space-4)">
         <span class="related-dtc-label">Mã Lỗi Liên Quan:</span>
         ${entry.relatedCodes
           .map(
             (code) =>
               `<a href="#/dtc/${code}" class="badge badge-dtc">${escapeHtml(code)}</a>`,
           )
           .join("")}
       </div>`
    : "";

  // Related sections
  const relatedSectionsHtml = entry.relatedSections?.length
    ? `<div style="display:flex; align-items:center; flex-wrap:wrap; gap:var(--space-2); margin-top:var(--space-3)">
         <span class="related-dtc-label">Mục Liên Quan:</span>
         ${entry.relatedSections
           .map((sid) => {
             const parts = sid.split(".");
             const sectionId = parts[0];
             return `<a href="#/section/${sectionId}/${sid}" class="badge badge-navy">
                     Mục ${escapeHtml(sid)}
                   </a>`;
           })
           .join("")}
       </div>`
    : "";

  return `
    <div class="content-wrapper animate-fade-in">

      ${backButtonHtml("#/dtc", "Danh Mục Mã Lỗi DTC")}

      <!-- DTC Header Card -->
      <div class="dtc-detail-header">
        <div class="dtc-code-large">${escapeHtml(entry.code)}</div>
        <div class="dtc-detail-meta">
          ${severityBadge(entry.severity)}
          <h1 class="dtc-detail-title" style="margin-top:var(--space-2);">
            ${escapeHtml(entry.title)}
          </h1>
          <p class="dtc-detail-symptom">
            <strong style="color:var(--color-amber-300);">Triệu chứng:</strong>
            ${escapeHtml(entry.symptom)}
          </p>
        </div>
      </div>

      <!-- Content Grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-5); margin-bottom:var(--space-5);">

        <!-- Possible Causes -->
        <div class="content-block" style="margin-bottom:0;">
          <h3 style="font-size:var(--text-sm); font-weight:600; letter-spacing:var(--tracking-wider);
                     text-transform:uppercase; color:var(--color-slate-500);
                     margin-bottom:var(--space-4);">
            Nguyên Nhân Có Thể
          </h3>
          <ul class="keypoints-list" style="background:none; border:none; padding:0;">
            ${causesHtml}
          </ul>
        </div>

        <!-- QR Placeholder -->
        <div class="content-block" style="margin-bottom:0;">
          <h3 style="font-size:var(--text-sm); font-weight:600; letter-spacing:var(--tracking-wider);
                     text-transform:uppercase; color:var(--color-slate-500);
                     margin-bottom:var(--space-4);">
            QR Code
          </h3>
          <div class="qr-placeholder">
            <div class="qr-placeholder-box">▦</div>
            <div class="qr-placeholder-label">
              QR cho trang này sẽ được tạo tự động.<br/>
              <code style="font-size:var(--text-xs);">${escapeHtml(entry.qrUrl)}</code>
            </div>
            <button class="qr-placeholder-btn" disabled title="Tính năng sắp ra mắt">
              Tạo QR Code (sắp có)
            </button>
          </div>
        </div>

      </div>

      <!-- Diagnosis Steps -->
      <div class="content-block">
        <h2 style="font-size:var(--text-lg); font-weight:600; margin-bottom:var(--space-5);
                   display:flex; align-items:center; gap:var(--space-3);">
          <span style="display:inline-flex; align-items:center; justify-content:center;
                       width:28px; height:28px; background:var(--color-navy-900);
                       color:var(--color-amber-300); border-radius:var(--radius-md);
                       font-family:var(--font-mono); font-size:var(--text-xs);">✓</span>
          Quy Trình Chẩn Đoán
        </h2>
        <ol class="diagnosis-steps">
          ${stepsHtml}
        </ol>
      </div>

      <!-- Related Content -->
      ${
        relatedCodesHtml || relatedSectionsHtml
          ? `<div class="content-block">
             <h3 style="font-size:var(--text-sm); font-weight:600; letter-spacing:var(--tracking-wider);
                        text-transform:uppercase; color:var(--color-slate-500);
                        margin-bottom:var(--space-3);">
               Tham Khảo Thêm
             </h3>
             ${relatedCodesHtml}
             ${relatedSectionsHtml}
           </div>`
          : ""
      }

    </div>

    <style>
      /* Responsive 2-col grid on detail page */
      @media (max-width: 640px) {
        .content-wrapper > div[style*="grid-template-columns:1fr 1fr"] {
          grid-template-columns: 1fr !important;
        }
      }
    </style>
  `;
}

// ─── Event Bindings ──────────────────────────────────────────────

function _bindDtcListEvents(dtcData) {
  const filterBar = document.getElementById("dtc-filter-bar");
  if (!filterBar) return;

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const group = btn.dataset.group;
    const hash = group ? `#/dtc?group=${encodeURIComponent(group)}` : "#/dtc";
    window.location.hash = hash;
  });
}

// ─── Error States ────────────────────────────────────────────────

function _buildDtcNotFoundHtml(code) {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">Không tìm thấy mã lỗi ${escapeHtml(code)}</div>
        <p class="empty-state-text">Mã lỗi này không có trong cơ sở dữ liệu.</p>
        <a href="#/dtc" class="btn-back" style="margin-top:var(--space-4)">← Về Danh Mục DTC</a>
      </div>
    </div>
  `;
}

function _buildErrorHtml() {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Lỗi tải dữ liệu DTC</div>
        <p class="empty-state-text">Không thể tải file <code>data/dtc.json</code>.</p>
      </div>
    </div>
  `;
}
