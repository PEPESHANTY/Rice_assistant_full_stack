export interface ImageAnalysisResponse {
  condition: string;
  severity: 'healthy' | 'low' | 'moderate' | 'high';
  response: {
    en: string;
    vi: string;
  };
}

export const imageAnalysisResponses: Record<string, ImageAnalysisResponse> = {
  // Brown Plant Hopper (BPH)
  bph: {
    condition: 'Brown Plant Hopper Infestation',
    severity: 'high',
    response: {
      en: `🔍 Brown Plant Hopper (BPH) Detected

⚠️ HIGH SEVERITY - Act within 24-48 hours

WHAT I SEE:
Your rice shows "hopper burn" - yellowing and browning typical of BPH damage. This pest can cause major yield loss if not controlled quickly.

IMMEDIATE ACTIONS:
1. Scout field - Check 20 random hills. Look for small brown insects (2-3mm) at the base
2. If count > 5 per hill, apply insecticide:
   • Imidacloprid 200 SL: 500 ml/ha, OR
   • Buprofezin 25% SC: 800-1000 ml/ha
   • Mix with 400-500 L water/ha
   • Spray in afternoon
3. Drain water to 2-3 cm depth for 3-5 days

MANAGEMENT:
• Reduce nitrogen fertilizer
• Remove weeds on field borders
• Rotate insecticides to prevent resistance
• Protect spiders and dragonflies

NEXT SEASON:
• Use resistant varieties (IR64, IR74)
• Proper spacing (20x20 cm)
• Avoid late planting

Monitor daily for 7 days. Re-spray if population stays high. Contact extension officer if >30% field affected.`,
      
      vi: `🔍 Phát hiện rầy nâu

⚠️ MỨC CAO - Xử lý trong 24-48 giờ

NHỮNG GÌ TÔI THẤY:
Lúa có dấu hiệu "cháy bông" - vàng lá và nâu lá do rầy nâu. Sâu hại này gây mất năng suất lớn nếu không kiểm soát nhanh.

HÀNH ĐỘNG NGAY:
1. Kiểm tra - Xem 20 khóm ngẫu nhiên. Tìm côn trùng nâu nhỏ (2-3mm) ở gốc
2. Nếu > 5 con/khóm, phun thuốc:
   • Imidacloprid 200 SL: 500 ml/ha, HOẶC
   • Buprofezin 25% SC: 800-1000 ml/ha
   • Pha với 400-500 L nước/ha
   • Phun buổi chiều
3. Hạ nước xuống 2-3 cm trong 3-5 ngày

QUẢN LÝ:
• Giảm phân đạm
• Làm cỏ bờ ruộng
• Thay đổi loại thuốc tránh kháng
• Bảo vệ nhện và chuồn chuồn

VỤ SAU:
• Dùng giống kháng (IR64, IR74)
• Khoảng cách đúng (20x20 cm)
• Tránh gieo muộn

Theo dõi hàng ngày 7 ngày. Phun lại nếu rầy vẫn nhiều. Liên hệ khuyến nông nếu >30% ruộng bị hại.`
    }
  },

  // Brown Spot Disease
  bs: {
    condition: 'Brown Spot Disease',
    severity: 'moderate',
    response: {
      en: `🔍 Brown Spot Disease Detected

⚠️ MODERATE - Act within 3-5 days

WHAT I SEE:
Oval brown spots on leaves with yellowish margins. Caused by fungus Bipolaris oryzae. Often linked to nutrient deficiency and water stress.

IMMEDIATE ACTIONS:
1. Apply fungicide:
   • Tricyclazole 75% WP: 400g/ha, OR
   • Mancozeb 80% WP: 2kg/ha
   • Spray early morning or late afternoon
   • Repeat after 7-10 days if needed
2. Improve nutrition:
   • Potassium: 30-40 kg K₂O/ha
   • Zinc sulfate: 25 kg/ha if deficient
3. Water management:
   • Keep 3-5 cm depth steady
   • Avoid wet/dry cycling

ROOT CAUSES:
• Nutrient deficiency (potassium/silica)
• Poor soil - add organic matter
• Infected seeds
• Irregular water supply

MANAGEMENT:
• Remove heavily infected leaves
• Ensure good drainage
• Proper spacing (20x20 cm)
• Don't work field when wet

NEXT SEASON:
• Treat seeds with Carbendazim (2g/kg)
• Use resistant varieties (IR64, IR72)
• Balanced NPK fertilization
• Crop rotation if possible

Good news: Caught at moderate stage. Should recover in 2-3 weeks with treatment. Check field every 3-4 days.`,
      
      vi: `🔍 Phát hiện bệnh đốm nâu

⚠️ MỨC TRUNG BÌNH - Xử lý trong 3-5 ngày

NHỮNG GÌ TÔI THẤY:
Đốm nâu hình bầu dục trên lá, viền vàng. Do nấm Bipolaris oryzae. Thường do thiếu dinh dưỡng và nước.

HÀNH ĐỘNG NGAY:
1. Phun thuốc diệt nấm:
   • Tricyclazole 75% WP: 400g/ha, HOẶC
   • Mancozeb 80% WP: 2kg/ha
   • Phun sáng sớm hoặc chiều tối
   • Lặp lại sau 7-10 ngày nếu cần
2. Cải thiện dinh dưỡng:
   • Kali: 30-40 kg K₂O/ha
   • Kẽm sulfat: 25 kg/ha nếu thiếu
3. Quản lý nước:
   • Giữ 3-5 cm ổn định
   • Tránh khô ướt thay đổi

NGUYÊN NHÂN:
• Thiếu dinh dưỡng (kali/silíc)
• Đất kém - bổ sung hữu cơ
• Hạt nhiễm bệnh
• Tưới không đều

QUẢN LÝ:
• Bỏ lá nhiễm nặng
• Thoát nước tốt
• Khoảng cách đúng (20x20 cm)
• Không làm khi ướt

VỤ SAU:
• Xử lý hạt Carbendazim (2g/kg)
• Giống kháng (IR64, IR72)
• Bón NPK cân đối
• Luân canh nếu được

Tin tốt: Phát hiện sớm. Sẽ hồi phục 2-3 tuần nếu xử lý đúng. Kiểm tra mỗi 3-4 ngày.`
    }
  },

  // Golden Apple Snail
  gas: {
    condition: 'Golden Apple Snail Damage',
    severity: 'moderate',
    response: {
      en: `🔍 Golden Apple Snail Damage Detected

⚠️ MODERATE - Critical: First 3 weeks after transplanting

WHAT I SEE:
Damage from Golden Apple Snails cutting young seedlings at base. Can destroy transplanted fields if not controlled.

IMMEDIATE ACTIONS (2-3 days):
1. Manual collection:
   • Collect snails and pink eggs early morning (6-8 AM)
   • Kill in salt water
   • Focus on field edges
2. Chemical control if high density:
   • Niclosamide: 2-3 kg/ha along dikes
   • Metaldehyde pellets: 5-7 kg/ha broadcast
3. Water management:
   • Lower to 2-3 cm (snails prefer deep water)
   • Keep shallow 1-2 weeks after transplanting

PREVENTION:
Before transplanting:
• Drain field 3-5 days before
• Collect all snails and pink eggs
• Plow to bury eggs

During transplanting:
• Use older seedlings (20-25 days)
• Plant 2-3 seedlings per hill
• Maintain 1-3 cm water depth

NATURAL CONTROL:
• Release ducks (5-10 per 1000 m²)
• Plant water spinach on bunds as trap crop
• Encourage fish, birds, fire ants

LONG-TERM:
• Clean irrigation canals
• Coordinate with neighbors
• Remove pink eggs regularly

FARMER TIP:
Spray crushed chili or tobacco water along borders - snails avoid these areas.

Monitor daily first 3 weeks. Look for cut seedlings, pink eggs, and snails on stems.`,
      
      vi: `🔍 Phát hiện tác hại ốc bươu vàng

⚠️ MỨC TRUNG BÌNH - Quan trọng: 3 tuần đầu sau cấy

NHỮNG GÌ TÔI THẤY:
Ốc bươu vàng cắt đứt cây lúa non ở gốc. Có thể phá hủy ruộng vừa cấy nếu không kiểm soát.

HÀNH ĐỘNG NGAY (2-3 ngày):
1. Bắt thủ công:
   • Bắt ốc và trứng hồng sáng sớm (6-8 giờ)
   • Diệt bằng nước muối
   • Tập trung vào mép ruộng
2. Dùng thuốc nếu mật độ cao:
   • Niclosamide: 2-3 kg/ha dọc bờ
   • Viên Metaldehyde: 5-7 kg/ha rải đều
3. Quản lý nước:
   • Hạ xuống 2-3 cm (ốc thích nước sâu)
   • Giữ nông 1-2 tuần sau cấy

PHÒNG NGỪA:
Trước cấy:
• Tháo cạn 3-5 ngày trước
• Bắt hết ốc và trứng hồng
• Cày vùi trứng

Khi cấy:
• Dùng mạ già (20-25 ngày)
• Cấy 2-3 cây/khóm
• Giữ nước 1-3 cm

KIỂM SOÁT TỰ NHIÊN:
• Thả vịt (5-10 con/1000 m²)
• Trồng rau muống bờ làm bẫy
• Khuyến khích cá, chim, kiến lửa

DÀI HẠN:
• Làm sạch mương
• Phối hợp với hàng xóm
• Bỏ trứng hồng thường xuyên

MẸO:
Phun nước ớt hoặc thuốc lá nghiền dọc bờ - ốc tránh vùng này.

Kiểm tra hàng ngày 3 tuần đầu. Tìm cây cắt, trứng hồng, ốc trên thân.`
    }
  },

  // Healthy Rice
  h: {
    condition: 'Healthy Rice Crop',
    severity: 'healthy',
    response: {
      en: `✅ Healthy Rice Crop

🌾 EXCELLENT CONDITION

WHAT I SEE:
Congratulations! Your rice is very healthy:
• Vibrant dark green color (good nitrogen)
• Strong upright stems
• No pest or disease symptoms
• Good density and uniform growth

GROWTH STAGE:
Appears to be vegetative stage (tillering). Critical period for final yield.

MAINTAIN HEALTH:

Nutrients:
• Continue current fertilization
• Monitor leaf color - if lightens, add 20-30 kg N/ha
• Apply potassium at panicle initiation: 30-40 kg K₂O/ha
• Zinc if not applied: 25 kg ZnSO₄/ha

Water:
• Keep 3-5 cm depth in vegetative stage
• Drain 1 week before panicle initiation
• Resume flooding during flowering
• AWD saves 15-30% water

Pest Monitoring:
• Check for stem borers, brown planthopper weekly
• Look for leaf folders and rats
• Scout 20 hills randomly

Weeds:
• Hand-weed or use rotary weeder
• Keep bunds clean

UPCOMING STAGES:

Panicle initiation (2-3 weeks):
• Most critical fertilizer timing
• Apply 30-40 kg N/ha

Flowering (5-6 weeks):
• Keep flooded 3-5 cm
• Sensitive to water stress
• Monitor for pests

HARVEST:
• Drain 10-14 days before
• Harvest at 80-85% golden
• Dry to 14% moisture in 24 hrs

EXPECTED YIELD:
• Good variety: 4-5 tons/ha
• Hybrid: 6-8 tons/ha

Excellent management! Continue weekly monitoring and proper timing.`,
      
      vi: `✅ Lúa khỏe mạnh

🌾 TÌNH TRẠNG XUẤT SẮC

NHỮNG GÌ TÔI THẤY:
Chúc mừng! Lúa rất khỏe:
• Màu xanh đậm tươi (đạm đủ)
• Thân cứng đứng thẳng
• Không sâu bệnh
• Mật độ tốt, đồng đều

GIAI ĐOẠN:
Có vẻ giai đoạn sinh dưỡng (đẻ nhánh). Quan trọng cho năng suất.

DUY TRÌ SỨC KHỎE:

Dinh dưỡng:
• Tiếp tục lịch bón phân
• Theo dõi màu lá - nhạt thì bón 20-30 kg N/ha
• Bón kali khi làm đòng: 30-40 kg K₂O/ha
• Kẽm nếu chưa bón: 25 kg ZnSO₄/ha

Nước:
• Giữ 3-5 cm giai đoạn sinh dưỡng
• Tháo 1 tuần trước làm đòng
• Ngập lại khi trổ
• AWD tiết kiệm 15-30% nước

Giám sát sâu:
• Kiểm tra sâu đục thân, rầy nâu hàng tuần
• Tìm sâu cuốn lá và chuột
• Xem 20 khóm ngẫu nhiên

Cỏ:
• Nhổ tay hoặc dùng cỏ lăn
• Giữ bờ sạch

GIAI ĐOẠN SẮP TỚI:

Làm đòng (2-3 tuần):
• Thời điểm bón phân quan trọng nhất
• Bón 30-40 kg N/ha

Trổ (5-6 tuần):
• Giữ ngập 3-5 cm
• Nhạy cảm với thiếu nước
• Theo dõi sâu

THU HOẠCH:
• Tháo nước 10-14 ngày trước
• Gặt khi 80-85% vàng
• Phơi 14% độ ẩm trong 24 giờ

NĂNG SUẤT DỰ KIẾN:
• Giống tốt: 4-5 tấn/ha
• Lai: 6-8 tấn/ha

Quản lý xuất sắc! Tiếp tục theo dõi hàng tuần.`
    }
  }
};

// Helper function to get response by image filename
export function getImageAnalysisResponse(filename: string): ImageAnalysisResponse | null {
  const lower = filename.toLowerCase();
  
  // Brown Plant Hopper: filename starts with "bph"
  if (lower.startsWith('bph')) return imageAnalysisResponses.bph;
  
  // Golden Apple Snail: filename starts with "gas"
  if (lower.startsWith('gas')) return imageAnalysisResponses.gas;
  
  // Brown Spot: filename starts with "bs"
  if (lower.startsWith('bs')) return imageAnalysisResponses.bs;
  
  // Healthy: filename starts with "h_"
  if (lower.startsWith('h_')) return imageAnalysisResponses.h;
  
  return null;
}
