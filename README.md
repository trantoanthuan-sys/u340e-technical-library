<div align="center">

![Logo Bách Khoa](assets/images/logo-bk.png)

# 🔧 U340E — Thư Viện Kỹ Thuật

### Hệ thống tra cứu kỹ thuật hộp số tự động Toyota U340E

**Đồ án môn học** — Khoa Kỹ thuật Giao thông
Bộ môn Kỹ thuật Ô tô — Máy Động lực
Trường Đại học Bách Khoa — ĐHQG TP. Hồ Chí Minh

![Status](https://img.shields.io/badge/status-in_development-orange)
![Tech](https://img.shields.io/badge/JavaScript-ES2020-f7df1e)
![CSS](https://img.shields.io/badge/CSS-Custom_Properties-1572B6)
![License](https://img.shields.io/badge/license-Academic-blue)

</div>

---

## 📸 Demo

> ⚠️ **Project đang trong giai đoạn phát triển.** Screenshot và video demo sẽ được cập nhật khi UI/UX hoàn thiện bản cuối cùng.

<details>
<summary>📋 Xem trước danh sách screenshot sẽ bổ sung</summary>

- [ ] Trang chủ (`home.png`)
- [ ] Bài học với sơ đồ tương tác (`lesson-diagram.png`)
- [ ] Nội dung kỹ thuật có bảng (`lesson-content.png`)
- [ ] Danh mục mã lỗi DTC (`dtc-list.png`)
- [ ] Chi tiết mã lỗi DTC (`dtc-detail.png`)

</details>

---

## 📖 Giới thiệu

**U340E — Thư Viện Kỹ Thuật** là ứng dụng web dạng **Single Page Application (SPA)** phục vụ tra cứu, học tập và tham khảo kỹ thuật hộp số tự động **Toyota U340E** — hộp số 4 cấp tự động phổ biến trên các dòng xe du lịch cỡ nhỏ và trung bình.

**Mục tiêu:**
- 📚 Hỗ trợ giảng dạy & học tập cho sinh viên ngành Kỹ thuật Ô tô
- 🔍 Tra cứu nhanh nội dung kỹ thuật và mã lỗi DTC
- 🛠️ Tham khảo quy trình tháo lắp, bảo dưỡng, chẩn đoán
- 💡 Trực quan hóa cấu tạo bằng sơ đồ tương tác

### 📊 Số liệu

**5 chương** — **19 mục** — **12 mã lỗi DTC** — **30+ hình minh họa**

---

## ✨ Tính năng chính

- 🏠 **Dashboard trực quan** — 5 chương dưới dạng thẻ, mỗi chương một màu riêng
- 🧭 **Sidebar + Breadcrumb động** — luôn biết đang ở đâu trong hệ thống
- 🔍 **Tìm kiếm toàn cục** — phím tắt `Ctrl+K`, tìm cả nội dung và mã lỗi DTC
- ⚠️ **Tra cứu mã lỗi DTC** — lọc theo 4 nhóm (P07, P08, P17, P27), quy trình chẩn đoán step-by-step
- 🎯 **Sơ đồ tương tác** — click vào số thứ tự trên hình để xem tên và chức năng bộ phận
- 📱 **Responsive** — tối ưu cho desktop, tablet và mobile
- ♿ **Accessible** — ARIA labels, phím tắt, keyboard navigation

### 🚀 Điểm khác biệt

Project này khác các tài liệu kỹ thuật truyền thống (Word/PDF/slide) ở **4 điểm cốt lõi**:

| | Đặc điểm | Giá trị |
|:---:|---|---|
| 🎯 | **Interactive Diagram** | Click để học thay vì nhìn hình tĩnh — active learning |
| 📦 | **JSON Content System** | Nội dung tách khỏi code, dễ mở rộng sang U440E/U660E |
| ⚙️ | **Vanilla JS SPA** | Tự viết router + store, không phụ thuộc React/Vue |
| 📱 | **Tối ưu tablet 10"** | Phù hợp thiết bị phổ biến trong phòng thực hành ô tô |

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

- **Trang chủ** — click logo hoặc breadcrumb
- **Chọn chương/bài học** — click thẻ ở dashboard hoặc mục trong sidebar
- **Quay lại** — dùng nút "← Quay lại" hoặc breadcrumb

### Phím tắt

| Phím tắt | Chức năng |
|:---:|---|
| `Ctrl+K` / `⌘+K` | Mở tìm kiếm |
| `Esc` | Đóng sidebar / tìm kiếm |
| `Tab` | Di chuyển giữa các phần tử |

### Tìm kiếm

Gõ tối thiểu 2 ký tự. Tìm được cả **tên chương**, **tên mục**, **mã lỗi DTC**, **triệu chứng**.

### Sơ đồ tương tác

Click vào **số thứ tự** trên sơ đồ để xem chi tiết. Dùng nút **Trước/Sau** để duyệt lần lượt các bộ phận.

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

> **Không dùng** React/Vue/Angular hay build tool (Webpack/Vite). Toàn bộ code chạy trực tiếp trên trình duyệt hỗ trợ ES Modules.

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
│   └── dtc.js             #   Danh mục + chi tiết DTC
│
├── data/                   # 📊 Nội dung (JSON)
│   ├── sections.json      #   Metadata 5 chương
│   ├── section-1.json     #   Chương 1 (5 mục)
│   ├── section-2.json     #   Chương 2 (2 mục)
│   ├── section-3.json     #   Chương 3 (6 mục)
│   ├── section-4.json     #   Chương 4 (3 mục)
│   └── dtc.json           #   12 mã lỗi DTC
│
├── styles/                 # 🎨 CSS (tách 3 tầng)
│   ├── base.css           #   Design tokens, reset, typography
│   ├── layout.css         #   Header, sidebar, app shell
│   └── components.css     #   Card, button, table, badge...
│
└── assets/images/          # 🖼️ Hình ảnh kỹ thuật
    ├── hero-u340e.png, logo-bk.png, logo-khoa.png
    └── s1/, s2/, s3/, s4/, s5/
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

Phần này là **cốt lõi về mặt sư phạm** của project: cách nội dung được tổ chức, vì sao dùng JSON, và cấu trúc dữ liệu cụ thể.

### 📚 Cấu trúc một bài học

Mỗi bài học được tổ chức thành **6 khối nội dung** theo mô hình **từ tổng quan đến chi tiết** — đúng quy trình nhận thức:

| Khối | Vai trò sư phạm |
|---|---|
| 🎯 **`intro`** | Đặt bối cảnh — "tại sao cần học phần này" |
| 📌 **`keyPoints`** | 3–5 điểm "must-know" để ôn tập nhanh |
| 🗺️ **`diagram`** | Sơ đồ tương tác — "thấy" thay vì "tưởng tượng" |
| 📘 **`explain`** | Giải thích chuyên sâu — cơ chế, lý thuyết |
| 🎬 **`stages`** | Phân đoạn quá trình — tuần tự, có hình minh họa |
| 📊 **`table` / `specs`** | Hệ thống hóa dữ liệu — bảng so sánh, thông số |

**Vì sao cấu trúc này hiệu quả?**
- **Phân lớp nhận thức**: overview trước, chi tiết sau
- **Đa phương tiện có chủ đích**: mỗi loại nội dung phục vụ một mục đích học tập
- **Dễ ôn tập**: cấu trúc cố định → biết tìm thông tin ở đâu
- **Tương thích đa trình độ**: sinh viên mới đọc `intro` + `keyPoints`; khá hơn đọc thêm `explain` + `stages`

### 🗂️ Vì sao dùng JSON?

Toàn bộ nội dung được lưu dưới dạng JSON có cấu trúc (data-driven):

- ✅ **Tách biệt mối quan tâm** — lập trình viên lo code, chuyên gia ô tô lo nội dung
- ✅ **Cập nhật không cần code** — giảng viên có thể sửa JSON trực tiếp
- ✅ **Dễ mở rộng** — thêm 1 mã DTC = thêm 1 object, UI tự render
- ✅ **Version hóa tốt** — Git track thay đổi theo dòng
- ✅ **Tái sử dụng được** — JSON có thể export sang app khác, PDF, database

### 📋 JSON Schema

**`sections.json`** — Metadata 5 chương:

```json
{
  "sections": [
    {
      "id": 1,
      "title": "Kết Cấu Hộp Số",
      "color": "#1e3a6e",
      "subsections": [
        { "id": "1.1", "title": "Kết cấu chung" }
      ],
      "dataFile": "data/section-1.json"
    }
  ]
}
```

**`section-N.json`** — Mỗi subsection có thể chứa các khối: `intro`, `keyPoints`, `diagram`, `explain`, `stages`, `table`, `specs`, `images`, `relatedDTC`.

**`dtc.json`** — 12 mã lỗi DTC:

```json
{
  "codes": [
    {
      "code": "P0715",
      "group": "P07",
      "title": "Lỗi cảm biến tốc độ đầu vào",
      "severity": "high",
      "symptom": "...",
      "possibleCauses": ["...", "..."],
      "diagnosis": [
        { "action": "...", "tool": "...", "expected": "..." }
      ],
      "relatedCodes": ["P0716"],
      "relatedSections": ["2.2"]
    }
  ]
}
```

---

## 🎓 Giá trị học tập

### Sinh viên học được gì?

Website cung cấp **4 lớp kiến thức** có hệ thống cho sinh viên Kỹ thuật Ô tô:

1. **Cơ bản** — cấu tạo, nguyên lý làm việc của hộp số U340E
2. **Ứng dụng** — quy trình tháo lắp, bảo dưỡng định kỳ
3. **Chẩn đoán** — đọc hiểu mã lỗi DTC, áp dụng quy trình khắc phục
4. **Tư duy hệ thống** — mối liên hệ giữa các bộ phận, tay số, mã lỗi (qua cross-reference `relatedDTC` / `relatedSections`)

### So với tài liệu Word/PDF

| Tiêu chí | Word/PDF | Website U340E |
|---|---|---|
| **Tìm kiếm** | Ctrl+F khớp chính xác | Search toàn cục, tìm cả mã lỗi + nội dung |
| **Điều hướng** | Cuộn trang, dễ lạc | Breadcrumb + sidebar luôn biết vị trí |
| **Sơ đồ** | Hình tĩnh | Click số → hiện chú thích tức thì |
| **Cập nhật** | Gửi file mới → tải lại | Sửa JSON → ai vào cũng thấy bản mới |
| **Liên kết chéo** | Phải nhớ số trang | Click trực tiếp sang mục/mã lỗi liên quan |
| **Truy cập** | Cần cài Office/Reader | Chỉ cần trình duyệt |
| **Ghi nhớ** | Đọc thụ động | Tương tác chủ động → nhớ lâu hơn |

### Vai trò của tương tác

> **"Một hình đáng giá ngàn chữ — một tương tác đáng giá ngàn hình."**

Sơ đồ tương tác buộc sinh viên **chủ động khám phá**. Theo nguyên tắc *active learning* trong sư phạm, não ghi nhớ thông tin được "phát hiện" tốt hơn thông tin được "trao sẵn".

→ Đây là khác biệt cốt lõi: **chuyển từ truyền đạt một chiều sang khám phá hai chiều**.

---

## 🤖 Workflow phát triển với AI

Project được phát triển với AI theo phương pháp **"AI as pair programmer"** — AI không thay thế người làm, mà phối hợp để tăng tốc và chất lượng.

### 🧠 ChatGPT — Thiết kế nội dung & tư duy sư phạm

Vai trò: giai đoạn **planning & content design** trước khi code.
- Thiết kế cấu trúc bài học (6 khối nội dung)
- Phân tích structure kỹ thuật, sắp xếp 5 chương / 19 mục hợp lý với chương trình đào tạo
- Tối ưu thứ tự kiến thức (dễ → khó, tổng quan → chi tiết)
- Soát thuật ngữ chuyên ngành ô tô

### ⚙️ Claude — Viết code & xử lý dữ liệu

Vai trò: giai đoạn **implementation & maintenance**.
- Generate module JS/CSS theo chuẩn đã định
- Chuyển đổi nội dung từ văn bản thô sang JSON theo schema
- Refactor, debug, viết documentation (README, JSDoc)

### 💡 Nguyên tắc sử dụng AI

1. **AI là trợ lý, không phải người làm chính** — mọi quyết định kiến trúc và nội dung kỹ thuật do người làm đồ án duyệt
2. **Hiểu code AI sinh ra** — không copy mù, phải đọc hiểu và có khả năng sửa đổi
3. **Kiến thức chuyên ngành là của con người** — AI viết code web, nhưng kiến thức về hộp số U340E đến từ giáo trình và tài liệu kỹ thuật
4. **Minh bạch về việc dùng AI** — ghi rõ trong README để đảm bảo trung thực học thuật

---

## 🚧 Trạng thái phát triển

### ✅ Đã hoàn thành
- Kiến trúc SPA với router & state management
- 5 chương nội dung, 12 mã lỗi DTC
- Sơ đồ tương tác với hotspot
- Tìm kiếm toàn cục
- Responsive design

### 🔄 Đang hoàn thiện
- Tinh chỉnh UI/UX
- Bổ sung hình ảnh chất lượng cao
- Chuẩn hóa nội dung kỹ thuật
- Screenshot cho README

### 🎯 Dự kiến (tùy thời gian)
- Tìm kiếm không dấu tiếng Việt
- QR code cho trang DTC detail
- Print stylesheet
- Dark mode

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

Đồ án này được thực hiện với mục đích **học thuật**. Nội dung kỹ thuật về hộp số U340E dựa trên tài liệu công khai của Toyota và các giáo trình chuyên ngành Kỹ thuật Ô tô.

---

<div align="center">

**Made with ❤️ for Automotive Engineering students**

_Nếu bạn thấy project này hữu ích, hãy để lại một ⭐ trên repository!_

</div>
