/**
 * modules/section.js — Section & Sub-Section Pages
 * ==================================================
 * Handles two views:
 *   1. Section Overview  → #/section/:id
 *   2. Sub-section Detail → #/section/:id/:subId
 */

import { store } from "../core/store.js";
import {
  renderPage,
  renderBreadcrumb,
  updateSidebarActive,
  showLoading,
  backButtonHtml,
  imageOrPlaceholder,
  escapeHtml,
} from "../core/renderer.js";

// ─── Section Overview ────────────────────────────────────────────

/**
 * Render the overview page for a section.
 * Shows all sub-sections as clickable list items.
 * @param {Object} params - { id: string }
 */
export async function renderSection({ id }) {
  const sectionId = parseInt(id, 10);
  showLoading();

  // Update store state
  store.set("activeSectionId", sectionId);
  store.set("activeSubId", null);
  store.set("activeDtcCode", null);
  updateSidebarActive();

  try {
    const sections = await store.loadSections();
    const sectionMeta = sections.find((s) => s.id === sectionId);

    if (!sectionMeta) {
      renderPage(_buildNotFoundHtml(sectionId));
      return;
    }

    // Update breadcrumb
    renderBreadcrumb([
      { label: "Trang Chủ", href: "#/" },
      { label: `Chương ${sectionId}: ${sectionMeta.title}` },
    ]);

    // If DTC section, redirect to DTC list
    if (sectionMeta.isDtcSection) {
      window.location.hash = "#/dtc";
      return;
    }

    renderPage(_buildSectionOverviewHtml(sectionMeta));
  } catch (err) {
    console.error(`[Section] Failed to render section ${sectionId}:`, err);
    renderPage(_buildErrorHtml());
  }
}

// ─── Sub-Section Detail ──────────────────────────────────────────

/**
 * Render a specific sub-section's content.
 * @param {Object} params - { id: string, subId: string }
 */
export async function renderSubSection({ id, subId }) {
  const sectionId = parseInt(id, 10);
  showLoading();

  // Update store state
  store.set("activeSectionId", sectionId);
  store.set("activeSubId", subId);
  store.set("activeDtcCode", null);
  updateSidebarActive();

  try {
    const sections = await store.loadSections();
    const sectionData = await store.loadSection(sectionId);
    const sectionMeta = sections.find((s) => s.id === sectionId);

    if (!sectionMeta || !sectionData) {
      renderPage(_buildNotFoundHtml(sectionId));
      return;
    }

    // Find the specific sub-section by ID
    const sub = sectionData.subsections.find((s) => s.id === subId);

    if (!sub) {
      renderPage(_buildSubNotFoundHtml(sectionId, subId));
      return;
    }

    // Determine prev/next sub-sections for navigation
    const allSubs = sectionData.subsections;
    const subIndex = allSubs.findIndex((s) => s.id === subId);
    const prevSub = allSubs[subIndex - 1] || null;
    const nextSub = allSubs[subIndex + 1] || null;

    // Update breadcrumb
    renderBreadcrumb([
      { label: "Trang Chủ", href: "#/" },
      { label: `Chương ${sectionId}`, href: `#/section/${sectionId}` },
      { label: `${sub.id} — ${sub.title}` },
    ]);

    renderPage(_buildSubSectionHtml(sub, sectionMeta, prevSub, nextSub));
    _bindDiagramPoints();
  } catch (err) {
    console.error(`[Section] Failed to render sub-section ${subId}:`, err);
    renderPage(_buildErrorHtml());
  }
}

// ─── HTML Builders ───────────────────────────────────────────────

function _buildSectionOverviewHtml(section) {
  const subsHtml = section.subsections
    .map(
      (sub) => `
    <a href="#/section/${section.id}/${sub.id}" class="subsection-item">
      <span class="subsection-item-id">${escapeHtml(sub.id)}</span>
      <span class="subsection-item-title">${escapeHtml(sub.title)}</span>
      <svg class="subsection-item-arrow" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>
  `,
    )
    .join("");

  return `
    <div class="content-wrapper animate-fade-in">

      ${backButtonHtml("#/", "Về Trang Chủ")}

      <!-- Section header -->
      <div class="page-title-block">
        <div class="page-label">
          <span style="font-family:var(--font-mono)">CHƯƠNG ${escapeHtml(String(section.id))}</span>
        </div>
        <h1 class="page-title">${escapeHtml(section.title)}</h1>
        <p class="page-subtitle">${escapeHtml(section.description)}</p>
      </div>

      <!-- Sub-section list -->
      <div class="subsection-list" id="subsection-list">
        ${subsHtml}
      </div>

    </div>
  `;
}

function _buildSubSectionHtml(sub, sectionMeta, prevSub, nextSub) {
  const content = sub.content || {};

  const introHtml = content.intro
    ? `<p class="lesson-text">
         ${escapeHtml(content.intro)}
       </p>`
    : "";

  const keyPointsHtml = content.keyPoints?.length
    ? `<div class="keypoints-box lesson-note">
         <div class="keypoints-title lesson-note-title">Điểm Cần Ghi Nhớ</div>
         <ul class="keypoints-list">
           ${content.keyPoints
             .map((kp) => `<li>${escapeHtml(kp)}</li>`)
             .join("")}
         </ul>
       </div>`
    : "";

  const explainHtml = content.explain?.length
    ? `<div class="lesson-explain">
         <div class="lesson-explain-title">📘 Giải thích chi tiết</div>
         <div class="explain-list">
           ${content.explain
             .map(
               (item) => `
             <div class="explain-card">
               <div class="explain-card-icon">⚙️</div>
               <div class="explain-card-content">
                 <div class="explain-card-title">${escapeHtml(item.title)}</div>
                 <div class="explain-card-text">${escapeHtml(item.text)}</div>
               </div>
             </div>
           `,
             )
             .join("")}
         </div>
       </div>`
    : "";
  const stagesHtml = content.stages?.length
    ? `<div class="lesson-stages">
         ${content.stages
           .map(
             (stage) => `
               <div class="lesson-stage">
                 <div class="lesson-stage-title">${escapeHtml(stage.title)}</div>
                 <div class="lesson-stage-text">${escapeHtml(stage.text)}</div>
                 ${
                   stage.image
                     ? `<div class="lesson-image-wrap">
                          <img src="${escapeHtml(stage.image)}" alt="${escapeHtml(stage.caption || stage.title)}" class="lesson-image" />
                          ${
                            stage.caption
                              ? `<div class="image-caption">${escapeHtml(stage.caption)}</div>`
                              : ""
                          }
                        </div>`
                     : ""
                 }
               </div>
             `,
           )
           .join("")}
       </div>`
    : "";
  const sequenceHtml = content.sequence
    ? `<div class="lesson-note">
         <div class="lesson-note-title">${escapeHtml(content.sequence.title)}</div>
         <div class="lesson-text">${escapeHtml(content.sequence.content)}</div>
       </div>`
    : "";
  const images = content.images || [];

  const imagesHtml = images.length
    ? images
        .map(
          (img) => `
          <div class="lesson-image-wrap">
            ${imageOrPlaceholder(img)}
          </div>
        `,
        )
        .join("")
    : "";

  const diagram = content.diagram || null;

  const diagramHtml = diagram
    ? `<div class="lesson-diagram">
<div class="lesson-diagram-frame">
  <div class="lesson-diagram-canvas" id="lesson-diagram-canvas">
    <img
      src="${escapeHtml(diagram.image)}"
      alt="${escapeHtml(diagram.caption || sub.title)}"
      class="lesson-diagram-image"
    />

    ${diagram.points
      .map(
        (point) => `
          <button
            type="button"
            class="diagram-hotspot"
            style="top:${escapeHtml(point.top)}; left:${escapeHtml(point.left)};"
            data-label="${escapeHtml(point.label)}"
            data-popup-top="${escapeHtml(point.popupTop || point.top)}"
            data-popup-left="${escapeHtml(point.popupLeft || point.left)}"
            aria-label="${escapeHtml(point.id)} - ${escapeHtml(point.label)}"
          ></button>
        `,
      )
      .join("")}

    <div class="diagram-tooltip" id="diagram-tooltip" hidden>
      <button type="button" class="diagram-tooltip-close" id="diagram-tooltip-close">×</button>
      <div class="diagram-tooltip-text" id="diagram-tooltip-text"></div>
    </div>
  </div>
</div>

       ${
         diagram.caption
           ? `<div class="image-caption">${escapeHtml(diagram.caption)}</div>`
           : ""
       }
     </div>`
    : "";

  const tableHtml = content.table
    ? `<div class="lesson-table">
         <div class="lesson-table-title">${escapeHtml(content.table.title || "")}</div>
         <div class="lesson-table-wrap">
           <table>
             <thead>
               <tr>
                 ${content.table.headers
                   .map((header) => `<th>${escapeHtml(header)}</th>`)
                   .join("")}
               </tr>
             </thead>
             <tbody>
               ${content.table.rows
                 .map(
                   (row) => `
                 <tr>
                   ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                 </tr>
               `,
                 )
                 .join("")}
             </tbody>
           </table>
         </div>
       </div>`
    : "";

  const specsRows = content.specs?.rows || [];

  const specsHtml =
    content.specs && specsRows.length
      ? `<div class="specs-table-wrap">
           <table>
             <thead>
               <tr>
                 <th colspan="2">${escapeHtml(content.specs.title || "Thông Số Kỹ Thuật")}</th>
               </tr>
             </thead>
             <tbody>
               ${specsRows
                 .map(
                   (row) => `
                 <tr>
                   <td><strong>${escapeHtml(row.param || "")}</strong></td>
                   <td><code>${escapeHtml(row.value || "")}</code></td>
                 </tr>
               `,
                 )
                 .join("")}
             </tbody>
           </table>
         </div>`
      : "";

  const relatedDTC = content.relatedDTC || [];

  const relatedDtcHtml = relatedDTC.length
    ? `<div class="related-dtc-row">
         <span class="related-dtc-label">Mã Lỗi Liên Quan:</span>
         ${relatedDTC
           .map(
             (code) =>
               `<a href="#/dtc/${code}" class="badge badge-dtc">${escapeHtml(code)}</a>`,
           )
           .join("")}
       </div>`
    : "";

  const prevNextHtml = _buildPrevNextNav(sectionMeta, prevSub, nextSub);

  return `
    <div class="content-wrapper animate-fade-in">

      ${backButtonHtml(`#/section/${sectionMeta.id}`, `Chương ${sectionMeta.id}: ${sectionMeta.title}`)}

      <div class="page-title-block">
        <div class="page-label">
          <span style="font-family:var(--font-mono)">
            CHƯƠNG ${escapeHtml(String(sectionMeta.id))} — MỤC ${escapeHtml(sub.id)}
          </span>
        </div>
        <h1 class="page-title">${escapeHtml(sub.title)}</h1>
      </div>

     <div class="content-block">
 <div class="lesson-content lesson-content-wide">
        ${introHtml}
${keyPointsHtml}
${sequenceHtml}
${diagramHtml}
${explainHtml}
${stagesHtml}
${imagesHtml}
${tableHtml}
${specsHtml}
        </div>
      </div>

      ${prevNextHtml}

    </div>
  `;
}

function _buildPrevNextNav(section, prevSub, nextSub) {
  if (!prevSub && !nextSub) return "";

  const prevHtml = prevSub
    ? `<a href="#/section/${section.id}/${prevSub.id}" class="prevnext-btn prevnext-prev">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
           <polyline points="15 18 9 12 15 6"/>
         </svg>
         <div>
           <div class="prevnext-dir">Trước</div>
           <div class="prevnext-title">${escapeHtml(prevSub.id)} — ${escapeHtml(prevSub.title)}</div>
         </div>
       </a>`
    : "<div></div>";

  const nextHtml = nextSub
    ? `<a href="#/section/${section.id}/${nextSub.id}" class="prevnext-btn prevnext-next">
         <div>
           <div class="prevnext-dir">Tiếp theo</div>
           <div class="prevnext-title">${escapeHtml(nextSub.id)} — ${escapeHtml(nextSub.title)}</div>
         </div>
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
           <polyline points="9 18 15 12 9 6"/>
         </svg>
       </a>`
    : "<div></div>";

  return `
  <div class="prevnext-nav">
    ${prevHtml}
    ${nextHtml}
  </div>
`;
}

// ─── Error / Not-Found States ────────────────────────────────────

function _buildNotFoundHtml(id) {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon">📂</div>
        <div class="empty-state-title">Không tìm thấy Chương ${id}</div>
        <p class="empty-state-text">Chương này chưa có dữ liệu hoặc không tồn tại.</p>
        <a href="#/" class="btn-back" style="margin-top:var(--space-4)">← Về Trang Chủ</a>
      </div>
    </div>
  `;
}
function _bindDiagramPoints() {
  const richNumbers = document.querySelectorAll(".diagram-number");

  if (richNumbers.length) {
    const detailId = document.getElementById("diagram-detail-id");
    const detailTitle = document.getElementById("diagram-detail-title");
    const detailText = document.getElementById("diagram-detail-text");
    const detailFunctions = document.getElementById("diagram-detail-functions");
    const detailNote = document.getElementById("diagram-detail-note");
    const prevBtn = document.getElementById("diagram-prev-btn");
    const nextBtn = document.getElementById("diagram-next-btn");
    const currentIndexEl = document.getElementById("diagram-current-index");

    const items = Array.from(richNumbers);
    let currentIndex = Math.max(
      0,
      items.findIndex((el) => el.classList.contains("active")),
    );

    const renderRichDetail = (index) => {
      const el = items[index];
      if (!el) return;

      items.forEach((item) => item.classList.remove("active"));
      el.classList.add("active");

      const functions = JSON.parse(el.dataset.functions || "[]");

      if (detailId) detailId.textContent = el.dataset.id || "";
      if (detailTitle) detailTitle.textContent = el.dataset.detailTitle || "";
      if (detailText) detailText.textContent = el.dataset.detailText || "";

      if (detailFunctions) {
        detailFunctions.innerHTML = functions
          .map((fn) => `<li>${escapeHtml(fn)}</li>`)
          .join("");
      }

      if (detailNote) {
        const noteText = detailNote.querySelector(".diagram-detail-note-text");
        if (noteText) noteText.textContent = el.dataset.note || "";
      }

      if (currentIndexEl) currentIndexEl.textContent = String(index + 1);
      currentIndex = index;
    };

    items.forEach((el, index) => {
      el.addEventListener("click", () => renderRichDetail(index));
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const nextIndex =
          currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
        renderRichDetail(nextIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const nextIndex =
          currentIndex + 1 >= items.length ? 0 : currentIndex + 1;
        renderRichDetail(nextIndex);
      });
    }

    renderRichDetail(currentIndex);
    return;
  }

  const frame = document.getElementById("lesson-diagram-canvas");
  const tooltip = document.getElementById("diagram-tooltip");
  const tooltipText = document.getElementById("diagram-tooltip-text");
  const tooltipClose = document.getElementById("diagram-tooltip-close");
  const points = document.querySelectorAll(".diagram-hotspot");

  if (!frame || !tooltip || !tooltipText || !points.length) return;

  const hideTooltip = () => {
    tooltip.hidden = true;
    tooltip.classList.remove("active");
    points.forEach((p) => p.classList.remove("active"));
  };

  points.forEach((point) => {
    point.addEventListener("click", (e) => {
      e.stopPropagation();

      const isActive = point.classList.contains("active");

      points.forEach((p) => p.classList.remove("active"));

      if (isActive) {
        hideTooltip();
        return;
      }

      point.classList.add("active");

      tooltipText.textContent = point.dataset.label || "";
      tooltip.style.top = point.dataset.popupTop || point.style.top;
      tooltip.style.left = point.dataset.popupLeft || point.style.left;

      tooltip.hidden = false;
      tooltip.classList.add("active");
    });
  });

  if (tooltipClose) {
    tooltipClose.addEventListener("click", (e) => {
      e.stopPropagation();
      hideTooltip();
    });
  }

  document.addEventListener("click", hideTooltip);
}
function _buildSubNotFoundHtml(sectionId, subId) {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">Không tìm thấy Mục ${subId}</div>
        <p class="empty-state-text">Mục này chưa có nội dung hoặc không tồn tại.</p>
        <a href="#/section/${sectionId}" class="btn-back" style="margin-top:var(--space-4)">
          ← Về Chương ${sectionId}
        </a>
      </div>
    </div>
  `;
}

function _buildErrorHtml() {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Lỗi tải dữ liệu</div>
        <p class="empty-state-text">Không thể tải file dữ liệu. Vui lòng kiểm tra lại.</p>
      </div>
    </div>
  `;
}
function _enableDiagramCoordinateDebug() {
  const canvas = document.getElementById("lesson-diagram-canvas");
  if (!canvas) return;

  canvas.addEventListener("click", (e) => {
    if (!e.altKey) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const left = ((x / rect.width) * 100).toFixed(2) + "%";
    const top = ((y / rect.height) * 100).toFixed(2) + "%";

    console.log(`top: "${top}", left: "${left}"`);
    alert(`top: "${top}", left: "${left}"`);
  });
}
