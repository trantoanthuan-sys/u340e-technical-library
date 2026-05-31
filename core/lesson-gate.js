/**
 * core/lesson-gate.js — Pre-test Gate cho mỗi bài học
 * ===================================================
 *
 * Triển khai yêu cầu "phải làm quiz ≥ 60% mới mở khóa nội dung bài".
 *
 * KIẾN TRÚC:
 *   - Mỗi bài (1-5) có 1 quiz đầu vào, dùng chung dữ liệu từ data/lesson-outcomes.js
 *   - Trạng thái pass lưu IN-MEMORY (mất khi F5 hoặc đóng tab) — để đảm bảo
 *     mỗi lần truy cập đều phải làm quiz từ đầu, phù hợp demo và sử dụng học tập.
 *   - Khi user vào bất kỳ mục con nào (1.1, 1.2,...) mà chưa pass quiz bài đó →
 *     section.js sẽ render renderGateView() thay vì nội dung gốc
 *   - Có cơ chế bypass cho giảng viên: nhập password (lưu sessionStorage → giữ
 *     qua F5 trong cùng phiên, mất khi đóng tab)
 *
 * EXPORTS:
 *   - isLessonPassed(baiId)    → true nếu đã pass quiz bài này (hoặc đang bypass)
 *   - markLessonPassed(baiId)  → đánh dấu đã pass (gọi sau khi quiz đạt ≥ 60%)
 *   - resetLessonGate(baiId)   → xóa cờ pass (debug / admin)
 *   - renderGateView(baiId)    → HTML của trang gate (quiz lớn + thông báo)
 *   - initGateHandlers()       → đăng ký event listeners (gọi 1 lần lúc khởi động)
 *
 * INTEGRATION:
 *   Trong modules/section.js, khi render mục con:
 *     if (!isLessonPassed(baiId)) {
 *       return renderGateView(baiId);
 *     }
 *     // ... render nội dung như cũ
 */

import { lessonOutcomes } from "../data/lesson-outcomes.js";

// ═══ Constants ═══
const BYPASS_FLAG_KEY = "u340e:gate:bypass-session";
const BYPASS_PASSWORD = "123456"; // mật khẩu cho giảng viên
const PASS_THRESHOLD = 0.6; // 60%

// ═══ State (in-memory, mất khi F5) ═══
// Trạng thái pass quiz — Set chứa các baiId đã pass
// CHỦ ĐÍCH: KHÔNG dùng localStorage, để mỗi lần refresh trang sẽ reset về ban đầu.
const _passedLessons = new Set(); // chứa baiId (number) đã pass

// Quiz answers cho pre-test (cũng in-memory)
const _pretestState = new Map(); // baiId → { answers: number[], submitted: boolean, lastScore: number }

// ─────────────────────────────────────────────────────────────────
// PUBLIC API — Trạng thái pass
// ─────────────────────────────────────────────────────────────────

/**
 * Kiểm tra bài học đã được mở khóa (pass quiz ≥ 60% hoặc đang bypass) chưa.
 * Trạng thái pass là IN-MEMORY — F5 sẽ reset về false.
 */
export function isLessonPassed(baiId) {
  if (isBypassActive()) return true;
  return _passedLessons.has(parseInt(baiId, 10));
}

/**
 * Đánh dấu một bài đã pass. Chỉ lưu trong-memory cho phiên hiện tại.
 * Khi F5 hoặc đóng tab → cờ này biến mất → user phải làm lại quiz.
 */
export function markLessonPassed(baiId) {
  _passedLessons.add(parseInt(baiId, 10));
}

/**
 * Xóa cờ pass của 1 bài (debug / admin / "làm lại từ đầu").
 */
export function resetLessonGate(baiId) {
  _passedLessons.delete(parseInt(baiId, 10));
  _pretestState.delete(parseInt(baiId, 10));
}

/**
 * Xóa cờ pass của TẤT CẢ bài (dùng cho debug hoặc nút "reset toàn bộ").
 */
export function resetAllLessons() {
  _passedLessons.clear();
  _pretestState.clear();
}

/**
 * Bypass mode: giảng viên bật bypass thì mọi bài đều unlock.
 * Bypass có thể bật bằng (a) URL ?bypass=<password> hoặc (b) nhập mật khẩu trên modal.
 * Bypass chỉ tồn tại trong phiên (sessionStorage), reload tab sẽ giữ, đóng tab thì mất.
 */
export function isBypassActive() {
  try {
    return sessionStorage.getItem(BYPASS_FLAG_KEY) === "active";
  } catch {
    return false;
  }
}

export function activateBypass() {
  try {
    sessionStorage.setItem(BYPASS_FLAG_KEY, "active");
  } catch {
    // ignore
  }
}

export function deactivateBypass() {
  try {
    sessionStorage.removeItem(BYPASS_FLAG_KEY);
  } catch {
    // ignore
  }
}

// Tự động kích hoạt bypass nếu URL có ?bypass=<password>
function checkUrlBypass() {
  try {
    const url = new URL(window.location.href);
    const pw = url.searchParams.get("bypass");
    if (pw === BYPASS_PASSWORD) {
      activateBypass();
      // Xóa param khỏi URL cho gọn (không reload)
      url.searchParams.delete("bypass");
      window.history.replaceState({}, "", url.toString());
    }
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────
// HTML RENDERING
// ─────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render full trang gate — hiển thị khi user truy cập mục mà chưa pass quiz bài đó.
 * Bao gồm: banner "🔒 Bài chưa mở khóa" + quiz pre-test + kết quả (nếu đã submit).
 */
export function renderGateView(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.quiz) {
    // Không có quiz cho bài này → mở khóa luôn (failsafe)
    markLessonPassed(baiId);
    return "";
  }

  const state = _pretestState.get(baiId) || {
    answers: new Array(data.quiz.length).fill(null),
    submitted: false,
    lastScore: null,
  };

  const questions = data.quiz
    .map((q, qi) => renderQuestion(baiId, q, qi, state))
    .join("");

  const scorePanel = state.submitted
    ? renderScorePanel(baiId, data, state)
    : "";
  const submitButton = !state.submitted
    ? `<button class="btn-primary gate-submit" data-bai="${baiId}">✓ Nộp bài kiểm tra</button>`
    : "";

  return `
    <div class="lesson-gate-wrapper" data-bai="${baiId}">

      <!-- Banner -->
      <div class="lesson-gate-banner">
        <div class="gate-banner-icon">🔒</div>
        <div class="gate-banner-content">
          <h2 class="gate-banner-title">Bài ${baiId} chưa được mở khoá</h2>
          <p class="gate-banner-desc">
            Để đảm bảo bạn đã chuẩn bị tốt trước khi vào học, vui lòng hoàn thành
            <strong>bài kiểm tra đầu vào</strong> dưới đây. Bạn cần đạt
            <strong>tối thiểu ${Math.round(PASS_THRESHOLD * 100)}%</strong>
            để mở khoá nội dung bài học. Có thể làm lại không giới hạn số lần.
          </p>
        </div>
      </div>

      <!-- Pre-test quiz -->
      <section class="lesson-pretest" data-bai="${baiId}">
        <div class="pretest-header">
          <span class="pretest-icon">📝</span>
          <h3 class="pretest-title">Bài kiểm tra đầu vào — Bài ${baiId}</h3>
        </div>
        <p class="pretest-intro">
          ${data.quiz.length} câu hỏi · cần đạt ≥ ${Math.round(PASS_THRESHOLD * 100)}% để mở khoá
        </p>

        <div class="pretest-questions">
          ${questions}
        </div>

        ${submitButton}
        ${scorePanel}

      </section>

      <!-- Footer: bypass cho giảng viên -->
      <div class="gate-bypass-footer">
        <button class="gate-bypass-trigger" type="button">
          🔑 Tôi là giảng viên / cần xem trước
        </button>
      </div>

    </div>
  `;
}

function renderQuestion(baiId, q, qi, state) {
  const userAnswer = state.answers[qi];
  const isSubmitted = state.submitted;

  const options = q.options
    .map((opt, oi) => {
      const checked = userAnswer === oi;
      let resultClass = "";
      if (isSubmitted) {
        if (oi === q.correctIndex) resultClass = "pretest-option-correct";
        else if (checked && oi !== q.correctIndex)
          resultClass = "pretest-option-wrong";
      }
      return `
        <label class="pretest-option ${resultClass}">
          <input type="radio"
                 name="pretest-${baiId}-q${qi}"
                 value="${oi}"
                 data-bai="${baiId}"
                 data-q="${qi}"
                 data-opt="${oi}"
                 class="pretest-radio"
                 ${checked ? "checked" : ""}
                 ${isSubmitted ? "disabled" : ""}>
          <span class="pretest-option-text">${escapeHtml(opt)}</span>
          ${
            isSubmitted && oi === q.correctIndex
              ? '<span class="pretest-badge-correct">✓ Đúng</span>'
              : ""
          }
          ${
            isSubmitted && checked && oi !== q.correctIndex
              ? '<span class="pretest-badge-wrong">Bạn chọn</span>'
              : ""
          }
        </label>
      `;
    })
    .join("");

  return `
    <div class="pretest-question" data-q="${qi}">
      <div class="pretest-q-header">
        <span class="pretest-q-num">Câu ${qi + 1}</span>
        <span class="pretest-q-total">/ ${state.answers.length}</span>
      </div>
      <p class="pretest-q-text">${escapeHtml(q.question)}</p>
      <div class="pretest-options">${options}</div>
      ${
        isSubmitted
          ? `<div class="pretest-explanation">
             <strong>💡 Giải thích:</strong> ${escapeHtml(q.explanation)}
           </div>`
          : ""
      }
    </div>
  `;
}

function renderScorePanel(baiId, data, state) {
  const correct = state.answers.reduce(
    (sum, a, i) => sum + (a === data.quiz[i].correctIndex ? 1 : 0),
    0,
  );
  const total = data.quiz.length;
  const pct = total > 0 ? correct / total : 0;
  const passed = pct >= PASS_THRESHOLD;
  const pctRound = Math.round(pct * 100);

  if (passed) {
    return `
      <div class="pretest-score pretest-score-passed">
        <div class="pretest-score-icon">🎉</div>
        <div class="pretest-score-main">
          <div class="pretest-score-num">${correct} / ${total} câu đúng (${pctRound}%)</div>
          <div class="pretest-score-msg">Chúc mừng! Bạn đã đạt yêu cầu và mở khoá nội dung Bài ${baiId}.</div>
        </div>
        <button class="btn-primary gate-unlock" data-bai="${baiId}">
          ▶ Vào học Bài ${baiId}
        </button>
      </div>
    `;
  } else {
    return `
      <div class="pretest-score pretest-score-failed">
        <div class="pretest-score-icon">📚</div>
        <div class="pretest-score-main">
          <div class="pretest-score-num">${correct} / ${total} câu đúng (${pctRound}%)</div>
          <div class="pretest-score-msg">
            Chưa đạt yêu cầu (cần ≥ ${Math.round(PASS_THRESHOLD * 100)}%).
            Bạn có thể xem giải thích của các câu sai bên trên rồi làm lại.
          </div>
        </div>
        <button class="btn-secondary gate-retry" data-bai="${baiId}">
          🔁 Làm lại bài kiểm tra
        </button>
      </div>
    `;
  }
}

// ─────────────────────────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────────────────────────

let _handlersBound = false;

export function initGateHandlers() {
  // Kích hoạt bypass từ URL nếu có
  checkUrlBypass();

  if (_handlersBound) return;
  _handlersBound = true;

  document.addEventListener("change", onChange);
  document.addEventListener("click", onClick);
}

function onChange(e) {
  if (!e.target.matches(".pretest-radio")) return;

  const baiId = parseInt(e.target.dataset.bai, 10);
  const q = parseInt(e.target.dataset.q, 10);
  const opt = parseInt(e.target.dataset.opt, 10);
  const data = lessonOutcomes[baiId];
  if (!data) return;

  let state = _pretestState.get(baiId);
  if (!state) {
    state = {
      answers: new Array(data.quiz.length).fill(null),
      submitted: false,
      lastScore: null,
    };
    _pretestState.set(baiId, state);
  }
  state.answers[q] = opt;
}

function onClick(e) {
  // Submit pretest
  if (e.target.matches(".gate-submit")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    submitPretest(baiId);
  }
  // Retry pretest
  else if (e.target.matches(".gate-retry")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    _pretestState.delete(baiId);
    rerenderGate(baiId);
  }
  // Unlock button (sau khi pass)
  else if (e.target.matches(".gate-unlock")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    markLessonPassed(baiId);
    // KHÔNG dùng window.location.reload() vì sẽ làm mất state in-memory
    // → ép router re-render route hiện tại bằng cách dispatch hashchange event.
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  // Bypass trigger (giảng viên)
  else if (e.target.matches(".gate-bypass-trigger")) {
    openBypassDialog();
  }
}

function submitPretest(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data) return;

  let state = _pretestState.get(baiId);
  if (!state) {
    state = {
      answers: new Array(data.quiz.length).fill(null),
      submitted: false,
      lastScore: null,
    };
    _pretestState.set(baiId, state);
  }

  // Yêu cầu trả lời hết câu hỏi
  const unanswered = state.answers.findIndex((a) => a === null);
  if (unanswered >= 0) {
    alert(`Vui lòng trả lời Câu ${unanswered + 1} trước khi nộp bài.`);
    // Cuộn đến câu chưa trả lời
    const el = document.querySelector(
      `.pretest-question[data-q="${unanswered}"]`,
    );
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Tính điểm
  const correct = state.answers.reduce(
    (sum, a, i) => sum + (a === data.quiz[i].correctIndex ? 1 : 0),
    0,
  );
  const pct = correct / data.quiz.length;
  state.submitted = true;
  state.lastScore = pct;

  // Nếu pass thì lưu cờ vào memory (mất khi F5)
  if (pct >= PASS_THRESHOLD) {
    markLessonPassed(baiId);
  }

  rerenderGate(baiId);

  // Cuộn xuống phần kết quả
  setTimeout(() => {
    const el = document.querySelector(`.pretest-score`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 50);
}

function rerenderGate(baiId) {
  const wrapper = document.querySelector(
    `.lesson-gate-wrapper[data-bai="${baiId}"]`,
  );
  if (!wrapper) return;
  wrapper.outerHTML = renderGateView(baiId);
}

// ─────────────────────────────────────────────────────────────────
// BYPASS DIALOG (cho giảng viên)
// ─────────────────────────────────────────────────────────────────

function openBypassDialog() {
  const pw = prompt(
    "Nhập mật khẩu giảng viên để bỏ qua bài kiểm tra:\n\n" +
      "(Mật khẩu này được giữ trong suốt phiên hiện tại — kể cả khi F5. " +
      "Chỉ mất khi đóng hẳn tab trình duyệt.)",
  );
  if (pw === null) return; // User bấm Cancel

  if (pw === BYPASS_PASSWORD) {
    activateBypass();
    alert(
      "✓ Đã kích hoạt chế độ giảng viên. Tất cả bài học đã được mở khoá cho phiên này.",
    );
    // Re-render route hiện tại để hiện nội dung (thay vì reload làm mất state khác)
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    alert("✗ Mật khẩu không đúng.");
  }
}
