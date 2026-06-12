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
      question:
        "Hình ảnh dưới đây mô tả cấu tạo của bộ phận nào trong hộp số U340E?",
      image: "assets/images/s1/s1-3.png",
      options: [
        "Bơm dầu thủy lực",
        "Biến mô thủy lực (Torque Converter)",
        "Bộ truyền bánh răng hành tinh",
        "Cụm điều khiển dầu (Valve Body)",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.3 mô tả cấu tạo biến mô thủy lực gồm 3 phần tử bánh công tác: bánh bơm (pump impeller) nối với trục khuỷu, bánh tuabin (turbine runner) nối với trục vào hộp số, và bánh phản lực (stator) ở giữa.",
    },
    {
      question:
        "Hình ảnh dưới đây mô tả loại bơm dầu nào được sử dụng trong U340E?",
      image: "assets/images/s1/s1-7.png",
      options: [
        "Bơm cánh gạt (Vane Pump)",
        "Bơm piston hướng trục",
        "Bơm bánh răng trong (Trochoid Pump)",
        "Bơm ly tâm",
      ],
      correctIndex: 2,
      explanation:
        "Hình 1.7 mô tả bơm bánh răng trong kiểu trochoid — rotor trong ăn khớp lệch tâm với rotor ngoài. Khoảng không gian thay đổi giữa hai rotor tạo ra lực hút và đẩy dầu.",
    },
    {
      question:
        "Hình ảnh dưới đây mô tả cấu tạo của bộ phận nào trong hộp số U340E?",
      image: "assets/images/s1/s1-8.png",
      options: [
        "Biến mô thủy lực",
        "Ly hợp đa đĩa ướt",
        "Bộ truyền bánh răng hành tinh (Planetary Gear Set)",
        "Khớp một chiều (One-way Clutch)",
      ],
      correctIndex: 2,
      explanation:
        "Hình 1.8 mô tả bộ truyền bánh răng hành tinh gồm: Sun gear (mặt trời — giữa), Planet gear (hành tinh — xung quanh), Ring gear (bao — vành ngoài) và Carrier (cần dẫn — khung giữ Planet gear).",
    },
    {
      question: "Hình ảnh dưới đây mô tả cấu tạo của bộ phận nào?",
      image: "assets/images/s1/s1-13.png",
      options: [
        "Phanh dải (Band Brake)",
        "Ly hợp đa đĩa ướt (Multiple Disc Clutch)",
        "Khớp một chiều kiểu Sprag",
        "Bơm dầu thủy lực",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.13 mô tả ly hợp đa đĩa ướt — đĩa ma sát (friction disc) xen kẽ đĩa thép (steel disc). Khi pittông thủy lực ép vào, hai loại đĩa kẹp chặt lại, truyền mô-men giữa các phần tử hành tinh.",
    },
    {
      question: "Hình ảnh dưới đây mô tả loại khớp một chiều nào?",
      image: "assets/images/s1/s1-19.png",
      options: [
        "Roller Clutch (khớp con lăn)",
        "Sprag Clutch (khớp mấu chặn)",
        "Jaw Clutch (khớp hàm)",
        "Disc Clutch (khớp đĩa)",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.19 mô tả Sprag Clutch — dùng mấu chặn (sprag) hình số 8 đặt nghiêng giữa vòng trong và vòng ngoài. Chiều thuận: mấu khóa cứng; chiều ngược: mấu trượt tự do.",
    },
    {
      question: "Hình ảnh dưới đây mô tả loại khớp một chiều nào?",
      image: "assets/images/s1/s1-20.png",
      options: [
        "Sprag Clutch (khớp mấu chặn)",
        "Roller Clutch (khớp con lăn)",
        "Jaw Clutch (khớp hàm)",
        "Disc Clutch (khớp đĩa)",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.20 mô tả Roller Clutch — dùng con lăn (roller) đặt trong rãnh hình nêm. Chiều thuận: con lăn bị kẹt vào rãnh nêm, khóa cứng; chiều ngược: con lăn lăn tự do.",
    },
    {
      question:
        "Hình ảnh dưới đây cho thấy hai loại đĩa nào dùng trong bộ ly hợp U340E?",
      image: "assets/images/s1/s1-16.png",
      options: [
        "Đĩa ép và đĩa phân phối lực",
        "Đĩa ma sát và đĩa thép",
        "Đĩa chủ động và đĩa bị động",
        "Đĩa điều khiển và đĩa truyền lực",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.16 cho thấy đĩa ma sát (friction disc — có lớp ma sát hai mặt) và đĩa thép (steel disc — mặt nhẵn). Hai loại đĩa xen kẽ nhau tạo thành gói ly hợp đa đĩa ướt.",
    },
    {
      question: "Hình ảnh dưới đây mô tả bộ phận nào trong hộp số U340E?",
      image: "assets/images/s1/s1-17.png",
      options: [
        "Ly hợp đa đĩa ướt",
        "Phanh (Brake) trong hộp số",
        "Biến mô thủy lực",
        "Bộ bánh răng hành tinh",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.17 mô tả phanh trong hộp số U340E. Cấu tạo tương tự ly hợp đa đĩa nhưng đĩa ngoài được cố định với vỏ hộp số — khi đóng, nó giữ cứng một phần tử hành tinh để tạo tỉ số truyền.",
    },
    {
      question:
        "Hình ảnh dưới đây cho thấy bố trí tổng thể của các bộ phận nào trong U340E?",
      image: "assets/images/s1/s1-12.png",
      options: [
        "Các cảm biến và van điện từ (solenoid)",
        "Vị trí các ly hợp (C1–C4) và phanh (B1–B2)",
        "Bộ truyền bánh răng hành tinh và biến mô",
        "Hệ thống dầu bôi trơn và làm mát",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.12 thể hiện vị trí bố trí của các ly hợp C1, C2, C3, C4 và phanh B1, B2 bên trong hộp số U340E, mỗi bộ phận gắn liền với phần tử hành tinh tương ứng.",
    },
    {
      question:
        "Hình ảnh dưới đây mô tả sơ đồ chi tiết bộ phận nào trong hộp số?",
      image: "assets/images/s1/s1-9.png",
      options: [
        "Biến mô thủy lực (3 phần tử bánh công tác)",
        "Bộ bánh răng hành tinh — phân biệt rõ Sun / Planet / Ring / Carrier",
        "Cụm van điều khiển thủy lực (Valve Body)",
        "Ly hợp đa đĩa và phanh đĩa",
      ],
      correctIndex: 1,
      explanation:
        "Hình 1.9 mô tả sơ đồ chi tiết bộ truyền bánh răng hành tinh: Sun gear (mặt trời — trung tâm), Planet gear (hành tinh — ăn khớp giữa), Ring gear (bao — vành ngoài) và Carrier (cần dẫn — khung giữ Planet gear).",
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
      question:
        "Trước khi lắp ráp các chi tiết hộp số, kỹ thuật viên cần bôi gì lên các bề mặt làm việc?",
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
      question:
        "Sau khi lắp xong hộp số và đổ dầu, kiểm tra mức dầu ATF đúng phải thực hiện trong điều kiện nào?",
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
      question:
        "Khi tay số ở vị trí D (Drive), hộp số U340E tự động chọn số nào để khởi hành?",
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
      question:
        "Áp suất dầu chính (line pressure) trong U340E thường nằm trong khoảng nào?",
      options: ["1-2 bar", "4-15 bar", "20-30 bar", "50-100 bar"],
      correctIndex: 1,
      explanation:
        "Line pressure của U340E thường nằm trong khoảng 4-15 bar tùy theo tải động cơ và tay số. Áp suất này được tạo bởi bơm dầu và điều chỉnh ổn định bởi van điều áp sơ cấp (Primary Regulator Valve).",
    },
    {
      question:
        "Trong U340E, valve body (cụm điều khiển dầu) chứa các loại van nào?",
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
      question:
        "ECU động cơ trong U340E nhận tín hiệu vị trí cần số từ cảm biến nào?",
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
      options: ["40-60°C", "80-95°C", "120-140°C", "150-180°C"],
      correctIndex: 1,
      explanation:
        "Nhiệt độ làm việc bình thường của dầu ATF nằm trong khoảng 80-95°C. Trên 110°C bắt đầu cảnh báo, trên 120°C là nguy hiểm vì dầu sẽ oxy hóa nhanh và xuống cấp. Nhiệt độ này được theo dõi bằng cảm biến TFT (Transmission Fluid Temperature).",
    },
    {
      question:
        "Lock-up Clutch (ly hợp khóa biến mô) trong U340E được điều khiển bởi solenoid nào?",
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
      question:
        "Khi hộp số U340E vào chế độ fail-safe (limp home), nó thường kẹt ở tay số nào?",
      options: ["Số 1", "Số 2", "Số 3", "Số 4 (OD)"],
      correctIndex: 2,
      explanation:
        "Khi phát hiện lỗi nghiêm trọng, U340E vào fail-safe mode và kẹt ở số 3. Lý do chọn số 3: tỉ số truyền 1:1 nên xe vẫn chạy được ở mọi tốc độ (~20-100 km/h), đủ an toàn để tài xế lái về garage mà không gây hỏng thêm.",
    },
    {
      question:
        "Khi xe có triệu chứng 'không vào được số nào, kẹt ở chế độ N', nguyên nhân có thể là?",
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
      question:
        "Loại dầu ATF chính hãng được Toyota khuyến cáo cho hộp số U340E là?",
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
