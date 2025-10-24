/**
 * IRRI Rice Handbook Chat Flows
 * Source: IRRI Rice Handbook (CGSpace)
 * URL: https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5
 */

export interface Citation {
  label: {
    en: string;
    vi: string;
  };
  url: string;
  excerpt: {
    en: string;
    vi: string;
  };
}

export interface FlowMessage {
  role: "user" | "assistant";
  text_en: string;
  text_vi: string;
  citations: Citation[];
}

export interface ChatFlow {
  id: string;
  title: string;
  topic: string[];
  messages: FlowMessage[];
}

export interface IRRIChatFlowsData {
  version: string;
  source: string;
  source_url: string;
  generated_at: string;
  flows: ChatFlow[];
}

export const irriChatFlows: IRRIChatFlowsData = {
  version: "1.1",
  source: "IRRI Rice Handbook (CGSpace)",
  source_url:
    "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
  generated_at: "2025-10-13T18:53:01.329041+05:30",
  flows: [
    {
      id: "flow_land_01",
      title:
        "Land preparation & seeding basics – Làm đất & gieo sạ cơ bản",
      topic: ["land", "seeding", "preparation"],
      messages: [
        {
          role: "user",
          text_en:
            "Do I really need laser land leveling? What's the benefit for me?",
          text_vi:
            "Có cần thiết phải san phẳng laser không? Lợi ích cụ thể là gì?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Laser leveling keeps field difference ≤5 cm, giving more uniform water, seed, and fertilizer use, and it supports mechanization. That means better emergence, fewer patches, and easier AWD.",
          text_vi:
            "San phẳng laser giúp độ chênh mặt ruộng ≤5 cm, tưới tiêu, gieo giống và bón phân đều hơn, thuận lợi cơ giới hóa. Nhờ đó mạ lên đều, ít chỗ lồi lõm và áp dụng AWD dễ hơn.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Laser land leveling improves water distribution, seed germination uniformity, and enables mechanization.",
                vi: "San phẳng laser cải thiện phân bổ nước, độ đồng đều nảy mầm và thuận lợi cơ giới hóa.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "How long before direct seeding should I drain water after land prep?",
          text_vi:
            "Sau khi làm đất, tôi nên rút nước trước gieo sạ bao lâu?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Drain 6–12 hours before seeding (ideally overnight and sow the next day). The surface should be moist, not flooded, for good germination.",
          text_vi:
            "Rút nước trước gieo 6–12 giờ (tốt nhất rút qua đêm, hôm sau sạ). Mặt ruộng ẩm nhưng không ngập sẽ giúp hạt nảy mầm tốt.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Proper drainage timing before seeding ensures optimal moisture for germination without waterlogging.",
                vi: "Thời gian rút nước phù hợp trước gieo đảm bảo độ ẩm tối ưu cho nảy mầm mà không bị úng.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "What's the maximum seed rate I should use with mechanized seeding?",
          text_vi:
            "Khi gieo sạ cơ giới, lượng giống tối đa nên dùng là bao nhiêu?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Keep seed ≤70 kg/ha for row or cluster seeding to save seed, maintain strong plants, and reduce pest pressure.",
          text_vi:
            "Giữ lượng giống ≤70 kg/ha đối với sạ hàng hoặc sạ cụm để tiết kiệm giống, cây khỏe và giảm áp lực sâu bệnh.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Optimal seeding rates reduce seed costs while ensuring strong, healthy plant stands.",
                vi: "Lượng giống tối ưu giảm chi phí giống đồng thời đảm bảo quần thể cây khỏe mạnh.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "What capacity can a 6‑row pneumatic seeder cover in a day?",
          text_vi:
            "Máy sạ khí động 6 hàng một ngày sạ được bao nhiêu?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "About 3 ha/day under normal conditions with uniform distribution and seed saving.",
          text_vi:
            "Khoảng 3 ha/ngày trong điều kiện bình thường, gieo đều và tiết kiệm giống.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Mechanized seeders improve efficiency and coverage while maintaining seed placement accuracy.",
                vi: "Máy gieo cơ giới cải thiện hiệu quả và diện tích phủ đồng thời duy trì độ chính xác đặt hạt.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "Is wide–narrow row pattern better than even spacing?",
          text_vi:
            "Sạ hàng rộng–hẹp có lợi gì so với khoảng cách đều?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Wide–narrow rows improve light capture and airflow, giving stronger plants and fewer pests. A common pattern is one 35 cm wide row alternating with two 15 cm narrow rows.",
          text_vi:
            "Hàng rộng–hẹp giúp đón ánh sáng và thông thoáng tốt hơn, cây khỏe và ít sâu bệnh. Mẫu phổ biến là 1 hàng rộng 35 cm xen 2 hàng hẹp 15 cm.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Wide-narrow row patterns optimize light interception and air circulation for healthier crops.",
                vi: "Mô hình hàng rộng-hẹp tối ưu hóa hấp thụ ánh sáng và lưu thông không khí cho cây trồng khỏe mạnh hơn.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "flow_water_fert_02",
      title:
        "Watering (AWD) & fertilizer plan – Quản lý nước (AWD) & bón phân",
      topic: ["water", "AWD", "fertilizer"],
      messages: [
        {
          role: "user",
          text_en:
            "When do I start AWD and how do I know when to irrigate?",
          text_vi:
            "Bắt đầu AWD khi nào và làm sao biết lúc cần tưới?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "After 7–10 days from seeding, let water recede until hairline cracks appear or a field tube shows −10 to −15 cm, then re‑flood to ~3–5 cm.",
          text_vi:
            "Sau 7–10 ngày sau sạ, để nước rút đến khi thấy nứt chân chim hoặc ống đo mực nước báo −10 đến −15 cm, rồi bơm nước lại khoảng 3–5 cm.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "AWD starts after establishment; monitor water levels and re-irrigate at −10 to −15 cm depth.",
                vi: "AWD bắt đầu sau khi cây hồi xanh; theo dõi mực nước và tưới lại khi độ sâu −10 đến −15 cm.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "In the first week after sowing, should the field be flooded?",
          text_vi:
            "Tuần đầu sau sạ có cần giữ ruộng ngập không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "No. Keep the field just moist during 1–7 DAS; young seedlings need oxygen for good rooting.",
          text_vi:
            "Không. Giai đoạn 1–7 NSS chỉ giữ ẩm; lúa non cần oxy để ra rễ tốt.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Early stage seedlings require moist soil, not flooding, to establish strong root systems.",
                vi: "Giai đoạn đầu cây con cần đất ẩm, không ngập, để phát triển hệ rễ mạnh.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "What total N‑P‑K do I target on alluvial soil?",
          text_vi:
            "Tổng N‑P‑K khuyến cáo trên đất phù sa là bao nhiêu?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "About 90–100 kg N, 30–40 kg P₂O₅, and 30–40 kg K₂O per hectare, split across key stages.",
          text_vi:
            "Khoảng 90–100 kg N, 30–40 kg P₂O₅ và 30–40 kg K₂O/ha, bón chia theo các giai đoạn chính.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Recommended NPK rates for alluvial soils balance crop needs with soil fertility status.",
                vi: "Liều lượng NPK khuyến cáo cho đất phù sa cân bằng nhu cầu cây trồng với độ phì đất.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "How should I adjust N in Summer–Autumn compared with Winter–Spring?",
          text_vi:
            "Vụ Hè–Thu có cần giảm đạm so với Đông–Xuân không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Reduce N by about 15–20% in Summer–Autumn (apply ~80–85% of the Winter–Spring rate).",
          text_vi:
            "Giảm đạm khoảng 15–20% vào vụ Hè–Thu (bón khoảng 80–85% so với vụ Đông–Xuân).",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Seasonal nitrogen adjustments account for temperature and growth conditions differences.",
                vi: "Điều chỉnh đạm theo vụ tính đến sự khác biệt về nhiệt độ và điều kiện sinh trưởng.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "If I use a seeder that incorporates fertilizer, can I reduce nitrogen?",
          text_vi:
            "Dùng máy sạ vùi phân thì có thể giảm lượng đạm không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Yes—reduce N by about 10–15% because deeper placement reduces losses and improves uptake.",
          text_vi:
            "Có—giảm đạm khoảng 10–15% do vùi sâu giảm thất thoát và cây hấp thụ tốt hơn.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Deep fertilizer placement improves nitrogen use efficiency and reduces environmental losses.",
                vi: "Bón phân sâu cải thiện hiệu quả sử dụng đạm và giảm thất thoát ra môi trường.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "flow_pest_03",
      title:
        "Pest management (IPM) – Quản lý dịch hại tổng hợp (IPM)",
      topic: ["pest", "IPM", "planthopper"],
      messages: [
        {
          role: "user",
          text_en:
            "I see brown planthoppers—should I spray now?",
          text_vi:
            "Có rầy nâu trên ruộng—tôi có nên phun ngay không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Check the threshold first. Around ≥20–25 per hill (~1,000–1,500/m²) at tillering suggests intervention; below that, keep natural enemies and avoid early sprays.",
          text_vi:
            "Trước hết kiểm tra ngưỡng phòng trừ. Khoảng ≥20–25 con/bụi (~1.000–1.500/m²) ở giai đoạn đẻ nhánh thì nên xử lý; nếu dưới ngưỡng, nên giữ thiên địch và tránh phun sớm.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Economic thresholds guide spray decisions to avoid unnecessary pesticide use.",
                vi: "Ngưỡng kinh tế hướng dẫn quyết định phun để tránh sử dụng thuốc không cần thiết.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en: "What does IPM mean for my farm?",
          text_vi: "IPM nghĩa là gì với ruộng của tôi?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Sow synchronously, choose tolerant varieties, fertilize balanced, conserve natural enemies, and only spray when necessary.",
          text_vi:
            "Gieo sạ đồng loạt, chọn giống chống chịu, bón phân cân đối, bảo tồn thiên địch và chỉ phun khi thật cần thiết.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "IPM integrates cultural, biological, and chemical methods for sustainable pest control.",
                vi: "IPM tích hợp phương pháp canh tác, sinh học và hóa học để kiểm soát sâu bệnh bền vững.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en: "If I must spray, what are the '4 Rights'?",
          text_vi: "Nếu buộc phải phun, '4 đúng' là gì?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Right pesticide, right dose, right timing, right method. This reduces residues and protects the environment.",
          text_vi:
            "Đúng thuốc, đúng liều, đúng lúc, đúng cách. Điều này giảm dư lượng và bảo vệ môi trường.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "The 4 Rights principle ensures safe and effective pesticide application.",
                vi: "Nguyên tắc 4 đúng đảm bảo phun thuốc an toàn và hiệu quả.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "Should I spray on a fixed schedule to prevent pests?",
          text_vi:
            "Có nên phun định kỳ để phòng sâu bệnh không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "No. Spray only when pests exceed the threshold; preventive spraying wastes money and kills natural enemies.",
          text_vi:
            "Không. Chỉ phun khi sâu hại vượt ngưỡng; phun phòng định kỳ tốn kém và diệt thiên địch.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Threshold-based spraying is more economical and preserves beneficial insects.",
                vi: "Phun dựa trên ngưỡng tiết kiệm hơn và bảo tồn côn trùng có ích.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "Any safety/timing tips if spraying is needed?",
          text_vi:
            "Nếu cần phun thì có lưu ý gì về an toàn và thời điểm không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Spray early morning or late afternoon, wear PPE, respect re‑entry intervals, and rotate modes of action.",
          text_vi:
            "Phun sáng sớm hoặc chiều mát, mang đồ bảo hộ, tuân thủ thời gian cách ly và luân phiên nhóm hoạt chất.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Proper spray timing and safety practices protect applicators and the environment.",
                vi: "Thời gian phun và thực hành an toàn phù hợp bảo vệ người phun và môi trường.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "flow_harvest_post_04",
      title:
        "Harvest & postharvest essentials – Thu hoạch & sau thu hoạch",
      topic: ["harvest", "postharvest", "storage"],
      messages: [
        {
          role: "user",
          text_en: "When is the optimal harvest time?",
          text_vi: "Thời điểm thu hoạch tối ưu là khi nào?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "When 85–90% of grains on the panicle are straw‑yellow or golden—this minimizes shattering and unfilled grains.",
          text_vi:
            "Khi 85–90% hạt trên bông có màu vàng rơm/vàng—giảm rụng hạt và hạt lép.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Optimal harvest timing maximizes grain quality and minimizes losses.",
                vi: "Thời điểm thu hoạch tối ưu tối đa hóa chất lượng hạt và giảm thiểu tổn thất.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "Why use a combine instead of hand harvesting?",
          text_vi:
            "Vì sao nên dùng máy gặt đập liên hợp thay vì gặt tay?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Combines cut, thresh, clean and bag in one pass, reducing losses and addressing labor shortages.",
          text_vi:
            "Máy gặt đập liên hợp cắt–đập–làm sạch–đóng bao trong một lần, giảm tổn thất và giải quyết thiếu lao động.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Combine harvesters improve efficiency and reduce post-harvest losses significantly.",
                vi: "Máy gặt đập liên hợp cải thiện hiệu quả và giảm đáng kể tổn thất sau thu hoạch.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en: "How soon must I dry paddy after harvest?",
          text_vi: "Sau thu hoạch bao lâu phải sấy lúa?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Start drying within 24 hours to avoid heating, fermentation, sprouting, and quality loss.",
          text_vi:
            "Sấy trong vòng 24 giờ để tránh hạt nóng lên, lên men, nảy mầm và giảm chất lượng.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Immediate drying prevents quality deterioration and maintains grain value.",
                vi: "Sấy ngay lập tức ngăn ngừa giảm chất lượng và duy trì giá trị hạt.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "What are safe moisture targets for storage?",
          text_vi: "Độ ẩm an toàn để bảo quản là bao nhiêu?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Commercial: 14% moisture; seed rice: 13.5% moisture, plus cleaning to remove impurities.",
          text_vi:
            "Lúa thương phẩm: 14% ẩm; lúa giống: 13,5% ẩm và phải làm sạch tạp chất trước bảo quản.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Proper moisture levels prevent spoilage and maintain seed viability during storage.",
                vi: "Độ ẩm phù hợp ngăn hư hỏng và duy trì sức sống hạt giống trong bảo quản.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "If it rains during harvest, what should I do?",
          text_vi:
            "Nếu gặp mưa lúc thu hoạch thì xử lý thế nào?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Prioritize high‑capacity drying within 24 hours. If immediate drying isn't possible, spread grain in thin layers in a ventilated area and use fans.",
          text_vi:
            "Ưu tiên sấy công suất cao trong 24 giờ. Nếu chưa sấy được, rải mỏng lúa nơi thoáng và dùng quạt để hạn chế nóng, lên men.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Emergency drying procedures minimize losses when weather conditions are unfavorable.",
                vi: "Thủ tục sấy khẩn cấp giảm thiểu tổn thất khi điều kiện thời tiết không thuận lợi.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "flow_straw_05",
      title:
        "Straw handling & circular use – Xử lý rơm rạ & tuần hoàn",
      topic: ["straw", "circular", "residue"],
      messages: [
        {
          role: "user",
          text_en:
            "How long can straw stay on dry fields after harvest?",
          text_vi:
            "Rơm có thể để trên ruộng khô tối đa bao lâu sau thu hoạch?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "No more than ~5 days; quality declines as decomposition starts, especially nitrogen loss.",
          text_vi:
            "Không quá ~5 ngày; chất lượng giảm khi rơm bắt đầu phân hủy, đặc biệt mất đạm.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Timely straw collection preserves nutrient value and prevents field degradation.",
                vi: "Thu gom rơm kịp thời bảo tồn giá trị dinh dưỡng và ngăn thoái hóa ruộng.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en: "What should I do with straw on wet fields?",
          text_vi: "Rơm trên ruộng ướt nên xử lý thế nào?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Collect immediately; wet straw decomposes quickly and increases CH₄/N₂O emissions.",
          text_vi:
            "Thu gom ngay; rơm ướt phân hủy rất nhanh và làm tăng phát thải CH₄/N₂O.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Proper wet straw management reduces greenhouse gas emissions from rice fields.",
                vi: "Quản lý rơm ướt đúng cách giảm phát thải khí nhà kính từ ruộng lúa.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en: "Which baler suits wet fields better?",
          text_vi:
            "Loại máy cuốn rơm nào phù hợp ruộng ướt hơn?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "A self‑propelled tracked baler works on both wet and dry fields and can carry bales to collection points; tractor‑mounted units are mainly for dry fields.",
          text_vi:
            "Máy cuốn tự hành bánh xích hoạt động được cả ruộng ướt và khô, có thùng chứa đưa rơm ra điểm tập kết; máy gắn sau máy kéo chủ yếu dùng ruộng khô.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Appropriate machinery selection improves straw collection efficiency across field conditions.",
                vi: "Lựa chọn máy móc phù hợp cải thiện hiệu quả thu gom rơm trong các điều kiện ruộng.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "Is burning straw a problem? What nutrients are lost?",
          text_vi:
            "Đốt rơm có hại không? Mất những dinh dưỡng gì?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Avoid burning: it loses ~100% N, ~25% P, and ~20% K from straw and causes pollution.",
          text_vi:
            "Không nên đốt: sẽ mất ~100% N, ~25% P và ~20% K trong rơm và gây ô nhiễm.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Burning straw destroys valuable nutrients and creates air pollution hazards.",
                vi: "Đốt rơm phá hủy dinh dưỡng quý giá và tạo nguy cơ ô nhiễm không khí.",
              },
            },
          ],
        },
        {
          role: "user",
          text_en:
            "How does straw fit a circular pathway back to the field?",
          text_vi:
            "Rơm tham gia vòng tuần hoàn trở lại đồng ruộng như thế nào?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Collect straw → use for mushrooms/feed/mulch/bedding → compost spent materials → return compost to fields.",
          text_vi:
            "Thu gom rơm → dùng trồng nấm/thức ăn/phủ luống/đệm lót → ủ các phụ phẩm → bón phân hữu cơ trở lại ruộng.",
          citations: [
            {
              label: {
                en: "CGIAR Rice Handbook",
                vi: "Sổ tay lúa CGIAR",
              },
              url: "https://cgspace.cgiar.org/items/fa1c80b9-b4e4-4b94-9625-cadc918a9cf5",
              excerpt: {
                en: "Circular straw management creates value while returning nutrients to the soil.",
                vi: "Quản lý rơm tuần hoàn tạo giá trị đồng thời trả lại dinh dưỡng cho đất.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "flow_awd_01",
      title:
        "AWD Timing and Field Management – Thời điểm AWD và Quản lý ruộng",
      topic: ["demo", "water", "awd"],
      messages: [
        {
          role: "user",
          text_en:
            "I sowed rice on January 1 and kept water about 5 cm deep for the first 10 days. When should I start AWD?",
          text_vi:
            "Tôi gieo lúa ngày 1/1 và giữ nước sâu 5 cm trong 10 ngày đầu. Khi nào nên bắt đầu AWD?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Good timing! You can start AWD now around January 11-12. Let the water recede naturally until you see hairline cracks or your field tube shows −10 to −15 cm below the soil surface, then re-flood to about 3–5 cm depth. Repeat this cycle throughout the season. 💡 Tip: If you don't have a field tube yet, watch for small cracks forming on the soil surface—that's your signal to irrigate again.",
          text_vi:
            "Thời điểm tốt! Bạn có thể bắt đầu AWD ngay khoảng 11-12/1. Để nước rút tự nhiên cho đến khi thấy vết nứt chân chim hoặc ống đo báo −10 đến −15 cm dưới mặt đất, sau đó bơm nước lại khoảng 3–5 cm. Lặp lại chu kỳ này suốt mùa vụ. 💡 Mẹo: Nếu chưa có ống đo, hãy quan sát vết nứt nhỏ trên mặt đất—đó là tín hiệu cần tưới lại.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "If cracks appear too soon, should I wait until −15 cm before reflooding?",
          text_vi:
            "Nếu vết nứt xuất hiện sớm thì có nên đợi đến −15 cm mới bơm nước không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "No need to wait that long. If the soil dries quickly because it's sandy or the weather is windy, refill earlier at around −10 cm. 💡 Tip: mark the refill point on your tube so it's easy to see when to pump.",
          text_vi:
            "Không cần đợi lâu vậy. Nếu đất khô nhanh do cát hoặc gió, hãy bơm nước lại khi ống đo khoảng −10 cm. 💡 Mẹo: đánh dấu mức nước trên ống để dễ nhận biết lúc tưới.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "How long can I keep the field dry before reflooding?",
          text_vi:
            "Tôi có thể để ruộng khô bao lâu trước khi bơm nước lại?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Usually 3–7 days, depending on soil and weather. Don't let the plants wilt. If you see midday leaf rolling, irrigate that day. 💡 Tip: lighter soils dry faster than heavy clay soils.",
          text_vi:
            "Thường 3–7 ngày, tùy đất và thời tiết. Đừng để cây héo. Nếu lá cuốn vào giữa trưa, hãy tưới ngay. 💡 Mẹo: đất nhẹ khô nhanh hơn đất sét.",
          citations: [],
        },
        {
          role: "user",
          text_en: "When should I stop doing AWD?",
          text_vi: "Khi nào tôi nên ngừng AWD?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Drain the field for the last time about 10–15 days before harvest. Keep the surface just moist—this helps even ripening, easier harvesting, and reduces lodging.",
          text_vi:
            "Tháo nước lần cuối khoảng 10–15 ngày trước thu hoạch. Giữ mặt ruộng chỉ ẩm—giúp lúa chín đều, gặt dễ hơn và giảm đổ ngã.",
          citations: [],
        },
      ],
    },
    {
      id: "flow_awd_tube_02",
      title:
        "AWD Tube Reading and Field Symptoms – Đọc ống đo AWD và Dấu hiệu trên ruộng",
      topic: ["demo", "water", "awd"],
      messages: [
        {
          role: "user",
          text_en:
            "My AWD tube shows the water level is −8 cm. The soil surface looks dry but no cracks yet. Should I wait longer before irrigating?",
          text_vi:
            "Ống đo AWD cho thấy mực nước là −8 cm. Mặt ruộng đã khô nhưng chưa nứt. Tôi có nên chờ thêm trước khi tưới không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "You can wait a bit more until the tube reaches around −10 to −15 cm, or until you see hairline cracks forming. 💡 Tip: lightly scratch the soil—if it's dry for 3–5 cm below the surface, it's time to irrigate soon.",
          text_vi:
            "Bạn có thể chờ thêm cho đến khi ống đo báo khoảng −10 đến −15 cm hoặc khi thấy vết nứt nhỏ xuất hiện. 💡 Mẹo: cào nhẹ mặt đất—nếu khô khoảng 3–5 cm dưới mặt, sắp đến lúc tưới rồi.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "What if I see leaves rolling at noon but the tube only reads −9 cm?",
          text_vi:
            "Nếu buổi trưa lá lúa cuốn lại nhưng ống đo mới −9 cm thì sao?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "That means the plants are stressed sooner because of wind or high temperature. You should irrigate the same day—don't wait for −15 cm. 💡 Tip: young rice is more sensitive to drying than mature plants.",
          text_vi:
            "Điều đó nghĩa là cây bị khô sớm do gió hoặc nhiệt độ cao. Hãy tưới ngay trong ngày—không cần đợi đến −15 cm. 💡 Mẹo: lúa non nhạy cảm với khô hạn hơn lúa trưởng thành.",
          citations: [],
        },
        {
          role: "user",
          text_en: 
            "Sometimes the water in the tube stays at the same level for many days even though the field surface looks dry. What does that mean?",
          text_vi:
            "Đôi khi mực nước trong ống đo giữ nguyên nhiều ngày dù mặt ruộng đã khô. Điều đó có ý nghĩa gì?",
          citations: [],
        },
        {
          role: "assistant",
          text_en: 
            "That means the bottom layer of soil is still saturated while the surface has dried. It’s a sign of poor percolation or compacted soil. You can lightly harrow or open shallow cracks to improve water movement before the next irrigation. 💡 Tip: Check that the tube holes are not blocked with clay or algae—clean them every 2–3 weeks.",
            text_vi: 
              "Điều đó có nghĩa là lớp đất dưới vẫn còn bão hòa nước trong khi mặt ruộng đã khô. Đây là dấu hiệu của đất bị nén chặt hoặc thấm nước kém. Bạn có thể xới nhẹ hoặc mở các khe nhỏ để nước lưu thông tốt hơn trước lần tưới tiếp theo. 💡 Mẹo: Kiểm tra xem các lỗ trên ống có bị bùn hoặc rêu bít không—vệ sinh ống mỗi 2–3 tuần.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "How can I know if the AWD tube is giving correct readings?",
          text_vi: "Làm sao biết ống đo AWD hiển thị đúng?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Make sure the perforations are not blocked and that the top of the tube is level with the soil surface. Clean the tube every few weeks so you can see the water clearly. 💡 Tip: place the tube near the middle of the plot, not too close to the bund.",
          text_vi:
            "Hãy đảm bảo các lỗ nhỏ không bị bít và miệng ống ngang mặt đất. Vệ sinh ống mỗi vài tuần để nhìn rõ mực nước. 💡 Mẹo: đặt ống gần giữa ruộng, không quá sát bờ.",
          citations: [],
        },
      ],
    },
    {
      id: "flow_fertilizer_03",
      title:
        "Fertilizer Scheduling and Adjustments – Lịch bón phân và Điều chỉnh",
      topic: ["demo", "fertilizer", "nutrients"],
      messages: [
        {
          role: "user",
          text_en:
            "I already applied my first round of fertilizer 10 days after sowing. When should I plan the next one?",
          text_vi:
            "Tôi đã bón đợt phân đầu tiên 10 ngày sau sạ. Khi nào nên bón đợt tiếp theo?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Plan the second round around 18–25 days after sowing when tillering starts. Apply about 40% N and 50% K at this stage to support strong tiller growth. 💡 Tip: Apply fertilizer when the field is moist, not flooded, for better absorption.",
          text_vi:
            "Lên kế hoạch bón đợt hai khoảng 18–25 ngày sau sạ khi lúa bắt đầu đẻ nhánh. Bón khoảng 40% đạm và 50% kali ở giai đoạn này để cây đẻ khỏe. 💡 Mẹo: Bón khi ruộng ẩm, không ngập để cây hấp thu tốt hơn.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "If my field stays flooded, can I still apply urea?",
          text_vi:
            "Nếu ruộng tôi vẫn ngập nước thì có thể bón urê được không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "It's better not to. Urea dissolves quickly and nitrogen will be lost through volatilization. Wait until the water recedes and the soil is just moist. 💡 Tip: You can also broadcast fertilizer right before light irrigation so it mixes evenly.",
          text_vi:
            "Không nên. Urê tan nhanh và đạm sẽ bay hơi mất. Hãy đợi nước rút, đất chỉ còn ẩm mới bón. 💡 Mẹo: Có thể rải phân ngay trước khi cho nước nông để phân hòa đều hơn.",
          citations: [],
        },
        {
          role: "user",
          text_en: 
            "My leaves are turning pale even after I applied enough fertilizer. What could be wrong?",
            text_vi:
              "Lá ruộng tôi vẫn vàng dù đã bón đủ phân. Có thể do đâu?",
          citations: [],
        },
        {
          role: "assistant",
          text_en: 
            "Let’s diagnose before adding more fertilizer. Please tell me: crop age (days after sowing), which leaves are yellowing (young or old), whether yellowing is uniform or patchy, and any recent herbicide use or flooding. Causes can include N or K imbalance, Fe/Zn deficiency on flooded soils, planthopper damage, or herbicide/toxin injury. Check roots and pests first. If plants are 18–25 DAS with pale youngest leaves and no pests, consider a modest top‑up of 20–25 kg N/ha; otherwise avoid extra N until we identify the cause.",
          text_vi:
            "Hãy chẩn đoán trước khi bón thêm. Vui lòng cho biết: tuổi cây (ngày sau sạ), lá nào bị vàng (lá non hay lá già), vàng đều hay loang lổ, và có phun thuốc cỏ hoặc bị ngập gần đây không. Nguyên nhân có thể do mất cân đối đạm/kali, thiếu sắt/kẽm khi ruộng ngập, rầy nâu gây hại, hoặc ngộ độc/thuốc cỏ. Hãy kiểm tra rễ và sâu hại trước. Nếu cây ở 18–25 NSS, lá non nhạt và không có sâu bệnh, có thể bón bổ sung nhẹ 20–25 kg N/ha; nếu không thì tránh bón thêm đạm cho đến khi xác định nguyên nhân.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "The youngest leaves are pale yellow, and the field has been waterlogged for the last few days. What should I do now?",
          text_vi:
            "Lá non bị vàng nhạt và ruộng bị ngập nước mấy ngày nay. Giờ tôi nên làm gì?",
          citations: [],
        },
        {
          "role": "assistant",
          text_en:
            "That suggests nitrogen deficiency made worse by poor drainage. First, drain the excess water and let the field aerate for 2–3 days so roots can breathe. Then apply about 20 kg N/ha as urea on moist soil, not flooded. 💡 Tip: Keeping the water shallow and well-aerated helps prevent yellowing from both nutrient loss and root stress.",
            text_vi:
              "Điều này cho thấy thiếu đạm nặng hơn do thoát nước kém. Trước tiên, hãy tháo bớt nước và để ruộng thông thoáng 2–3 ngày để rễ hô hấp. Sau đó bón khoảng 20 kg N/ha dạng urê trên đất ẩm, không ngập. 💡 Mẹo: Giữ nước nông và thông khí tốt giúp ngăn vàng lá do mất dinh dưỡng và rễ bị thiếu oxy.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Can I mix organic fertilizer with chemical fertilizer?",
          text_vi:
            "Tôi có thể trộn phân hữu cơ với phân hóa học không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Yes, that's a good practice. Organic fertilizer improves soil health and helps hold nutrients longer. Mix it in before planting or apply between chemical fertilizer rounds. 💡 Tip: If you use composted manure, apply 2–3 tons/ha for best results.",
          text_vi:
            "Có, rất nên làm vậy. Phân hữu cơ giúp đất tơi xốp và giữ dinh dưỡng lâu hơn. Trộn trước khi gieo hoặc bón xen giữa các đợt phân hóa học. 💡 Mẹo: Nếu dùng phân chuồng hoai, bón khoảng 2–3 tấn/ha là tốt nhất.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Should I adjust the fertilizer rate for summer–autumn compared to winter–spring?",
          text_vi:
            "Có nên điều chỉnh lượng phân giữa vụ Hè–Thu và Đông–Xuân không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Yes, reduce nitrogen by about 15–20% in summer–autumn since higher temperatures increase volatilization and crops mature faster.",
          text_vi:
            "Có, nên giảm đạm khoảng 15–20% vào vụ Hè–Thu vì nhiệt độ cao làm thất thoát nhanh và cây chín sớm hơn.",
          citations: [],
        },
      ],
    },
    {
      id: "flow_lcc_04",
      title:
        "Nitrogen Management using Leaf Color Chart (LCC) – Quản lý đạm bằng bảng so màu lá (LCC)",
      topic: ["demo", "fertilizer", "lcc"],
      messages: [
        {
          role: "user",
          text_en:
            "I have an LCC but I'm not sure how to use it. When should I start checking the leaf color?",
          text_vi:
            "Tôi có bảng so màu lá (LCC) nhưng chưa biết dùng thế nào. Khi nào nên bắt đầu kiểm tra màu lá?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Start checking around 14 days after sowing, when the rice starts tillering. Hold the LCC against the middle part of a healthy leaf under good light and compare the color. 💡 Tip: Always check at least 10 plants from different parts of the field.",
          text_vi:
            "Bắt đầu kiểm tra khoảng 14 ngày sau sạ, khi lúa bắt đầu đẻ nhánh. Đặt bảng LCC cạnh phần giữa của lá khỏe dưới ánh sáng tốt và so màu. 💡 Mẹo: Luôn kiểm tra ít nhất 10 cây ở các vị trí khác nhau trong ruộng.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "What color number should I use as the threshold for adding nitrogen?",
          text_vi: "Ngưỡng màu bao nhiêu thì cần bón thêm đạm?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "If the average color is below 3 during tillering or below 4 during panicle initiation, add about 20–25 kg N/ha. 💡 Tip: Use the same LCC for consistency; slight shade differences can affect the reading.",
          text_vi:
            "Nếu màu trung bình nhỏ hơn 3 ở giai đoạn đẻ nhánh hoặc nhỏ hơn 4 ở giai đoạn làm đòng, bón thêm khoảng 20–25 kg N/ha. 💡 Mẹo: Nên dùng cùng một bảng LCC để kết quả nhất quán; khác biệt nhỏ về màu có thể ảnh hưởng đến kết quả.",
          citations: [],
        },
        {
          role: "user",
          text_en: "How often should I check the leaf color?",
          text_vi: "Bao lâu tôi nên kiểm tra màu lá một lần?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Check every 7–10 days during the active growth period. If the field looks uneven, check more frequently. 💡 Tip: Doing this regularly helps you apply nitrogen only when the crop truly needs it.",
          text_vi:
            "Kiểm tra mỗi 7–10 ngày trong giai đoạn sinh trưởng mạnh. Nếu ruộng không đều, nên kiểm tra thường xuyên hơn. 💡 Mẹo: Kiểm tra thường xuyên giúp bạn chỉ bón đạm khi cây thật sự cần.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Sometimes the color looks dark but plants are not growing fast. Why is that?",
          text_vi:
            "Đôi khi lá có màu đậm nhưng cây lại không phát triển nhanh. Vì sao vậy?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "That may be due to cloudy weather or waterlogging, not nitrogen deficiency. Too much water limits oxygen and slows growth even if leaves are dark green. 💡 Tip: Combine LCC readings with field observations like tiller number and plant vigor.",
          text_vi:
            "Có thể do thời tiết nhiều mây hoặc ruộng bị ngập, không phải thiếu đạm. Nước ngập làm giảm oxy và làm cây phát triển chậm dù lá vẫn xanh đậm. 💡 Mẹo: Hãy kết hợp đọc LCC với quan sát thực tế như số chồi và sức sinh trưởng của cây.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "If I use slow-release fertilizer, should I still follow the LCC reading?",
          text_vi:
            "Nếu tôi dùng phân chậm tan, có cần theo dõi LCC không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Yes, but you may see more stable leaf color. Use LCC mainly to confirm the crop is not turning too pale before topdressing again.",
          text_vi:
            "Có, nhưng bạn sẽ thấy màu lá ổn định hơn. Dùng LCC chủ yếu để xác nhận ruộng chưa bị vàng trước khi bón thúc tiếp.",
          citations: [],
        },
      ],
    },
    {
      id: "flow_disease_06",
      title:
        "Disease Management (Rice Blast & Leaf Diseases) – Quản lý bệnh (Đạo ôn & Bệnh lá)",
      topic: ["demo", "disease", "pest"],
      messages: [
        {
          role: "user",
          text_en:
            "After several cool and wet nights, I noticed gray spindle-shaped spots on my rice leaves. Is this leaf blast?",
          text_vi:
            "Sau vài đêm mát ẩm, tôi thấy những vết xám hình thoi trên lá lúa. Có phải bệnh đạo ôn lá không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Yes, those are classic rice blast symptoms. It spreads quickly in cool, humid weather. You should reduce standing water and apply a triazole or strobilurin fungicide following label rates. 💡 Tip: Avoid spraying in the heat of the day; early morning is best.",
          text_vi:
            "Đúng, đó là triệu chứng điển hình của bệnh đạo ôn. Bệnh lan nhanh trong thời tiết mát ẩm. Bạn nên rút bớt nước và phun thuốc gốc triazole hoặc strobilurin theo đúng liều trên nhãn. 💡 Mẹo: Không phun khi trời nắng gắt; sáng sớm là thời điểm tốt nhất.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Should I drain the field completely to control the disease?",
          text_vi:
            "Tôi có nên rút hết nước trong ruộng để khống chế bệnh không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Just reduce the water level temporarily—don't dry the soil completely. Keep it moist to help roots recover but not flooded. 💡 Tip: Good airflow and balanced fertilizer help reduce future infection.",
          text_vi:
            "Chỉ cần hạ mực nước tạm thời—không nên làm khô hoàn toàn. Giữ ẩm để rễ phục hồi nhưng không để ngập. 💡 Mẹo: Giữ thông thoáng và bón phân cân đối sẽ giúp giảm bệnh về sau.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Can I mix fungicide with fertilizer or insecticide to save time?",
          text_vi:
            "Tôi có thể pha thuốc trừ nấm với phân hoặc thuốc trừ sâu để tiết kiệm thời gian không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "It's not recommended unless the label says it's safe. Some mixtures reduce effectiveness or cause leaf burn. 💡 Tip: Always do a jar test—mix small quantities first to check compatibility.",
          text_vi:
            "Không nên, trừ khi hướng dẫn trên nhãn cho phép. Một số hỗn hợp có thể làm giảm hiệu quả hoặc cháy lá. 💡 Mẹo: Hãy thử pha nhỏ trong lọ trước để kiểm tra độ tương hợp.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "If the infection is light, do I still need to spray chemicals?",
          text_vi: "Nếu bệnh nhẹ, tôi có cần phun thuốc không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "For mild infection, you can remove the affected leaves and improve drainage first. Spray only if the disease continues to spread. 💡 Tip: Rotate varieties and avoid excessive nitrogen to prevent future outbreaks.",
          text_vi:
            "Nếu bệnh nhẹ, có thể nhổ bỏ lá bị bệnh và cải thiện thoát nước trước. Chỉ phun nếu bệnh vẫn lan rộng. 💡 Mẹo: Luân canh giống và tránh bón thừa đạm để ngừa bệnh tái phát.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "How can I protect my crop in future seasons?",
          text_vi:
            "Làm thế nào để bảo vệ ruộng trong các vụ tới?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Use certified resistant varieties, avoid dense seeding, and manage water properly. Also, remove plant residues after harvest to reduce spores. 💡 Tip: Crop rotation with legumes helps break the disease cycle.",
          text_vi:
            "Dùng giống kháng bệnh, tránh gieo dày và quản lý nước hợp lý. Đồng thời, dọn sạch tàn dư sau thu hoạch để giảm bào tử bệnh. 💡 Mẹo: Luân canh với cây họ đậu giúp cắt vòng đời bệnh.",
          citations: [],
        },
      ],
    },
    {
      id: "flow_saline_07",
      title:
        "Irrigation under Saline Intrusion – Tưới tiêu khi Xâm nhập mặn",
      topic: ["demo", "water", "salinity"],
      messages: [
        {
          role: "user",
          text_en:
            "The water in my canal measures about 3‰ salinity this week. Can I still use it for irrigation?",
          text_vi:
            "Nước trong kênh đo được khoảng 3‰ độ mặn tuần này. Tôi có thể dùng để tưới không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "No, avoid irrigating when salinity exceeds 2‰. Salty water damages seedlings and reduces yield. Wait for lower salinity after rainfall or tide changes. 💡 Tip: Check salinity early in the morning and evening; it fluctuates during the day.",
          text_vi:
            "Không, tránh tưới khi độ mặn vượt 2‰. Nước mặn gây hại cho mạ và giảm năng suất. Hãy chờ khi độ mặn giảm sau mưa hoặc thủy triều. 💡 Mẹo: Kiểm tra độ mặn vào sáng sớm và chiều tối vì nó thay đổi trong ngày.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "If I accidentally irrigated with saline water, what can I do to help my rice recover?",
          text_vi:
            "Nếu tôi lỡ tưới bằng nước mặn thì phải làm sao để cứu lúa?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Flush the field with fresh water as soon as possible to remove salt from the soil. Then apply a thin layer of water for 2–3 days and drain again. 💡 Tip: Add compost or organic matter to improve soil structure and reduce salt effects.",
          text_vi:
            "Xả ruộng bằng nước ngọt càng sớm càng tốt để rửa muối khỏi đất. Sau đó giữ lớp nước nông 2–3 ngày rồi tháo ra. 💡 Mẹo: Bổ sung phân hữu cơ để cải thiện cấu trúc đất và giảm ảnh hưởng của muối.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "How can I measure salinity accurately in the field?",
          text_vi:
            "Làm sao đo độ mặn chính xác ngay tại ruộng?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Use a handheld EC meter or simple salinity refractometer. Calibrate it with clean water before use. 💡 Tip: Take water samples at different depths and times to see the daily variation.",
          text_vi:
            "Dùng máy đo EC cầm tay hoặc khúc xạ kế đo độ mặn. Hiệu chỉnh bằng nước ngọt trước khi đo. 💡 Mẹo: Lấy mẫu nước ở các độ sâu và thời điểm khác nhau để thấy biến động trong ngày.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "For next season, what should I do to avoid saline damage?",
          text_vi:
            "Vụ sau tôi nên làm gì để tránh thiệt hại do mặn?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Plan early sowing before the peak salt period, use salt‑tolerant varieties such as OM5451 or ST25, and store fresh water in ponds for emergency use. 💡 Tip: Join local irrigation groups to share salinity monitoring data.",
          text_vi:
            "Lên kế hoạch gieo sớm trước đợt mặn cao, dùng giống chịu mặn như OM5451 hoặc ST25, và trữ nước ngọt trong ao để dùng khi khẩn cấp. 💡 Mẹo: Tham gia nhóm thủy lợi địa phương để cùng theo dõi độ mặn.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Can I mix canal water with rainwater or pond water to reduce salinity?",
          text_vi:
            "Tôi có thể trộn nước kênh với nước mưa hoặc ao để giảm mặn không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Yes, mixing water is a good solution. If you can dilute 3‰ canal water with an equal amount of fresh water, salinity drops to about 1.5‰—safe for irrigation.",
          text_vi:
            "Có, trộn nước là cách tốt. Nếu bạn pha loãng nước kênh 3‰ với lượng nước ngọt tương đương, độ mặn giảm còn khoảng 1,5‰—an toàn cho tưới.",
          citations: [],
        },
      ],
    },
    {
      id: "flow_variety_08",
      title:
        "Variety Recommendation and Seasonal Planning – Khuyến cáo giống và Lập kế hoạch mùa vụ",
      topic: ["demo", "varieties", "planning"],
      messages: [
        {
          role: "user",
          text_en:
            "I'm planning my next crop in Soc Trang, where we have mild salinity and a short dry season. Which rice varieties should I choose?",
          text_vi:
            "Tôi dự định vụ tới ở Sóc Trăng, nơi có nhiễm mặn nhẹ và mùa khô ngắn. Nên chọn giống lúa nào?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "You can grow OM5451 or OM18—they're stable and adapt well to mild salinity. If you want high‑quality rice, ST24 or ST25 are also good choices. 💡 Tip: Check which varieties are officially approved in your province before buying seed.",
          text_vi:
            "Bạn có thể trồng OM5451 hoặc OM18—giống này năng suất ổn định và thích nghi tốt với mặn nhẹ. Nếu muốn gạo chất lượng cao, ST24 hoặc ST25 cũng rất tốt. 💡 Mẹo: Kiểm tra danh mục giống được khuyến cáo tại địa phương trước khi mua giống.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "How can I decide the best sowing time for my area?",
          text_vi:
            "Làm sao tôi biết thời điểm gieo sạ tốt nhất cho vùng mình?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Follow the local seasonal calendar. In Soc Trang, sow early winter–spring crops before salinity peaks, usually by late November to early December. 💡 Tip: Coordinate sowing with neighbors to reduce pest and disease spread.",
          text_vi:
            "Hãy theo lịch thời vụ của địa phương. Ở Sóc Trăng, nên gieo sớm vụ Đông–Xuân trước khi mặn lên cao, thường vào cuối tháng 11 đến đầu tháng 12. 💡 Mẹo: Gieo sạ đồng loạt với hàng xóm để giảm sâu bệnh.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Is it okay to reuse seeds from my last harvest if they looked healthy?",
          text_vi:
            "Tôi có thể dùng lại giống từ vụ trước nếu hạt giống trông khỏe mạnh không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Only if the field was disease‑free and you dried the seed properly. Test germination before sowing—viability should be above 85%. 💡 Tip: Certified seed usually gives 5–10% higher yield than home‑saved seed.",
          text_vi:
            "Chỉ nên dùng nếu ruộng vụ trước không bị bệnh và hạt đã được phơi đúng cách. Kiểm tra tỷ lệ nảy mầm trước khi gieo—nên đạt trên 85%. 💡 Mẹo: Giống xác nhận thường cho năng suất cao hơn 5–10% so với giống tự để.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Can I plant different varieties in the same field?",
          text_vi:
            "Tôi có thể trồng nhiều giống khác nhau trên cùng ruộng không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "It's better not to. Mixed varieties mature at different times, making water and pest management harder. If you want diversity, divide the field into clear plots for each variety. 💡 Tip: Plant uniform varieties for even ripening and easier harvesting.",
          text_vi:
            "Không nên. Các giống khác nhau có thời gian chín khác nhau, làm khó quản lý nước và sâu bệnh. Nếu muốn đa dạng, hãy chia ruộng thành từng khu riêng cho từng giống. 💡 Mẹo: Trồng cùng một giống giúp lúa chín đều và dễ gặt hơn.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Which varieties resist common pests and diseases better?",
          text_vi: "Giống nào chống chịu sâu bệnh tốt hơn?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "OM5451 and OM18 have moderate resistance to brown planthopper and blast, while ST24 and ST25 are more tolerant to salinity. 💡 Tip: Combine tolerant varieties with good field hygiene for the best protection.",
          text_vi:
            "OM5451 và OM18 có khả năng chống chịu trung bình với rầy nâu và đạo ôn, trong khi ST24 và ST25 chịu mặn tốt hơn. 💡 Mẹo: Kết hợp giống chống chịu với vệ sinh đồng ruộng sạch sẽ để đạt hiệu quả cao nhất.",
          citations: [],
        },
      ],
    },
    {
      id: "bph_flow_pest_05_v2",
      title:
        "Pest Management (Brown Planthopper – Image-based Detection) – Quản lý rầy nâu (Phát hiện qua hình ảnh)",
      topic: ["demo", "pest", "detection"],
      messages: [
        {
          role: "user",
          text_en:
            "I'm uploading photos of my rice field. Please check if there's any pest problem.",
          text_vi:
            "Tôi đang tải lên một số hình ảnh ruộng lúa của mình. Hãy kiểm tra xem có sâu bệnh gì không.",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "I've analyzed the photos — they show brown planthoppers feeding on the lower leaves (approx. 1200/m²). This level can cause hopperburn if not managed soon.",
          text_vi:
            "Tôi đã phân tích hình ảnh — phát hiện rầy nâu (Nilaparvata lugens) tập trung ở phần lá gốc (khoảng 1200/m²). Mức này có thể gây cháy rầy nếu không xử lý sớm.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "Yes, I can see the insects clearly in the image. Is this serious?",
          text_vi:
            "Vâng, tôi thấy rõ rầy trong hình. Tình trạng này có nghiêm trọng không?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "It's approaching the action threshold — about 20–30 per hill or 1000–1500/m². If the population increases in the next few days, you should prepare to spray. 💡 Tip: Check again after 3–5 days to confirm the trend.",
          text_vi:
            "Mức này gần ngưỡng cần xử lý — khoảng 20–30 con mỗi bụi hoặc 1000–1500/m². Nếu mật độ tăng trong vài ngày tới, bạn nên chuẩn bị phun thuốc. 💡 Mẹo: Kiểm tra lại sau 3–5 ngày để xác nhận xu hướng.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "What pesticide should I use and when should I spray?",
          text_vi:
            "Tôi nên dùng loại thuốc nào và phun khi nào?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Use selective insecticides such as pymetrozine, dinotefuran, or nitenpyram. Spray early morning or late afternoon when it's cool. 💡 Tip: Avoid over‑fertilizing with nitrogen — lush crops attract more planthoppers.",
          text_vi:
            "Dùng thuốc chọn lọc như pymetrozine, dinotefuran hoặc nitenpyram. Phun vào sáng sớm hoặc chiều mát khi trời dịu. 💡 Mẹo: Tránh bón thừa đạm — lúa xanh tốt quá sẽ thu hút nhiều rầy hơn.",
          citations: [],
        },
        {
          role: "user",
          text_en:
            "How can I keep them from coming back after spraying?",
          text_vi:
            "Làm sao để ngăn rầy quay lại sau khi phun thuốc?",
          citations: [],
        },
        {
          role: "assistant",
          text_en:
            "Rotate pesticide groups to prevent resistance and plant synchronously with your neighbors. Maintain a dry field for a few days after spraying. 💡 Tip: Leave a small unsprayed strip for natural predators like spiders and mirid bugs.",
          text_vi:
            "Luân phiên nhóm thuốc để tránh kháng thuốc và gieo sạ đồng loạt với hàng xóm. Giữ ruộng khô vài ngày sau khi phun. 💡 Mẹo: Giữ lại một dải nhỏ không phun để bảo tồn thiên địch như nhện và bọ xít bắt mồi.",
          citations: [],
        },
      ],
    },
  ],
};