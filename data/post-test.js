/**
 * data/post-test.js — Bài kiểm tra sau khi học (post-test)
 * =========================================================
 *
 * 25 câu trắc nghiệm chia đều 5 bài × 5 câu mỗi bài.
 * Cùng phong cách kiến thức thuần như pre-test (lessonOutcomes[N].quiz)
 * nhưng hỏi các nội dung KHÁC để tránh trùng lặp.
 *
 * Cấu trúc mỗi câu:
 *   { question, options[], correctIndex, explanation }
 */

export const postTest = {
  // ═══════════════════════════════════════════════════════════════
  // BÀI 1 — KẾT CẤU HỘP SỐ
  // ═══════════════════════════════════════════════════════════════
  1: [
    {
      question: "Vỏ hộp số U340E được chia thành mấy khoang chức năng?",
      options: ["2 khoang", "3 khoang", "4 khoang", "5 khoang"],
      correctIndex: 1,
      explanation:
        "Vỏ hộp số U340E được chia thành 3 khoang chức năng riêng biệt: khoang biến mô – bơm dầu, khoang bộ truyền hành tinh, và khoang cụm điều khiển dầu (Valve Body). Cách chia này giúp dễ tản nhiệt và bảo trì.",
    },
    {
      question: "Biến mô thủy lực của U340E truyền mô-men xoắn bằng phương tiện nào?",
      options: [
        "Cơ khí trực tiếp qua bánh răng",
        "Dòng dầu ATF tuần hoàn giữa các bánh công tác",
        "Lực điện từ",
        "Dây đai truyền động",
      ],
      correctIndex: 1,
      explanation:
        "Biến mô thủy lực truyền mô-men từ động cơ sang hộp số thông qua dòng dầu ATF tuần hoàn giữa bánh bơm (gắn với động cơ) và bánh tuabin (gắn với trục vào hộp số). Stator ở giữa giúp khuếch đại mô-men ở tốc độ thấp.",
    },
    {
      question: "Bơm dầu thủy lực của U340E sử dụng loại bơm gì?",
      options: [
        "Bơm piston hướng trục",
        "Bơm cánh gạt",
        "Bơm bánh răng trong (trochoid pump)",
        "Bơm ly tâm",
      ],
      correctIndex: 2,
      explanation:
        "U340E dùng bơm bánh răng trong loại trochoid — gồm rotor trong (bánh răng chủ động) ăn khớp với rotor ngoài có số răng nhiều hơn 1. Loại bơm này nhỏ gọn, độ ồn thấp, hiệu suất cao và phù hợp lưu lượng/áp suất cần thiết cho hộp số tự động.",
    },
    {
      question: "Bơm dầu của U340E được dẫn động trực tiếp từ đâu?",
      options: [
        "Trục cam động cơ",
        "Trục đầu ra hộp số",
        "Vỏ biến mô (nối với trục khuỷu động cơ)",
        "Motor điện riêng",
      ],
      correctIndex: 2,
      explanation:
        "Bơm dầu U340E được dẫn động trực tiếp từ vỏ biến mô — vốn nối với trục khuỷu động cơ. Vì vậy bơm chỉ hoạt động khi động cơ nổ máy. Đây là lý do xe AT không thể tự nổ bằng cách đẩy/kéo như xe MT.",
    },
    {
      question: "Mặt trời (Sun gear) trong bộ truyền bánh răng hành tinh là chi tiết nào?",
      options: [
        "Bánh răng ngoài cùng có răng trong",
        "Bánh răng ở giữa trung tâm",
        "Khung mang các bánh răng hành tinh",
        "Khớp một chiều giữ bánh răng",
      ],
      correctIndex: 1,
      explanation:
        "Bộ truyền hành tinh gồm 3 phần tử: Sun gear (mặt trời) ở giữa trung tâm, Ring gear (bao) là bánh răng ngoài cùng có răng trong, và Carrier (cần dẫn) là khung mang 3-4 bánh răng hành tinh ăn khớp giữa Sun và Ring.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // BÀI 2 — QUY TRÌNH THÁO LẮP
  // ═══════════════════════════════════════════════════════════════
  2: [
    {
      question: "Dung tích dầu ATF của hộp số U340E khoảng bao nhiêu lít?",
      options: ["3.5 lít", "5.0 lít", "6.9 lít", "9.5 lít"],
      correctIndex: 2,
      explanation:
        "Hộp số U340E chứa khoảng 6.9 lít dầu ATF (bao gồm cả dầu trong biến mô). Đây là lý do phải xả dầu trước khi tháo hộp số khỏi xe để tránh chảy lan và giảm trọng lượng khi nhấc xuống.",
    },
    {
      question: "Quy trình lắp hộp số U340E gồm bao nhiêu bước?",
      options: ["18 bước", "22 bước", "26 bước", "32 bước"],
      correctIndex: 2,
      explanation:
        "Quy trình lắp hộp số U340E gồm 26 bước, thực hiện theo thứ tự ngược với quy trình tháo (22 bước). Khác biệt do khi lắp cần thêm các bước kiểm tra trung gian (đo khe hở, kiểm tra rò rỉ, thử áp suất...).",
    },
    {
      question: "Khi lắp U340E, thứ tự lắp các cụm theo nguyên tắc nào?",
      options: [
        "Từ ngoài vào trong",
        "Từ trong ra ngoài",
        "Từ trên xuống dưới",
        "Từ nhẹ đến nặng",
      ],
      correctIndex: 1,
      explanation:
        "Lắp hộp số U340E theo nguyên tắc 'từ trong ra ngoài': bắt đầu với bánh răng bị động và các phanh (B3, B2, B1) ở phần sâu nhất, sau đó đến các bộ truyền hành tinh, ly hợp, cuối cùng là vỏ — cụm điều khiển dầu — lọc nhớt.",
    },
    {
      question: "Trước khi lắp ráp các chi tiết hộp số, kỹ thuật viên cần bôi gì lên các bề mặt làm việc?",
      options: [
        "Mỡ chịu nhiệt độ cao",
        "Dầu ATF mới (chính loại dầu sẽ dùng)",
        "Dầu động cơ",
        "Vaseline kỹ thuật",
      ],
      correctIndex: 1,
      explanation:
        "Tất cả các bề mặt làm việc và phớt làm kín phải được bôi dầu ATF mới (đúng loại sẽ đổ vào hộp số) trước khi lắp. Điều này tránh ma sát khô khi mới khởi động, đồng thời giúp phớt không bị rách hoặc xoắn khi đẩy biến mô vào vị trí.",
    },
    {
      question: "Sau khi lắp xong hộp số và đổ dầu, kiểm tra mức dầu ATF đúng phải thực hiện trong điều kiện nào?",
      options: [
        "Xe nguội, động cơ tắt, cần số ở P",
        "Xe ở nhiệt độ làm việc, động cơ chạy ralenti, cần số ở P, đã gạt qua các vị trí số",
        "Xe đang chạy, đo bằng máy chẩn đoán",
        "Xe đỗ trên dốc, động cơ tắt",
      ],
      correctIndex: 1,
      explanation:
        "Phải kiểm tra mức dầu ATF ở điều kiện: xe nóng đạt nhiệt độ làm việc (~70-80°C), động cơ chạy ralenti, cần số ở P, đã gạt qua tất cả các vị trí số mỗi vị trí dừng 2-3 giây để đẩy dầu vào tất cả các đường dầu và xi-lanh. Nếu đo lúc dầu chưa lưu thông đầy đủ, mức dầu sẽ sai (cao giả tạo).",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // BÀI 3 — NGUYÊN LÝ LÀM VIỆC
  // ═══════════════════════════════════════════════════════════════
  3: [
    {
      question: "Tỉ số truyền số 1 (D-1) của U340E xấp xỉ bao nhiêu?",
      options: ["1.000:1", "1.552:1", "2.847:1", "3.600:1"],
      correctIndex: 2,
      explanation:
        "Tỉ số truyền số 1 của U340E khoảng 2.847:1 — nghĩa là động cơ quay 2.847 vòng thì đầu ra hộp số quay 1 vòng. Đây là tỉ số khuếch đại mô-men lớn nhất, dùng cho khởi hành và leo dốc.",
    },
    {
      question: "Để vào số 2 trong U340E, phần tử nào đóng (so với số 1)?",
      options: [
        "Thêm ly hợp C2",
        "Thêm phanh B1",
        "Thêm khớp F1",
        "Thêm phanh B3",
      ],
      correctIndex: 1,
      explanation:
        "Số 2 (D-2) của U340E hoạt động với C1 (đã đóng từ số 1) + thêm phanh B1 giữ bánh răng mặt trời của bộ hành tinh sau. Kết hợp này tạo ra tỉ số truyền 1.552:1 — vừa đủ để chuyển tiếp từ số 1 sang số 3.",
    },
    {
      question: "Số 3 (D-3) của U340E là loại số truyền gì?",
      options: [
        "Số khuếch đại mô-men mạnh",
        "Số truyền trực tiếp (tỉ số ≈ 1:1)",
        "Số truyền tăng (overdrive)",
        "Số trung gian không tải",
      ],
      correctIndex: 1,
      explanation:
        "Số 3 (D-3) của U340E là số truyền gần trực tiếp với tỉ số 1.000:1 — động cơ và đầu ra quay cùng tốc độ. Hiệu suất truyền lực cao nhất, thường dùng cho chạy đường trung bình 40-80 km/h.",
    },
    {
      question: "Tỉ số truyền số lùi (R) của U340E xấp xỉ bao nhiêu?",
      options: ["1.000:1", "2.343:1", "0.705:1", "3.600:1"],
      correctIndex: 1,
      explanation:
        "Số lùi (R) của U340E có tỉ số khoảng 2.343:1, dấu âm (đảo chiều). Tỉ số này nhỏ hơn số 1 vì khi lùi không cần khuếch đại mô-men nhiều như khởi hành tiến, nhưng vẫn cần đủ để leo dốc nhẹ khi lùi.",
    },
    {
      question: "Khi tay số ở vị trí D (Drive), hộp số U340E tự động chọn số nào để khởi hành?",
      options: [
        "Luôn bắt đầu ở số 4 (OD)",
        "Luôn bắt đầu ở số 1, sau đó tăng dần theo tốc độ",
        "Luôn bắt đầu ở số 2 để êm ái",
        "Tự chọn ngẫu nhiên dựa vào tải",
      ],
      correctIndex: 1,
      explanation:
        "Ở vị trí D, hộp số U340E luôn bắt đầu ở số 1 khi xe đứng yên. Khi tăng tốc, ECU tự động tăng lần lượt qua 1→2→3→4 (OD) dựa trên tốc độ xe, độ mở bướm ga, và tốc độ động cơ. Khi giảm tốc thì giảm số theo chiều ngược lại.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // BÀI 4 — ĐIỀU KHIỂN & THỦY LỰC
  // ═══════════════════════════════════════════════════════════════
  4: [
    {
      question: "Áp suất dầu chính (line pressure) trong U340E thường nằm trong khoảng nào?",
      options: ["1-2 bar", "4-15 bar", "20-30 bar", "50-100 bar"],
      correctIndex: 1,
      explanation:
        "Line pressure của U340E thường nằm trong khoảng 4-15 bar tùy theo tải động cơ và tay số. Áp suất này được tạo bởi bơm dầu và điều chỉnh ổn định bởi van điều áp sơ cấp (Primary Regulator Valve).",
    },
    {
      question: "Trong U340E, valve body (cụm điều khiển dầu) chứa các loại van nào?",
      options: [
        "Chỉ van solenoid điện từ",
        "Chỉ van bi cơ khí",
        "Cả van con (spool valve) cơ khí và van solenoid điện từ",
        "Van piston dạng pittông",
      ],
      correctIndex: 2,
      explanation:
        "Valve Body của U340E chứa cả 2 loại van: (1) van con (spool valve) cơ khí — di chuyển nhờ áp suất dầu cân bằng giữa hai đầu, (2) van solenoid điện từ — đóng/mở bằng tín hiệu điện từ ECU. Hai loại van phối hợp tạo nên hệ thống điều khiển thủy lực-điện tử lai.",
    },
    {
      question: "ECU động cơ trong U340E nhận tín hiệu vị trí cần số từ cảm biến nào?",
      options: [
        "Cảm biến tốc độ đầu vào",
        "Công tắc vị trí cần số (Park/Neutral Switch hoặc Range Switch)",
        "Cảm biến áp suất dầu",
        "Cảm biến nhiệt độ ATF",
      ],
      correctIndex: 1,
      explanation:
        "Cần số có công tắc Range Switch (hoặc Park/Neutral Switch) đặt ở cụm chuyển số ngoài hộp số. Công tắc này gửi tín hiệu rời rạc về ECU cho biết tài xế đang chọn P, R, N, D, 3, 2 hay L — từ đó ECU biết phải điều khiển solenoid ra sao.",
    },
    {
      question: "Nhiệt độ làm việc bình thường của dầu ATF trong U340E là?",
      options: [
        "40-60°C",
        "80-95°C",
        "120-140°C",
        "150-180°C",
      ],
      correctIndex: 1,
      explanation:
        "Nhiệt độ làm việc bình thường của dầu ATF nằm trong khoảng 80-95°C. Trên 110°C bắt đầu cảnh báo, trên 120°C là nguy hiểm vì dầu sẽ oxy hóa nhanh và xuống cấp. Nhiệt độ này được theo dõi bằng cảm biến TFT (Transmission Fluid Temperature).",
    },
    {
      question: "Lock-up Clutch (ly hợp khóa biến mô) trong U340E được điều khiển bởi solenoid nào?",
      options: [
        "S1 (Shift Solenoid 1)",
        "S2 (Shift Solenoid 2)",
        "SL hoặc SLU (Lock-up Solenoid)",
        "SLT (Linear Throttle Solenoid)",
      ],
      correctIndex: 2,
      explanation:
        "Lock-up Clutch của biến mô được điều khiển bởi solenoid SL (hoặc SLU trong một số phiên bản) — viết tắt của Solenoid Lock-up. Khi xe chạy ổn định ở tốc độ cao, ECU bật solenoid này để khóa cứng biến mô, loại bỏ độ trượt 4-7% và tiết kiệm nhiên liệu.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // BÀI 5 — CHẨN ĐOÁN & BẢO DƯỠNG
  // ═══════════════════════════════════════════════════════════════
  5: [
    {
      question: "Mã DTC P0705 trên hộp số U340E báo lỗi gì?",
      options: [
        "Lỗi solenoid sang số",
        "Lỗi mạch cảm biến vị trí cần số (Range Sensor)",
        "Lỗi nhiệt độ dầu cao",
        "Lỗi áp suất dầu thấp",
      ],
      correctIndex: 1,
      explanation:
        "P0705 là mã DTC tiêu chuẩn báo lỗi mạch cảm biến vị trí cần số (Transmission Range Sensor). Nguyên nhân thường do công tắc hỏng, dây dẫn đứt/chập, hoặc giắc cắm oxy hóa. Khi có lỗi này, ECU không xác định được tay số đang chọn.",
    },
    {
      question: "Mã DTC P0720 trên hộp số U340E báo lỗi gì?",
      options: [
        "Lỗi mạch cảm biến tốc độ đầu ra (Output Speed Sensor)",
        "Lỗi mạch cảm biến tốc độ đầu vào (Input Speed Sensor)",
        "Lỗi solenoid lock-up",
        "Lỗi nhiệt độ ATF",
      ],
      correctIndex: 0,
      explanation:
        "P0720 báo lỗi mạch cảm biến tốc độ đầu ra hộp số (Output Speed Sensor — OSS). Khi mất tín hiệu này, ECU không biết tốc độ xe nên không thể quyết định thời điểm sang số → hộp số sẽ vào fail-safe mode (kẹt số 3).",
    },
    {
      question: "Khi hộp số U340E vào chế độ fail-safe (limp home), nó thường kẹt ở tay số nào?",
      options: ["Số 1", "Số 2", "Số 3", "Số 4 (OD)"],
      correctIndex: 2,
      explanation:
        "Khi phát hiện lỗi nghiêm trọng, U340E vào fail-safe mode và kẹt ở số 3. Lý do chọn số 3: tỉ số truyền 1:1 nên xe vẫn chạy được ở mọi tốc độ (~20-100 km/h), đủ an toàn để tài xế lái về garage mà không gây hỏng thêm.",
    },
    {
      question: "Khi xe có triệu chứng 'không vào được số nào, kẹt ở chế độ N', nguyên nhân có thể là?",
      options: [
        "Hết dầu ATF hoặc áp suất line pressure quá thấp",
        "Cảm biến nhiệt độ hỏng",
        "Đèn check engine bị cháy bóng",
        "Ắc-quy yếu",
      ],
      correctIndex: 0,
      explanation:
        "Triệu chứng 'kẹt N' (không truyền lực ở bất kỳ tay số nào) thường do hết dầu ATF, line pressure quá thấp (bơm hỏng/lưới lọc tắc), hoặc van điều áp chính kẹt mở. Bước đầu kiểm tra: mức dầu ATF, sau đó đo áp suất dầu chính bằng đồng hồ.",
    },
    {
      question: "Loại dầu ATF chính hãng được Toyota khuyến cáo cho hộp số U340E là?",
      options: [
        "Toyota ATF Type T-IV (hoặc tương đương WS)",
        "Dầu động cơ 5W-30",
        "Dầu phanh DOT 4",
        "Dầu hộp số sàn SAE 75W-90",
      ],
      correctIndex: 0,
      explanation:
        "Toyota khuyến cáo dùng dầu ATF Type T-IV (hoặc Toyota WS — World Standard cho các mẫu mới hơn) cho hộp số U340E. Tuyệt đối không dùng dầu động cơ, dầu phanh hay dầu hộp số sàn vì các đặc tính ma sát, độ nhớt khác nhau hoàn toàn — sẽ gây hỏng ly hợp ngay lập tức.",
    },
  ],
};
