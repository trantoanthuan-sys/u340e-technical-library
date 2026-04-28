<div align="center">

![Logo Bách Khoa](assets/images/logo-bk.png)

# 🔧 U340E — Thư Viện Kỹ Thuật

### Hệ thống tra cứu kỹ thuật hộp số tự động Toyota U340E

**Đồ án môn học** — Khoa Kỹ thuật Giao thông
Bộ môn Kỹ thuật Ô tô — Máy Động lực
Trường Đại học Bách Khoa — ĐHQG TP. Hồ Chí Minh

![Status](https://img.shields.io/badge/status-completed-success)
![Tech](https://img.shields.io/badge/JavaScript-ES2020-f7df1e)
![CSS](https://img.shields.io/badge/CSS-Custom_Properties-1572B6)
![License](https://img.shields.io/badge/license-Academic-blue)

</div>

---

## 📖 Giới thiệu

**U340E — Thư Viện Kỹ Thuật** là ứng dụng web dạng **Single Page Application (SPA)** phục vụ tra cứu, học tập và tham khảo kỹ thuật hộp số tự động **Toyota U340E** — hộp số 4 cấp tự động phổ biến trên các dòng xe du lịch cỡ nhỏ và trung bình (Vios, Yaris, Corolla Altis...).

**Mục tiêu:**
- 📚 Hỗ trợ giảng dạy & học tập cho sinh viên ngành Kỹ thuật Ô tô
- 🔍 Tra cứu nhanh nội dung kỹ thuật và mã lỗi DTC
- 🛠️ Tham khảo quy trình tháo lắp dựa trên thực hành mô hình
- 💡 Trực quan hóa cấu tạo bằng sơ đồ tương tác kiểu PowerPoint
- 🩺 Hướng dẫn chẩn đoán mã lỗi với flowchart YES/NO động

### 📊 Số liệu

**5 chương** — **16 mục** — **18 mã lỗi DTC** — **160+ hình minh họa**

---

## ✨ Tính năng chính

- 🏠 **Dashboard trực quan** — 5 chương dưới dạng thẻ, mỗi chương một màu riêng
- 🧭 **Sidebar + Breadcrumb động** — luôn biết đang ở đâu trong hệ thống
- 🔍 **Tìm kiếm toàn cục** — phím tắt `Ctrl+K`, tìm cả nội dung và mã lỗi DTC, hỗ trợ **tiếng Việt không dấu**
- ⚠️ **Tra cứu mã lỗi DTC** — lọc theo 5 nhóm, **flowchart chẩn đoán tương tác** kiểu PowerPoint (cây mọc dần theo lựa chọn YES/NO)
- 🎯 **Sơ đồ tương tác** — click số thứ tự trên hình để xem chi tiết bộ phận
- 📐 **Render công thức LaTeX** — hiển thị công thức đẹp như sách giáo khoa (KaTeX, offline)
- 🔗 **Liên kết chéo** — bài học và mã lỗi DTC liên kết hai chiều (`relatedDTC` ↔ `relatedSections`)
- 📷 **Layout 2 cột** (Chương 4) — so sánh trực quan **hình kỹ thuật** từ tài liệu Toyota với **ảnh thực tế** khi nhóm tháo lắp
- 📱 **Responsive** — tối ưu cho desktop, tablet và mobile
- ♿ **Accessible** — ARIA labels, phím tắt, keyboard navigation

### 🚀 Điểm khác biệt

Project này khác các tài liệu kỹ thuật truyền thống (Word/PDF/slide) ở **5 điểm cốt lõi**:

| | Đặc điểm | Giá trị |
|:---:|---|---|
| 🎯 | **Interactive Flowchart** | DTC chẩn đoán dạng cây mọc dần theo YES/NO — active learning thay vì đọc tĩnh |
| 📦 | **JSON Content System** | Nội dung tách khỏi code, dễ mở rộng sang U440E/U660E |
| ⚙️ | **Vanilla JS SPA** | Tự viết router + store, không phụ thuộc framework |
| 📐 | **LaTeX Math Rendering** | Công thức tính toán đẹp như sách giáo khoa (KaTeX) |
| 📷 | **Documentation + Reality** | 2 cột song song: tài liệu Toyota vs ảnh thực hành nhóm |

---

## 📚 Cấu trúc nội dung

| Chương | Tiêu đề | Số mục | Trọng tâm |
|:---:|---|:---:|---|
| **1** | Kết Cấu Hộp Số | 5 | Biến mô, bơm dầu, bộ hành tinh, ly hợp - phanh |
| **2** | Điều Khiển & Thủy Lực | 2 | Hệ thống thủy lực, hệ thống điện tử (cảm biến, ECU) |
| **3** | Nguyên Lý Làm Việc | 7 | Tổng quan + 6 chế độ tay số (1, 2, 3, 4 OD, lùi) |
| **4** | Quy Trình Tháo Lắp | 2 | 22 bước tháo + 26 bước lắp, ảnh thực tế |
| **5** | Chẩn Đoán & Bảo Dưỡng | — | 18 mã DTC từ Toyota Service Manual với flowchart |

### Chương 5 — Database mã lỗi DTC

Phân loại theo **5 nhóm** dựa trên Toyota Service Manual:

| Nhóm | Mã lỗi | Phạm vi |
|:---:|---|---|
| **P07** Cảm Biến | `P0705` `P0710` `P0711` `P0712` `P0713` `P0717` | Cảm biến vị trí cần số, nhiệt độ ATF, tốc độ NT |
| **P0750** Solenoid Hiệu Suất | `P0751` `P0756` | Solenoid chuyển số S1, S2 (performance) |
| **P0780** Solenoid ON/OFF | `P0787` `P0788` | Solenoid chuyển đổi ST (mạch thấp/cao) |
| **P0970** Solenoid S1/S2 | `P0973` `P0974` `P0976` `P0977` | Mạch S1, S2 (thấp/cao) |
| **P2700** Solenoid Tuyến Tính | `P2714` `P2716` `P2757` `P2759` | SLT (line pressure), SLU (lock-up) |

Mỗi mã lỗi đều có:
- ✅ **Symptom** — triệu chứng nhận biết
- ✅ **Possible Causes** — danh sách nguyên nhân khả dĩ
- ✅ **Diagnosis** — quy trình chẩn đoán step-by-step (text)
- ✅ **Interactive Flowchart** — sơ đồ tư duy YES/NO mọc dần kiểu PowerPoint
- ✅ **Related Sections** — link đến chương/mục lý thuyết liên quan

---

## 🚀 Hướng dẫn chạy

> ⚠️ **QUAN TRỌNG**: Project dùng `fetch()` để load JSON nên **không chạy được qua `file://`**. Cần mở qua local HTTP server.

### Cách 1 — Live Server (khuyến nghị) ⭐

1. Mở project trong [VS Code](https://code.visualstudio.com/)
2. Cài extension **Live Server** (Ritwick Dey)
3. Chuột phải vào `index.html` → **"Open with Live Server"**
4. Trình duyệt tự mở tại `http://127.0.0.1:5500`

### Cách 2 — Python

```bash
cd "đường/dẫn/đến/U340E Project"
python -m http.server 8000
# Truy cập: http://localhost:8000
```

### Cách 3 — Node.js

```bash
npx serve
# hoặc: npx http-server -p 8000
```

### Yêu cầu trình duyệt

Chrome ≥ 61, Firefox ≥ 60, Safari ≥ 11, Edge ≥ 16 (hỗ trợ ES Modules + CSS Custom Properties)

---

## 🧭 Hướng dẫn sử dụng

### Điều hướng

- **Trang chủ** — click logo hoặc "Trang chủ" trên breadcrumb
- **Chọn chương/bài học** — click thẻ ở dashboard hoặc mục trong sidebar
- **Quay lại** — dùng nút "← Quay lại" hoặc breadcrumb

### Phím tắt

| Phím tắt | Chức năng |
|:---:|---|
| `Ctrl+K` / `⌘+K` | Mở tìm kiếm |
| `Esc` | Đóng sidebar / tìm kiếm |
| `Tab` | Di chuyển giữa các phần tử |

### Tra cứu mã lỗi DTC

1. Vào **"Chẩn Đoán & Bảo Dưỡng"** → **"Tra Cứu Mã Lỗi DTC"**
2. Lọc theo **5 nhóm** hoặc dùng search box
3. Click vào mã lỗi → trang chi tiết
4. Tại block **"Chẩn Đoán Tương Tác"**:
   - **Tab "Step-by-step"**: trả lời từng câu hỏi YES/NO theo wizard
   - **Tab "Sơ đồ chẩn đoán"**: cây flowchart mọc dần khi click YES/NO

### Sơ đồ tương tác (Chương 1-3)

Click vào **số thứ tự** trên sơ đồ để xem chi tiết bộ phận. Dùng nút **Trước/Sau** để duyệt lần lượt.

---

## 🛠️ Công nghệ sử dụng

| Lĩnh vực | Công nghệ | Lý do chọn |
|---|---|---|
| **Frontend** | Vanilla JavaScript (ES Modules) | Hiểu sâu nền tảng, không phụ thuộc framework |
| **Kiến trúc** | Hash-based SPA Router tự viết | Học cách routing hoạt động từ zero |
| **State** | Custom Store (Pub/Sub pattern) | Mô phỏng Redux/Zustand thu nhỏ |
| **Styling** | CSS3 với Custom Properties | Design system có thể mở rộng |
| **Typography** | IBM Plex Sans / Serif / Mono | Phù hợp ngữ cảnh kỹ thuật, học thuật |
| **Data** | JSON (lazy-loaded) | Tách nội dung khỏi code, dễ cập nhật |
| **Math Rendering** | [KaTeX 0.16.11](https://katex.org/) (offline) | Render công thức LaTeX nhanh, đẹp, không cần Internet |
| **Flowchart** | HTML/CSS tự render | Custom animation kiểu PowerPoint, tương tác YES/NO |

> **Không dùng** React/Vue/Angular hay build tool (Webpack/Vite). Toàn bộ code chạy trực tiếp trên trình duyệt hỗ trợ ES Modules.
>
> **Thư viện duy nhất là KaTeX** — được tải về trong thư mục `vendor/katex/` để đảm bảo hoạt động offline 100%.

---

## 📁 Cấu trúc thư mục

```
U340E Project/
│
├── index.html              # Entry HTML + app shell
├── app.js                  # Bootstrap + global events
├── README.md
│
├── core/                   # 🧩 Hạ tầng dùng chung
│   ├── router.js          #   Hash-based SPA router
│   ├── store.js           #   State + data fetching + cache
│   └── renderer.js        #   DOM helpers
│
├── modules/                # 🎨 Các module tính năng
│   ├── home.js            #   Trang chủ
│   ├── section.js         #   Trang chương + bài học
│   └── dtc.js             #   Danh mục + chi tiết DTC + flowchart
│
├── data/                   # 📊 Nội dung (JSON)
│   ├── sections.json      #   Metadata 5 chương
│   ├── section-1.json     #   Chương 1 (5 mục)
│   ├── section-2.json     #   Chương 2 (2 mục)
│   ├── section-3.json     #   Chương 3 (7 mục)
│   ├── section-4.json     #   Chương 4 (2 mục: tháo + lắp)
│   └── dtc.json           #   18 mã lỗi DTC + diagnosisFlow
│
├── styles/                 # 🎨 CSS (tách 3 tầng)
│   ├── base.css           #   Design tokens, reset, typography
│   ├── layout.css         #   Header, sidebar, app shell
│   └── components.css     #   Card, button, table, flowchart...
│
├── assets/images/          # 🖼️ Hình ảnh kỹ thuật
│   ├── hero-u340e.png, logo-bk.png, logo-khoa.png
│   ├── s1/, s2/, s3/      #   Hình minh họa chương 1, 2, 3
│   └── s4/                #   Ảnh tháo lắp thực tế nhóm (160+ ảnh)
│
└── vendor/                 # 📦 Thư viện bên thứ 3 (offline)
    └── katex/             #   KaTeX 0.16.11 — math formula rendering
        ├── katex.min.css  #     CSS (23 KB)
        ├── katex.min.js   #     JS (275 KB)
        └── fonts/         #     60 file font (TTF/WOFF/WOFF2)
```

---

## 🏗️ Kiến trúc

Project áp dụng pattern **tách lớp 3 tầng** rõ ràng:

```
┌─────────────────────────────────────────────────┐
│  index.html  ←  App Shell (header + sidebar)    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  app.js  ←  Bootstrap & Global Events            │
└─────────────────────────────────────────────────┘
                      ↓
┌──────────────┬──────────────┬──────────────────┐
│   core/      │   modules/   │    data/         │
│ (hạ tầng)    │ (tính năng)  │   (nội dung)     │
├──────────────┼──────────────┼──────────────────┤
│ • router.js  │ • home.js    │ • sections.json  │
│ • store.js   │ • section.js │ • section-N.json │
│ • renderer.js│ • dtc.js     │ • dtc.json       │
└──────────────┴──────────────┴──────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  styles/  ←  Design System (tokens + layers)    │
└─────────────────────────────────────────────────┘
```

### Luồng xử lý một request điều hướng

```
User click link #/section/1/1.2
        ↓
window.hashchange event
        ↓
router.js → match "/section/:id/:subId"
        ↓
modules/section.js → renderSubSection({id:1, subId:"1.2"})
        ↓
store.js → loadSection(1) [có cache]
        ↓
renderer.js → renderPage() + renderBreadcrumb() + updateSidebar()
        ↓
DOM updated ✨
```

---

## 🧠 Hệ thống nội dung

### Tách nội dung khỏi code

Toàn bộ nội dung kỹ thuật được lưu trong **JSON files** trong thư mục `data/`. Khi cần cập nhật/sửa:
- ✅ **Không cần build, không cần deploy lại**
- ✅ Chỉ cần sửa file JSON tương ứng và refresh trình duyệt
- ✅ Dễ phân chia công việc (ví dụ: kỹ thuật viên viết nội dung không cần biết JavaScript)

### Cấu trúc một mục nội dung

```json
{
  "id": "1.2",
  "title": "Biến mô thủy lực",
  "content": {
    "intro": "Đoạn mở đầu giới thiệu...",
    "keyPoints": ["Điểm chính 1", "Điểm chính 2", "..."],
    "explain": [
      {
        "title": "Cấu tạo",
        "body": "Mô tả chi tiết..."
      }
    ],
    "specs": {
      "title": "Thông số kỹ thuật",
      "rows": [
        {"param": "Tốc độ stall", "value": "1500 - 2000 rpm"}
      ]
    },
    "relatedDTC": ["P2757", "P2759"]
  }
}
```

### Tính năng đặc biệt: `customHtml`

Để render bảng phức tạp (so sánh trạng thái phanh/ly hợp ở các tay số) hoặc layout 2 cột (Chương 4 — tháo lắp), `explain` card hỗ trợ field `customHtml`:

```json
{
  "title": "Bước 1: Tháo lọc nhớt hộp số",
  "customHtml": "<div class='step-2col'>...</div>"
}
```

### Cấu trúc DTC với diagnosisFlow

```json
{
  "code": "P0705",
  "title": "Lỗi Mạch Công Tắc Vị Trí Cần Số",
  "severity": "high",
  "symptom": "...",
  "possibleCauses": ["..."],
  "diagnosisFlow": {
    "startStep": 1,
    "steps": [
      {
        "id": 1,
        "title": "Xem dữ liệu động",
        "description": "...",
        "yes": 5,
        "no": 2
      },
      {
        "id": "result-replace-pn",
        "type": "result",
        "title": "Thay công tắc P/N"
      }
    ]
  }
}
```

→ Engine flowchart **tự render cây tương tác** từ JSON. Mỗi step có `yes`/`no` trỏ đến step tiếp theo (hoặc kết quả).

---

## 🩺 Tính năng nổi bật: Sơ đồ chẩn đoán DTC tương tác

Đây là **tính năng đặc trưng nhất** của project, đáp ứng yêu cầu giảng viên về tính tương tác:

### 2 chế độ trong cùng 1 block

#### 📋 Tab "Step-by-step"
- Wizard truyền thống: trả lời 1 câu hỏi tại 1 thời điểm
- Có **mini-map** hiển thị tổng quan luồng + click nhảy bước
- Lịch sử các bước đã đi, nút "Quay lại" / "Reset"

#### 🗺️ Tab "Sơ đồ chẩn đoán"
- **Animation kiểu PowerPoint**: ban đầu chỉ có Bước 1, click YES/NO → cây mọc thêm node
- Slide-in animation cho mỗi node mới
- Edge label YES (xanh) / NO (đỏ) fade-in
- Auto-scroll xuống node mới nhất
- Visited nodes mờ đi, current node nổi bật cam

### Ví dụ trải nghiệm

```
[Lần đầu vào]
   ┌─────────────────┐
   │ ① Xem dữ liệu   │ ← Highlight cam
   │   động           │
   │                  │
   │ [✅ YES → 5]     │
   │ [❌ NO  → 2]     │
   └─────────────────┘

[Click YES]
   ┌─────────────────┐
   │ ① Xem dữ liệu   │ ← Visited (xanh nhạt)
   │   động           │
   └─────────────────┘
            │
          🟢 YES
            │
            ▼
   ┌─────────────────┐
   │ ⓹ Kiểm tra dây  │ ← Current (cam, slide-in)
   │   nối ECU       │
   │                  │
   │ [✅ YES → 6]     │
   │ [❌ NO  → ...]   │
   └─────────────────┘
```

→ Dùng được trên cả **desktop và mobile**, hoạt động không cần Internet.

---

## 🤖 Sự đóng góp của AI

### Vai trò của AI trong project

Project này được thực hiện với sự hỗ trợ của **Claude AI** (Anthropic) trong các vai trò:

- 💻 **Code generation** — viết code JavaScript, CSS, parsers
- 🏗️ **Kiến trúc** — đề xuất cấu trúc thư mục, pattern SPA
- 🐛 **Debug** — tìm và sửa bug khi code không chạy đúng
- 📝 **Format nội dung** — chuyển nội dung Word → JSON, đặt tên ảnh có hệ thống
- 🎨 **UI/UX suggestions** — đề xuất layout, animation, responsive

### Nguyên tắc đảm bảo trung thực học thuật

1. **AI là trợ lý, không phải người làm chính** — mọi quyết định kiến trúc và nội dung kỹ thuật do người làm đồ án duyệt
2. **Hiểu code AI sinh ra** — không copy mù, phải đọc hiểu và có khả năng sửa đổi
3. **Kiến thức chuyên ngành là của con người** — AI viết code web, nhưng kiến thức về hộp số U340E đến từ giáo trình và tài liệu kỹ thuật chính thức (Toyota Service Manual)
4. **Nội dung thực hành là của nhóm** — Chương 4 (tháo lắp) gồm 48 bước với 160+ ảnh **do nhóm tự thực hiện và chụp** trên mô hình thực tế
5. **Minh bạch về việc dùng AI** — ghi rõ trong README để đảm bảo trung thực học thuật

---

## ✅ Trạng thái

### Đã hoàn thành (100%)

- ✅ Kiến trúc SPA với router & state management
- ✅ 5 chương nội dung — 16 mục
- ✅ 18 mã lỗi DTC từ Toyota Service Manual chính thức
- ✅ Sơ đồ chẩn đoán tương tác kiểu PowerPoint (cây mọc dần)
- ✅ Sơ đồ tương tác với hotspot (Chương 1-3)
- ✅ Tìm kiếm toàn cục với hỗ trợ tiếng Việt không dấu
- ✅ Layout 2 cột Chương 4 (tài liệu vs ảnh thực tế)
- ✅ Liên kết chéo bài học ↔ DTC (`relatedDTC` ↔ `relatedSections`)
- ✅ Render công thức LaTeX (KaTeX offline)
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ 160+ ảnh thực hành nhóm

### Có thể mở rộng (không bắt buộc)

- 🔄 Print stylesheet (in trang ra giấy)
- 🔄 Dark mode
- 🔄 QR code động cho từng trang DTC
- 🔄 Multi-language (Anh/Việt)
- 🔄 Export PDF từng chương

---

## 🎓 Thông tin đồ án

| Mục | Nội dung |
|---|---|
| **Tên đồ án** | Thư viện kỹ thuật hộp số tự động U340E |
| **Môn học** | Chẩn đoán và bảo dưỡng hộp số |
| **Sinh viên thực hiện** | Trần Toàn Thuận — MSSV: 2213366 |
| **Giảng viên hướng dẫn** | Nguyễn Đình Hùng |
| **Khoa/Bộ môn** | Kỹ thuật Giao thông — Kỹ thuật Ô tô — Máy Động lực |
| **Trường** | Đại học Bách Khoa — ĐHQG TP. Hồ Chí Minh |
| **Năm học** | 2025 — 2026 |

---

## 📄 License

Đồ án này được thực hiện với mục đích **học thuật**. Nội dung kỹ thuật về hộp số U340E dựa trên tài liệu công khai của Toyota Motor Corporation và các giáo trình chuyên ngành Kỹ thuật Ô tô.

Code có thể dùng cho mục đích học tập và tham khảo. Khi sử dụng lại, vui lòng ghi nguồn.

---

<div align="center">

**Made with ❤️ for Automotive Engineering students**

_Nếu bạn thấy project này hữu ích, hãy để lại một ⭐ trên repository!_

[⬆ Quay lại đầu trang](#-u340e--thư-viện-kỹ-thuật)

</div>
