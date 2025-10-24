export interface QAPair {
  question: {
    en: string;
    vi: string;
  };
  answer: {
    en: string;
    vi: string;
  };
  citation: {
    en: string;
    vi: string;
  };
}

export const qaData: QAPair[] = [
  {
    question: {
      en: "What is AWD method?",
      vi: "Phương pháp AWD là gì?"
    },
    answer: {
      en: "AWD (Alternate Wetting and Drying) is a water-saving irrigation technique for rice cultivation. Instead of keeping the field continuously flooded, you allow the water to dry out periodically before re-irrigating. This method can reduce water use by 15-30% while maintaining or even increasing yields. The field should be drained when water is 15cm below the soil surface, then re-irrigated when cracks appear.",
      vi: "AWD (Luân phiên Ngập Khô) là kỹ thuật tưới tiết kiệm nước cho canh tác lúa. Thay vì giữ ruộng ngập nước liên tục, bạn để nước khô theo chu kỳ trước khi tưới lại. Phương pháp này có thể giảm 15-30% lượng nước sử dụng trong khi vẫn duy trì hoặc tăng năng suất. Ruộng nên được thoát nước khi mực nước thấp hơn mặt đất 15cm, sau đó tưới lại khi xuất hiện vết nứt."
    },
    citation: {
      en: "(Source: IRRI Water Management Guidelines, 2024)",
      vi: "(Nguồn: Hướng dẫn Quản lý Nước IRRI, 2024)"
    }
  },
  {
    question: {
      en: "How do I control brown planthoppers?",
      vi: "Làm thế nào để kiểm soát rầy nâu?"
    },
    answer: {
      en: "Brown planthopper (BPH) control requires integrated pest management: 1) Use resistant varieties like IR64 or IR36, 2) Avoid excessive nitrogen fertilizer which attracts BPH, 3) Maintain proper plant spacing for air circulation, 4) Use light traps to monitor populations, 5) Apply neem-based pesticides or imidacloprid when populations exceed 5 per hill. Natural enemies like spiders should be preserved.",
      vi: "Kiểm soát rầy nâu cần quản lý dịch hại tổng hợp: 1) Sử dụng giống kháng như IR64 hoặc IR36, 2) Tránh bón quá nhiều phân đạm vì thu hút rầy nâu, 3) Duy trì khoảng cách trồng hợp lý để không khí lưu thông, 4) Sử dụng bẫy đèn để theo dõi mật độ, 5) Phun thuốc gốc neem hoặc imidacloprid khi mật độ >5 con/bụi. Cần bảo vệ thiên địch như nhện."
    },
    citation: {
      en: "(Source: Handbook on Technical Guidelines for Rice Integrated Pest Management in the Mekong Delta, 2024)",
      vi: "(Nguồn: Sổ tay Hướng dẫn Kỹ thuật Quản lý Dịch hại Tổng hợp Lúa ở Đồng bằng Sông Cửu Long, 2024)"
    }
  },
  {
    question: {
      en: "When should I apply fertilizer?",
      vi: "Khi nào tôi nên bón phân?"
    },
    answer: {
      en: "Rice fertilizer application follows this schedule: 1) Basal application: 50% of N + all P and K at transplanting, 2) Mid-tillering (15-20 days after transplanting): 25% of N, 3) Panicle initiation (35-40 days): 25% of N. For a typical crop, use 80-100 kg N/ha, 40-60 kg P₂O₅/ha, and 40-60 kg K₂O/ha. Adjust based on soil testing.",
      vi: "Lịch bón phân cho lúa: 1) Bón lót: 50% N + toàn bộ P và K khi cấy, 2) Đẻ nhánh (15-20 ngày sau cấy): 25% N, 3) Làm đòng (35-40 ngày): 25% N. Cho vụ thông thường, dùng 80-100 kg N/ha, 40-60 kg P₂O₅/ha, và 40-60 kg K₂O/ha. Điều chỉnh theo kết quả phân tích đất."
    },
    citation: {
      en: "(Source: Vietnamese Ministry of Agriculture and Rural Development, Rice Production Guidelines, 2023)",
      vi: "(Nguồn: Bộ Nông nghiệp và Phát triển Nông thôn Việt Nam, Hướng dẫn Sản xuất Lúa, 2023)"
    }
  },
  {
    question: {
      en: "What causes leaf blast disease?",
      vi: "Nguyên nhân gây bệnh đạo ôn lá?"
    },
    answer: {
      en: "Leaf blast is caused by the fungus Magnaporthe oryzae. It appears as diamond-shaped lesions with gray centers and brown margins on leaves. Favorable conditions include high humidity (>90%), temperatures of 25-28°C, and excessive nitrogen fertilization. Control measures include: using resistant varieties, balanced fertilization, proper spacing, and fungicide applications (tricyclazole or azoxystrobin) when disease first appears.",
      vi: "Bệnh đạo ôn lá do nấm Magnaporthe oryzae gây ra. Triệu chứng là các vết bệnh hình thoi có tâm xám, viền nâu trên lá. Điều kiện thuận lợi: độ ẩm cao (>90%), nhiệt độ 25-28°C, và bón quá nhiều đạm. Biện pháp phòng trừ: dùng giống kháng bệnh, bón phân cân đối, giãn cách hợp lý, và phun thuốc (tricyclazole hoặc azoxystrobin) ngay khi phát hiện bệnh."
    },
    citation: {
      en: "(Source: Plant Protection Department Guidelines, 2024)",
      vi: "(Nguồn: Hướng dẫn Cục Bảo vệ Thực vật, 2024)"
    }
  },
  {
    question: {
      en: "How much water does rice need?",
      vi: "Lúa cần bao nhiêu nước?"
    },
    answer: {
      en: "Rice requires approximately 1,200-2,000 mm of water per season depending on climate and soil type. Daily water requirement is 5-10 mm. During critical growth stages (tillering, flowering, grain filling), maintain 5-10 cm water depth. With AWD method, you can reduce total water use by 15-30%. Clay soils retain water better than sandy soils, requiring less frequent irrigation.",
      vi: "Lúa cần khoảng 1.200-2.000 mm nước mỗi vụ tùy theo khí hậu và loại đất. Nhu cầu nước hàng ngày là 5-10 mm. Trong giai đoạn sinh trưởng quan trọng (đẻ nhánh, trổ, chắc xanh), duy trì mực nước 5-10 cm. Với phương pháp AWD, bạn có thể giảm 15-30% tổng lượng nước. Đất sét giữ nước tốt hơn đất cát, cần tưới ít thường xuyên hơn."
    },
    citation: {
      en: "(Source: IRRI Water Management Manual, 2024)",
      vi: "(Nguồn: Sổ tay Quản lý Nước IRRI, 2024)"
    }
  },
  {
    question: {
      en: "What is the best sowing date in Mekong Delta?",
      vi: "Thời vụ gieo sạ tốt nhất ở Đồng bằng Sông Cửu Long?"
    },
    answer: {
      en: "In the Mekong Delta, there are three main rice seasons: 1) Winter-Spring (November-December sowing, April harvest), 2) Summer-Autumn (March-April sowing, July harvest), 3) Autumn-Winter (June-July sowing, October-November harvest). Winter-Spring has highest yields but requires more pest management. Choose based on water availability, market prices, and farm schedule.",
      vi: "Ở Đồng bằng Sông Cửu Long có ba vụ lúa chính: 1) Đông Xuân (gieo tháng 11-12, thu tháng 4), 2) Hè Thu (gieo tháng 3-4, thu tháng 7), 3) Thu Đông (gieo tháng 6-7, thu tháng 10-11). Đông Xuân có năng suất cao nhất nhưng cần quản lý sâu bệnh nhiều hơn. Chọn vụ dựa vào nguồn nước, giá thị trường, và lịch trình trang trại."
    },
    citation: {
      en: "(Source: Cuu Long Delta Rice Research Institute, 2024)",
      vi: "(Nguồn: Viện Nghiên cứu Lúa Đồng bằng Sông Cửu Long, 2024)"
    }
  }
];
