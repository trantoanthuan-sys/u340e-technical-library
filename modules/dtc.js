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
    _bindDtcDetailEvents(dtcEntry);
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
         <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
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

      ${
        entry.diagnosisFlow && entry.diagnosisFlow.steps?.length
          ? _buildDiagnosisFlowHtml(entry.diagnosisFlow)
          : ""
      }

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
        <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
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
        <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div class="empty-state-title">Lỗi tải dữ liệu DTC</div>
        <p class="empty-state-text">Không thể tải file <code>data/dtc.json</code>.</p>
      </div>
    </div>
  `;
}

// ─── DIAGNOSIS FLOW (Interactive) ────────────────────────────────

/**
 * State management cho flow tương tác.
 * Mỗi mã DTC có 1 state riêng (key = code).
 */
const flowStates = {};

/**
 * Build phần HTML cho Chẩn đoán tương tác.
 * @param {Object} flow - { startStep, steps: [...] }
 * @returns {string} HTML
 */
function _buildDiagnosisFlowHtml(flow) {
  return `
    <div class="content-block diagnosis-flow-block">
      <h2 style="font-size:var(--text-lg); font-weight:600; margin-bottom:var(--space-5);
                 display:flex; align-items:center; gap:var(--space-3);">
        <span style="display:inline-flex; align-items:center; justify-content:center;
                     width:28px; height:28px; background:var(--color-emerald-700, #047857);
                     color:#fff; border-radius:var(--radius-md);
                     font-family:var(--font-mono); font-size:var(--text-xs);">⚡</span>
        Chẩn Đoán Tương Tác
        <span style="font-size:var(--text-xs); font-weight:400; color:var(--color-slate-500);
                     padding:2px 8px; background:var(--color-slate-100, #f1f5f9);
                     border-radius:9999px;">
          Beta
        </span>
      </h2>

      <p style="color:var(--color-slate-600); font-size:var(--text-sm); margin-bottom:var(--space-4);">
        Trả lời lần lượt các câu hỏi để được hướng dẫn cách xử lý phù hợp với tình huống thực tế.
      </p>

      <!-- Tab buttons -->
      <div class="flow-tabs" role="tablist">
        <button class="flow-tab flow-tab-active" data-tab="step" type="button">
          <svg class="flow-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Step-by-step
        </button>
        <button class="flow-tab" data-tab="flowchart" type="button">
          <svg class="flow-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="6" cy="6" r="2"/>
            <circle cx="18" cy="6" r="2"/>
            <circle cx="6" cy="18" r="2"/>
            <circle cx="18" cy="18" r="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="6" y1="8" x2="6" y2="16"/>
            <line x1="18" y1="8" x2="18" y2="16"/>
            <line x1="8" y1="18" x2="16" y2="18"/>
          </svg>
          Sơ đồ chẩn đoán
        </button>
      </div>

      <!-- Tab content: Step-by-step -->
      <div id="flow-container" class="flow-container flow-tab-panel"
           data-tab-panel="step"
           data-start-step="${flow.startStep}">
        <!-- Render bởi _renderFlowStep() -->
      </div>

      <!-- Tab content: Flowchart (HTML tree với animation) -->
      <div id="flow-svg-panel" class="flow-tab-panel flow-tab-panel-hidden"
           data-tab-panel="flowchart">
        <div class="svg-flowchart-toolbar">
          <span class="svg-flowchart-hint">
            <svg class="svg-flowchart-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Click YES/NO để cây phát triển dần theo lựa chọn</span>
          </span>
        </div>
        <div id="flow-svg-canvas" class="svg-flowchart-canvas">
          <!-- Render bởi _renderSvgFlowchart() -->
        </div>
      </div>
    </div>
  `;
}

/**
 * Bind events cho trang DTC detail (sau khi đã renderPage).
 * @param {Object} entry - DTC entry
 */
function _bindDtcDetailEvents(entry) {
  if (entry.diagnosisFlow && entry.diagnosisFlow.steps?.length) {
    _initDiagnosisFlow(entry);
  }
}

/**
 * Khởi tạo flow tương tác.
 * @param {Object} entry - DTC entry
 */
function _initDiagnosisFlow(entry) {
  const container = document.getElementById("flow-container");
  if (!container) return;

  const flow = entry.diagnosisFlow;

  // Index steps by id để query nhanh
  const stepMap = {};
  flow.steps.forEach((s) => (stepMap[s.id] = s));

  // Init state
  flowStates[entry.code] = {
    currentId: flow.startStep,
    history: [], // [{ id, answer: 'yes'|'no', title }]
    stepMap,
  };

  _renderFlowStep(entry.code, container);
  _renderSvgFlowchart(entry); // Render SVG flowchart ngay từ đầu

  // Tab switching logic
  const flowBlock = container.closest(".diagnosis-flow-block");
  if (flowBlock) {
    flowBlock.addEventListener("click", (e) => {
      const tabBtn = e.target.closest("[data-tab]");
      if (!tabBtn) return;

      const targetTab = tabBtn.dataset.tab;

      // Toggle active tab button
      flowBlock.querySelectorAll(".flow-tab").forEach((btn) => {
        btn.classList.toggle("flow-tab-active", btn.dataset.tab === targetTab);
      });

      // Toggle visible panel
      flowBlock.querySelectorAll(".flow-tab-panel").forEach((panel) => {
        panel.classList.toggle(
          "flow-tab-panel-hidden",
          panel.dataset.tabPanel !== targetTab,
        );
      });
    });
  }

  // Helper: re-render cả step-by-step và SVG flowchart
  const updateAllViews = () => {
    _renderFlowStep(entry.code, container);
    _renderSvgFlowchart(entry);
  };

  // Delegate click events
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const state = flowStates[entry.code];

    if (action === "yes" || action === "no") {
      const currentStep = state.stepMap[state.currentId];
      const nextId = currentStep[action];

      // Push history
      state.history.push({
        id: state.currentId,
        answer: action,
        title: currentStep.title,
      });

      state.currentId = nextId;
      updateAllViews();
    } else if (action === "back") {
      if (state.history.length > 0) {
        const last = state.history.pop();
        state.currentId = last.id;
        updateAllViews();
      }
    } else if (action === "reset") {
      state.history = [];
      state.currentId = entry.diagnosisFlow.startStep;
      updateAllViews();
    } else if (action === "jump") {
      // Click từ mini-map: nhảy thẳng đến step đích
      const targetId = btn.dataset.target;
      // Convert string → number nếu cần (steps có id dạng số)
      const numId = parseInt(targetId, 10);
      const finalId = !isNaN(numId) && state.stepMap[numId] ? numId : targetId;

      if (state.stepMap[finalId]) {
        // Push history (đánh dấu là jump)
        state.history.push({
          id: state.currentId,
          answer: "jump",
          title: state.stepMap[state.currentId]?.title || "",
        });
        state.currentId = finalId;
        updateAllViews();
      }
    }
  });
}

/**
 * Render step hiện tại.
 */
function _renderFlowStep(code, container) {
  const state = flowStates[code];
  const step = state.stepMap[state.currentId];

  if (!step) {
    container.innerHTML = `
      <div class="flow-error">
        ⚠️ Lỗi: không tìm thấy bước ${escapeHtml(state.currentId)}
        <button data-action="reset" class="flow-btn-secondary">⟲ Bắt đầu lại</button>
      </div>
    `;
    return;
  }

  const isResult = step.type === "result";
  const totalSteps = Object.keys(state.stepMap).length;

  // Build history breadcrumb
  const historyHtml =
    state.history.length > 0
      ? `<div class="flow-history">
           <span class="flow-history-label">Lịch sử:</span>
           ${state.history
             .map(
               (h, i) => `
             <span class="flow-history-item">
               ${i + 1}.${h.answer.toUpperCase()}
             </span>
           `,
             )
             .join("→")}
         </div>`
      : "";

  // Build action buttons
  let actionsHtml = "";
  if (isResult) {
    actionsHtml = `
      <div class="flow-result-banner">
        <span class="flow-result-icon">✓</span>
        <strong>Kết quả chẩn đoán</strong>
      </div>
    `;
  } else {
    actionsHtml = `
      <div class="flow-buttons">
        <button data-action="yes" class="flow-btn flow-btn-yes">
          <span class="flow-btn-icon">✅</span>
          <span class="flow-btn-text">YES</span>
        </button>
        <button data-action="no" class="flow-btn flow-btn-no">
          <span class="flow-btn-icon">❌</span>
          <span class="flow-btn-text">NO</span>
        </button>
      </div>
    `;
  }

  // Build navigation
  const navHtml = `
    <div class="flow-nav">
      ${
        state.history.length > 0
          ? `<button data-action="back" class="flow-btn-secondary">
               ← Quay lại
             </button>`
          : ""
      }
      ${
        state.history.length > 0
          ? `<button data-action="reset" class="flow-btn-secondary">
               ⟲ Bắt đầu lại
             </button>`
          : ""
      }
    </div>
  `;

  container.innerHTML = `
    ${historyHtml}

    <div class="flow-card ${isResult ? "flow-card-result" : ""}">
      ${
        !isResult
          ? `<div class="flow-step-badge">Bước ${state.currentId}</div>`
          : ""
      }

      <h3 class="flow-card-title">${escapeHtml(step.title)}</h3>

      <div class="flow-card-description">
        ${_formatFlowText(step.description || "")}
      </div>

      ${actionsHtml}
    </div>

    ${navHtml}

    ${_buildMiniMapHtml(state, code)}
  `;
}

/**
 * Build HTML mini-map flowchart hiển thị toàn bộ flow,
 * với highlight node hiện tại và khả năng click.
 */
function _buildMiniMapHtml(state, code) {
  const stepMap = state.stepMap;
  const currentId = state.currentId;
  const startId = stepMap[Object.keys(stepMap).find((id) => stepMap[id])]
    ? null
    : null; // Get from flow.startStep — passed via state, but we have startStep in entry

  // Tách 2 loại node: question (có yes/no) và result (type=result)
  const questions = [];
  const results = [];
  Object.values(stepMap).forEach((s) => {
    if (s.type === "result") {
      results.push(s);
    } else {
      questions.push(s);
    }
  });

  // Sort questions theo id (giả sử id là số 1,2,3...)
  questions.sort((a, b) => {
    const ai = typeof a.id === "number" ? a.id : 999;
    const bi = typeof b.id === "number" ? b.id : 999;
    return ai - bi;
  });

  // Build node cho mỗi question
  const questionNodesHtml = questions
    .map((q) => {
      const isCurrent = q.id === currentId;
      const isVisited = state.history.some((h) => h.id === q.id);
      const cls = isCurrent
        ? "minimap-node-current"
        : isVisited
          ? "minimap-node-visited"
          : "minimap-node";

      // Lấy title rút gọn (bỏ "Bước N — " ở đầu nếu có)
      const shortTitle = (q.title || "").replace(
        /^Bước\s+[\d.]+\s*[—-]\s*/i,
        "",
      );

      return `
        <div class="minimap-question-row">
          <button class="minimap-node ${cls}" 
                  data-action="jump" 
                  data-target="${escapeHtml(String(q.id))}"
                  title="${escapeHtml(q.title)}">
            <span class="minimap-node-num">${q.id}</span>
            <span class="minimap-node-title">${escapeHtml(_truncate(shortTitle, 40))}</span>
          </button>
          <div class="minimap-branches">
            <span class="minimap-branch minimap-branch-yes">
              <span class="minimap-branch-label">YES</span>
              <span class="minimap-branch-arrow">→</span>
              <span class="minimap-branch-target">
                ${_buildBranchTargetHtml(q.yes, stepMap, currentId)}
              </span>
            </span>
            <span class="minimap-branch minimap-branch-no">
              <span class="minimap-branch-label">NO</span>
              <span class="minimap-branch-arrow">→</span>
              <span class="minimap-branch-target">
                ${_buildBranchTargetHtml(q.no, stepMap, currentId)}
              </span>
            </span>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="minimap-section">
      <div class="minimap-header">
        <svg class="minimap-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="6" cy="6" r="2"/>
          <circle cx="18" cy="6" r="2"/>
          <circle cx="6" cy="18" r="2"/>
          <circle cx="18" cy="18" r="2"/>
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="6" y1="8" x2="6" y2="16"/>
          <line x1="18" y1="8" x2="18" y2="16"/>
          <line x1="8" y1="18" x2="16" y2="18"/>
        </svg>
        <strong>Tổng quan luồng chẩn đoán</strong>
        <span class="minimap-hint">Click vào ô để nhảy đến bước</span>
      </div>
      <div class="minimap-body">
        ${questionNodesHtml}
      </div>
      <div class="minimap-legend">
        <span class="minimap-legend-item">
          <span class="minimap-legend-dot dot-current"></span> Đang ở đây
        </span>
        <span class="minimap-legend-item">
          <span class="minimap-legend-dot dot-visited"></span> Đã đi qua
        </span>
        <span class="minimap-legend-item">
          <span class="minimap-legend-dot dot-default"></span> Chưa đi
        </span>
      </div>
    </div>
  `;
}

/**
 * Build HTML cho target của 1 branch (YES hoặc NO).
 * Có thể là node câu hỏi tiếp theo hoặc kết quả.
 */
function _buildBranchTargetHtml(targetId, stepMap, currentId) {
  const target = stepMap[targetId];
  if (!target) return `<span class="minimap-target-missing">?</span>`;

  const isCurrent = target.id === currentId;
  const isResult = target.type === "result";

  if (isResult) {
    const shortTitle = _truncate(target.title || "Kết quả", 30);
    return `
      <button class="minimap-target minimap-target-result ${isCurrent ? "is-current" : ""}"
              data-action="jump"
              data-target="${escapeHtml(String(target.id))}"
              title="${escapeHtml(target.title)}">
        ✓ ${escapeHtml(shortTitle)}
      </button>
    `;
  } else {
    return `
      <button class="minimap-target minimap-target-question ${isCurrent ? "is-current" : ""}"
              data-action="jump"
              data-target="${escapeHtml(String(target.id))}"
              title="${escapeHtml(target.title)}">
        Bước ${escapeHtml(String(target.id))}
      </button>
    `;
  }
}

/**
 * Truncate string với "..." ở cuối nếu quá dài.
 */
function _truncate(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + "…";
}

/**
 * Format text trong description (hỗ trợ \n và bold).
 */
function _formatFlowText(text) {
  if (!text) return "";
  let safe = escapeHtml(text);
  // Convert **bold** → <strong>
  safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Convert \n → <br>
  safe = safe.replace(/\n/g, "<br>");
  return safe;
}

// ─── HTML FLOWCHART TREE (Animation kiểu PowerPoint) ─────────────
// Chỉ hiển thị các node theo lịch sử + node hiện tại
// Mỗi lần click YES/NO → cây phát triển thêm 1 node với animation slide-in

/**
 * Render HTML flowchart tree.
 * Cây mọc dần theo state.history + currentId.
 */
function _renderSvgFlowchart(entry) {
  const canvas = document.getElementById("flow-svg-canvas");
  if (!canvas) return;

  const state = flowStates[entry.code];
  if (!state) return;

  // Build chuỗi node: [start, history[0].nextStep, history[1].nextStep, ..., currentStep]
  // history mỗi entry là { id (id của step lúc đó), answer, title }
  // → Path = history.map(h => h.id) + [currentId]

  const pathIds = [...state.history.map((h) => h.id), state.currentId];

  // Render từng node trong path
  let nodesHtml = "";
  pathIds.forEach((id, index) => {
    const node = state.stepMap[id];
    if (!node) return;

    const isLast = index === pathIds.length - 1;
    const isResult = node.type === "result";
    const isFirst = index === 0;

    // Edge label (YES/NO) — chỉ hiển thị nếu không phải node đầu tiên
    let edgeLabel = "";
    if (!isFirst && index > 0) {
      // Lấy answer từ history[index - 1]
      const prevHistoryEntry = state.history[index - 1];
      if (prevHistoryEntry && prevHistoryEntry.answer) {
        const ans = prevHistoryEntry.answer;
        if (ans === "yes" || ans === "no" || ans === "jump") {
          const labelClass =
            ans === "yes"
              ? "tree-edge-yes"
              : ans === "no"
                ? "tree-edge-no"
                : "tree-edge-jump";
          const labelText = ans === "jump" ? "→ NHẢY" : ans.toUpperCase();
          edgeLabel = `
            <div class="tree-edge ${labelClass}">
              <div class="tree-edge-arrow"></div>
              <span class="tree-edge-label">${labelText}</span>
            </div>
          `;
        }
      }
    }

    // Build node card
    const stepId = String(node.id);
    const shortTitle = (node.title || "").replace(
      /^Bước\s+[\d.]+\s*[—-]\s*/i,
      "",
    );

    const numBadge = isResult
      ? `<div class="tree-node-badge tree-node-badge-result">✓</div>`
      : `<div class="tree-node-badge">${escapeHtml(stepId)}</div>`;

    // Description (chỉ hiện cho node hiện tại)
    const descHtml =
      isLast && node.description
        ? `<div class="tree-node-description">${_formatFlowText(node.description)}</div>`
        : "";

    // Action buttons (YES/NO) — chỉ ở node cuối cùng và không phải result
    let actionsHtml = "";
    if (isLast && !isResult) {
      const yesTarget = state.stepMap[node.yes];
      const noTarget = state.stepMap[node.no];
      const yesLabel =
        yesTarget?.type === "result" ? "→ Kết quả" : `→ Bước ${node.yes}`;
      const noLabel =
        noTarget?.type === "result" ? "→ Kết quả" : `→ Bước ${node.no}`;

      actionsHtml = `
        <div class="tree-node-actions">
          <button data-tree-action="yes" class="tree-btn tree-btn-yes">
            <span class="tree-btn-icon">✅</span>
            <span class="tree-btn-text">YES</span>
            <span class="tree-btn-target">${escapeHtml(yesLabel)}</span>
          </button>
          <button data-tree-action="no" class="tree-btn tree-btn-no">
            <span class="tree-btn-icon">❌</span>
            <span class="tree-btn-text">NO</span>
            <span class="tree-btn-target">${escapeHtml(noLabel)}</span>
          </button>
        </div>
      `;
    } else if (isLast && isResult) {
      actionsHtml = `
        <div class="tree-node-result-banner">
          <span class="tree-node-result-icon">✓</span>
          <strong>Kết thúc — Đã đến kết quả chẩn đoán</strong>
        </div>
      `;
    }

    // Node className
    let nodeCls = "tree-node";
    if (isLast) nodeCls += " tree-node-current";
    else nodeCls += " tree-node-visited";
    if (isResult) nodeCls += " tree-node-result";

    // Wrapper với animation class
    const animCls = isLast ? "tree-anim-in" : "";

    nodesHtml += `
      ${edgeLabel}
      <div class="${nodeCls} ${animCls}" data-step-id="${escapeHtml(stepId)}">
        ${numBadge}
        <div class="tree-node-title">${escapeHtml(shortTitle)}</div>
        ${descHtml}
        ${actionsHtml}
      </div>
    `;
  });

  // Navigation buttons (Back/Reset) — luôn hiển thị nếu có history
  let navHtml = "";
  if (state.history.length > 0) {
    navHtml = `
      <div class="tree-nav">
        <button data-tree-action="back" class="tree-btn-secondary">
          ← Quay lại bước trước
        </button>
        <button data-tree-action="reset" class="tree-btn-secondary">
          ⟲ Bắt đầu lại
        </button>
      </div>
    `;
  }

  canvas.innerHTML = `
    <div class="tree-container">
      ${nodesHtml}
      ${navHtml}
    </div>
  `;

  // Bind events (1 lần)
  if (!canvas.dataset.treeBound) {
    canvas.dataset.treeBound = "true";

    canvas.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-tree-action]");
      if (!btn) return;

      const action = btn.dataset.treeAction;
      const currentState = flowStates[entry.code];
      if (!currentState) return;
      const currentStep = currentState.stepMap[currentState.currentId];

      if ((action === "yes" || action === "no") && currentStep) {
        const nextId = currentStep[action];
        currentState.history.push({
          id: currentState.currentId,
          answer: action,
          title: currentStep.title,
        });
        currentState.currentId = nextId;
      } else if (action === "back") {
        if (currentState.history.length > 0) {
          const last = currentState.history.pop();
          currentState.currentId = last.id;
        }
      } else if (action === "reset") {
        currentState.history = [];
        currentState.currentId = entry.diagnosisFlow.startStep;
      }

      // Re-render
      _renderFlowStep(entry.code, document.getElementById("flow-container"));
      _renderSvgFlowchart(entry);

      // Auto-scroll xuống node cuối (mới xuất hiện)
      setTimeout(() => {
        const lastNode = canvas.querySelector(".tree-node-current");
        if (lastNode) {
          lastNode.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    });
  }
}
