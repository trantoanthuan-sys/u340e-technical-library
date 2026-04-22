/**
 * modules/home.js — Dashboard (Home Page)
 * =========================================
 * Renders the main dashboard with section cards.
 * Called by router when hash is '#/'.
 */

import { store } from "../core/store.js";
import {
  renderPage,
  renderBreadcrumb,
  escapeHtml,
  showLoading,
} from "../core/renderer.js";

// Accent colors per section (matches sections.json color field)
const SECTION_COLORS = [
  "#1e3a6e", // Section 1 — Navy
  "#065f46", // Section 2 — Emerald
  "#92400e", // Section 3 — Amber/Brown
  "#6b21a8", // Section 4 — Purple
  "#991b1b", // Section 5 — Red (DTC)
];

/**
 * Main entry point — called by router.
 */
export async function renderHome() {
  showLoading();

  // Update breadcrumb to home
  renderBreadcrumb([{ label: "Trang Chủ" }]);

  // Update sidebar state
  store.set("activeSectionId", null);
  store.set("activeSubId", null);
  store.set("activeDtcCode", null);

  try {
    const sections = await store.loadSections();
    renderPage(_buildHomeHtml(sections));
    _bindHomeEvents();
  } catch (err) {
    console.error("[Home] Failed to load sections:", err);
    renderPage(_buildErrorHtml());
  }
}

// ─── HTML Builders ───────────────────────────────────────────────

function _buildHomeHtml(sections) {
  const cardsHtml = sections.map((s, i) => _buildSectionCard(s, i)).join("");

  return `
    <div class="content-wrapper animate-fade-in">

      <!-- TRANG GIỚI THIỆU -->
      <div class="home-landing" id="home-landing">
        <div class="page-title-block">
          <div class="home-hero">
            <div class="home-hero-media">
              <img
                src="assets/images/hero-u340e.png"
                alt="Hộp số tự động U340E"
                class="home-hero-image"
              />
            </div>

            <div class="home-hero-content">
              <h1 class="page-title">
                Hộp Số Tự Động <span style="color: var(--color-amber-600);">U340E</span>
              </h1>

              <p class="page-subtitle">
                U340E là hộp số tự động 4 cấp được Toyota sử dụng trên một số dòng xe du lịch cỡ nhỏ và trung bình.
                Hộp số có kết cấu gọn, làm việc ổn định, sử dụng hệ thống điều khiển điện – thủy lực điển hình,
                rất phù hợp để học tập, nghiên cứu và tra cứu kỹ thuật trong chuyên ngành Kỹ thuật Ô tô.
              </p>

              <div class="home-overview">
                <div class="home-overview-item">
                  <strong>Loại hộp số:</strong> Hộp số tự động 4 cấp
                </div>
                <div class="home-overview-item">
                  <strong>Điều khiển:</strong> Điện tử kết hợp thủy lực
                </div>
                <div class="home-overview-item">
                  <strong>Ứng dụng:</strong> Một số dòng xe Toyota sử dụng hộp số U340E
                </div>
              </div>

              <div class="home-stats">
                <div class="home-stat">
                  <span class="home-stat-num">5</span>
                  <span class="home-stat-label">Chương</span>
                </div>
                <div class="home-stat-divider"></div>
                <div class="home-stat">
                  <span class="home-stat-num">19</span>
                  <span class="home-stat-label">Mục</span>
                </div>
                <div class="home-stat-divider"></div>
                <div class="home-stat">
                  <span class="home-stat-num">12</span>
                  <span class="home-stat-label">Mã Lỗi DTC</span>
                </div>
              </div>

              <button class="home-start-btn" id="btn-start-learning">
                Bắt đầu học tập
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TRANG DANH MỤC HỌC -->
      <div class="home-learning" id="home-learning" hidden>
        <a href="#" class="btn-back-home" id="btn-back-home">
          ← Quay lại trang giới thiệu
        </a>

        <div class="page-title-block">
          <h1 class="page-title">
            Danh Mục Học Tập <span style="color: var(--color-amber-600);">U340E</span>
          </h1>

          <p class="page-subtitle">
            Chọn một chương để bắt đầu học tập và tra cứu nội dung kỹ thuật hộp số tự động U340E.
          </p>
        </div>

        <div class="dashboard-grid" id="dashboard-grid">
          ${cardsHtml}
        </div>

        <div class="home-dtc-banner" id="home-dtc-banner">
          <div class="dtc-banner-left">
            <span class="dtc-banner-icon">⚠</span>
            <div>
              <div class="dtc-banner-title">Tra Cứu Mã Lỗi DTC</div>
              <div class="dtc-banner-sub">
                12 mã lỗi với quy trình chẩn đoán chi tiết
              </div>
            </div>
          </div>

          <a href="#/dtc" class="dtc-banner-btn">
            Xem Danh Mục →
          </a>
        </div>
      </div>

    </div>
  `;
}

function _buildSectionCard(section, index) {
  const color = SECTION_COLORS[index] || "var(--color-navy-500)";
  const count = section.subsections?.length ?? 0;
  const isDtc = section.isDtcSection;
  const href = isDtc ? "#/dtc" : `#/section/${section.id}`;

  return `
    <a href="${href}"
       class="section-card ${isDtc ? "card-dtc" : ""}"
       style="--card-accent: ${color};">
      <div class="section-card-body">

        <div class="section-card-num">
          CHƯƠNG ${escapeHtml(String(section.id))}
        </div>

        <div class="section-card-title">
          ${escapeHtml(section.title)}
        </div>

        <div class="section-card-desc">
          ${escapeHtml(section.description)}
        </div>

        <div class="section-card-footer">
          <span class="section-card-count">
            ${isDtc ? "⚠ Danh mục mã lỗi DTC" : `${count} mục học`}
          </span>
          <svg class="section-card-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

      </div>
    </a>
  `;
}

function _buildErrorHtml() {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Không tải được dữ liệu</div>
        <p class="empty-state-text">
          Vui lòng kiểm tra file <code>data/sections.json</code> và thử lại.
        </p>
      </div>
    </div>
  `;
}

// ─── Event Bindings ──────────────────────────────────────────────

function _bindHomeEvents() {
  const startBtn = document.getElementById("btn-start-learning");
  const backBtn = document.getElementById("btn-back-home");
  const landing = document.getElementById("home-landing");
  const learning = document.getElementById("home-learning");

  if (startBtn && landing && learning) {
    startBtn.addEventListener("click", () => {
      landing.hidden = true;
      learning.hidden = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (backBtn && landing && learning) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();

      learning.hidden = true;
      landing.hidden = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
