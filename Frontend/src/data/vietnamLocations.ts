// Vietnamese Mekong Delta Provinces with Districts and Communes
// Focused on rice-farming regions

export interface Commune {
  name: string;
}

export interface District {
  name: string;
  communes: Commune[];
}

export interface Province {
  name: string;
  districts: District[];
}

export const vietnamLocations: Province[] = [
  {
    name: "An Giang",
    districts: [
      {
        name: "Châu Đốc",
        communes: [
          { name: "Châu Phú B" },
          { name: "Núi Sam" },
          { name: "Vĩnh Mỹ" },
          { name: "Vĩnh Ngươn" },
          { name: "Vĩnh Tế" }
        ]
      },
      {
        name: "Chợ Mới",
        communes: [
          { name: "Bình Phước Xuân" },
          { name: "Long Điền A" },
          { name: "Long Điền B" },
          { name: "Tấn Mỹ" },
          { name: "Hội An" }
        ]
      },
      {
        name: "Long Xuyên",
        communes: [
          { name: "Mỹ Bình" },
          { name: "Mỹ Long" },
          { name: "Mỹ Phước" },
          { name: "Mỹ Thạnh" },
          { name: "Mỹ Hòa" }
        ]
      },
      {
        name: "Thoại Sơn",
        communes: [
          { name: "Thoại Sơn" },
          { name: "Phú Hoà" },
          { name: "Vĩnh Chánh" },
          { name: "Định Mỹ" },
          { name: "Định Thành" }
        ]
      }
    ]
  },
  {
    name: "Cần Thơ",
    districts: [
      {
        name: "Ninh Kiều",
        communes: [
          { name: "Cái Khế" },
          { name: "An Hòa" },
          { name: "Thới Bình" },
          { name: "An Nghiệp" },
          { name: "An Cư" }
        ]
      },
      {
        name: "Ô Môn",
        communes: [
          { name: "Châu Văn Liêm" },
          { name: "Thới An Đông" },
          { name: "Long Hưng" },
          { name: "Phước Thới" },
          { name: "Trường Lạc" }
        ]
      },
      {
        name: "Phong Điền",
        communes: [
          { name: "Mỹ Khánh" },
          { name: "Nhơn Ái" },
          { name: "Nhơn Nghĩa" },
          { name: "Trường Long" },
          { name: "Giai Xuân" }
        ]
      },
      {
        name: "Thốt Nốt",
        communes: [
          { name: "Thốt Nốt" },
          { name: "Thuận An" },
          { name: "Tân Lộc" },
          { name: "Thới Thuận" },
          { name: "Trung Nhứt" }
        ]
      }
    ]
  },
  {
    name: "Đồng Tháp",
    districts: [
      {
        name: "Cao Lãnh",
        communes: [
          { name: "Mỹ Ngãi" },
          { name: "Mỹ Tân" },
          { name: "Mỹ Trà" },
          { name: "Phương Thịnh" },
          { name: "Tân Thuận Tây" }
        ]
      },
      {
        name: "Hồng Ngự",
        communes: [
          { name: "An Bình" },
          { name: "An Lạc" },
          { name: "Bình Thành" },
          { name: "Tân Hội" },
          { name: "Thường Thới Hậu A" }
        ]
      },
      {
        name: "Sa Đéc",
        communes: [
          { name: "Tân Khánh Đông" },
          { name: "Tân Phú Đông" },
          { name: "Tân Quy Đông" },
          { name: "Tân Quy Tây" },
          { name: "An Hoà" }
        ]
      },
      {
        name: "Tân Hồng",
        communes: [
          { name: "Tân Hồng" },
          { name: "Tân Thành" },
          { name: "Thông Bình" },
          { name: "Tân Công Sính" },
          { name: "An Phước" }
        ]
      }
    ]
  },
  {
    name: "Kiên Giang",
    districts: [
      {
        name: "Rạch Giá",
        communes: [
          { name: "Vĩnh Lạc" },
          { name: "Vĩnh Bảo" },
          { name: "Vĩnh Thanh Vân" },
          { name: "Phi Thông" },
          { name: "Vĩnh Quang" }
        ]
      },
      {
        name: "Hòn Đất",
        communes: [
          { name: "Bình Giang" },
          { name: "Bình Sơn" },
          { name: "Sơn Bình" },
          { name: "Mỹ Thái" },
          { name: "Mỹ Hiệp" }
        ]
      },
      {
        name: "Giồng Riềng",
        communes: [
          { name: "Ngọc Thành" },
          { name: "Ngọc Chúc" },
          { name: "Ngọc Thuận" },
          { name: "Thạnh Hưng" },
          { name: "Vĩnh Phú" }
        ]
      },
      {
        name: "Gò Quao",
        communes: [
          { name: "Định An" },
          { name: "Thới Quản" },
          { name: "Trường Long Tây" },
          { name: "Vĩnh Hòa Hưng Bắc" },
          { name: "Vĩnh Phước A" }
        ]
      }
    ]
  },
  {
    name: "Long An",
    districts: [
      {
        name: "Tân An",
        communes: [
          { name: "Khánh Hậu" },
          { name: "Lợi Bình Nhơn" },
          { name: "Nhơn Thạnh Trung" },
          { name: "Tân Khanh" },
          { name: "Hướng Thọ Phú" }
        ]
      },
      {
        name: "Đức Huệ",
        communes: [
          { name: "Bình Hòa Tây" },
          { name: "Bình Hòa Trung" },
          { name: "Bình Hòa Đông" },
          { name: "Mỹ Bình" },
          { name: "Đức Lập Hạ" }
        ]
      },
      {
        name: "Mộc Hóa",
        communes: [
          { name: "Bình Hòa Hưng" },
          { name: "Bình Hòa Tây" },
          { name: "Bình Tân" },
          { name: "Tân Lập" },
          { name: "Tân Thành" }
        ]
      },
      {
        name: "Vĩnh Hưng",
        communes: [
          { name: "Hưng Điền A" },
          { name: "Hưng Điền B" },
          { name: "Khánh Hưng" },
          { name: "Thái Bình Trung" },
          { name: "Vĩnh Bửu" }
        ]
      }
    ]
  },
  {
    name: "Tiền Giang",
    districts: [
      {
        name: "Mỹ Tho",
        communes: [
          { name: "Tân Long" },
          { name: "Phước Thạnh" },
          { name: "Trung An" },
          { name: "Mỹ Phong" },
          { name: "Tân Mỹ Chánh" }
        ]
      },
      {
        name: "Cai Lậy",
        communes: [
          { name: "Mỹ Hạnh Đông" },
          { name: "Mỹ Hạnh Trung" },
          { name: "Tân Bình" },
          { name: "Tân Hội" },
          { name: "Nhị Quý" }
        ]
      },
      {
        name: "Cái Bè",
        communes: [
          { name: "An Cư" },
          { name: "An Hữu" },
          { name: "An Thái Đông" },
          { name: "Hậu Mỹ Bắc A" },
          { name: "Mỹ Trung" }
        ]
      },
      {
        name: "Gò Công",
        communes: [
          { name: "Bình Nhì" },
          { name: "Bình Tân" },
          { name: "Long Bình Điền" },
          { name: "Tân Điền" },
          { name: "Vĩnh Hựu" }
        ]
      }
    ]
  },
  {
    name: "Bến Tre",
    districts: [
      {
        name: "Bến Tre",
        communes: [
          { name: "Phú Khánh" },
          { name: "Phú Nhuận" },
          { name: "Mỹ Thạnh An" },
          { name: "Nhơn Thạnh" },
          { name: "Sơn Đông" }
        ]
      },
      {
        name: "Châu Thành",
        communes: [
          { name: "Giao Hòa" },
          { name: "Giao Long" },
          { name: "Phú Túc" },
          { name: "Tân Phú" },
          { name: "Tiên Long" }
        ]
      },
      {
        name: "Mỏ Cày Bắc",
        communes: [
          { name: "Hòa Lộc" },
          { name: "Phú Mỹ" },
          { name: "Tân Bình" },
          { name: "Tân Thành Bình" },
          { name: "Thành An" }
        ]
      },
      {
        name: "Giồng Trôm",
        communes: [
          { name: "Bình Hoà" },
          { name: "Châu Bình" },
          { name: "Long Mỹ" },
          { name: "Mỹ Thạnh" },
          { name: "Tân Hào" }
        ]
      }
    ]
  },
  {
    name: "Trà Vinh",
    districts: [
      {
        name: "Trà Vinh",
        communes: [
          { name: "Long Đức" },
          { name: "Ngãi Xuyên" },
          { name: "Nhị Long" },
          { name: "Phước Hưng" },
          { name: "Vĩnh Phước" }
        ]
      },
      {
        name: "Càng Long",
        communes: [
          { name: "An Trường" },
          { name: "An Trường A" },
          { name: "Đức Mỹ" },
          { name: "Mỹ Cẩm" },
          { name: "Nhị Long Phú" }
        ]
      },
      {
        name: "Tiểu Cần",
        communes: [
          { name: "Hiếu Tử" },
          { name: "Long Thới" },
          { name: "Phú Cần" },
          { name: "Tân Hùng" },
          { name: "Hiếu Trung" }
        ]
      },
      {
        name: "Châu Thành",
        communes: [
          { name: "Hòa Lợi" },
          { name: "Hòa Minh" },
          { name: "Song Lộc" },
          { name: "Thanh Mỹ" },
          { name: "Hòa Tân" }
        ]
      }
    ]
  },
  {
    name: "Vĩnh Long",
    districts: [
      {
        name: "Vĩnh Long",
        communes: [
          { name: "Tân Hòa" },
          { name: "Tân Hội" },
          { name: "Tân Ngãi" },
          { name: "Trường An" },
          { name: "Tân An" }
        ]
      },
      {
        name: "Bình Minh",
        communes: [
          { name: "Cái Vồn" },
          { name: "Đông Bình" },
          { name: "Đông Thạnh" },
          { name: "Mỹ Hòa" },
          { name: "Thuận An" }
        ]
      },
      {
        name: "Long Hồ",
        communes: [
          { name: "An Bình" },
          { name: "Đồng Phú" },
          { name: "Hòa Ninh" },
          { name: "Lộc Hòa" },
          { name: "Long Phước" }
        ]
      },
      {
        name: "Tam Bình",
        communes: [
          { name: "Hậu Lộc" },
          { name: "Loan Mỹ" },
          { name: "Mỹ Lộc" },
          { name: "Phú Thịnh" },
          { name: "Song Phú" }
        ]
      }
    ]
  },
  {
    name: "Hậu Giang",
    districts: [
      {
        name: "Vị Thanh",
        communes: [
          { name: "Hòa An" },
          { name: "Hòa Tiến" },
          { name: "Tân Tiến" },
          { name: "Vị Tân" },
          { name: "Vị Thành" }
        ]
      },
      {
        name: "Châu Thành",
        communes: [
          { name: "Hòa Mỹ" },
          { name: "Long Thạnh" },
          { name: "Phú An" },
          { name: "Phú Hữu" },
          { name: "Phú Tân" }
        ]
      },
      {
        name: "Ngã Bảy",
        communes: [
          { name: "Đại Thành" },
          { name: "Hiệp Lợi" },
          { name: "Hiệp Thành" },
          { name: "Tân Thành" },
          { name: "Đăng Hưng Phước" }
        ]
      },
      {
        name: "Phụng Hiệp",
        communes: [
          { name: "Bình Thành" },
          { name: "Hòa Mỹ" },
          { name: "Hòa An" },
          { name: "Long Thạnh" },
          { name: "Phụng Hiệp" }
        ]
      }
    ]
  },
  {
    name: "Sóc Trăng",
    districts: [
      {
        name: "Sóc Trăng",
        communes: [
          { name: "Phường 1" },
          { name: "Phường 2" },
          { name: "Phường 5" },
          { name: "Phường 7" },
          { name: "Phường 10" }
        ]
      },
      {
        name: "Kế Sách",
        communes: [
          { name: "An Lạc Thôn" },
          { name: "Kế An" },
          { name: "Kế Thành" },
          { name: "Xuân Hòa" },
          { name: "Đại Hải" }
        ]
      },
      {
        name: "Mỹ Tú",
        communes: [
          { name: "Hòa Tú 1" },
          { name: "Hòa Tú 2" },
          { name: "Phú Mỹ" },
          { name: "Thuận Hòa" },
          { name: "Tường Lộc" }
        ]
      },
      {
        name: "Châu Thành",
        communes: [
          { name: "Hòa Đông" },
          { name: "Phú Tâm" },
          { name: "Phú Tân" },
          { name: "Thiện Mỹ" },
          { name: "An Hiệp" }
        ]
      }
    ]
  },
  {
    name: "Bạc Liêu",
    districts: [
      {
        name: "Bạc Liêu",
        communes: [
          { name: "Hiệp Thành" },
          { name: "Nhà Mát" },
          { name: "Phú Hưng" },
          { name: "Vĩnh Trạch" },
          { name: "Vĩnh Trạch Đông" }
        ]
      },
      {
        name: "Hồng Dân",
        communes: [
          { name: "Lộc Ninh" },
          { name: "Ninh Hòa" },
          { name: "Ninh Quới" },
          { name: "Ninh Thạnh Lợi" },
          { name: "Thuận Hòa" }
        ]
      },
      {
        name: "Giá Rai",
        communes: [
          { name: "Lương Nghĩa" },
          { name: "Lương Tâm" },
          { name: "Phong Thạnh Tây A" },
          { name: "Tân Phong" },
          { name: "Phong Tân" }
        ]
      },
      {
        name: "Phước Long",
        communes: [
          { name: "Hưng Phú" },
          { name: "Phước Long" },
          { name: "Vĩnh Phú Đông" },
          { name: "Vĩnh Phú Tây" },
          { name: "Vĩnh Thanh" }
        ]
      }
    ]
  },
  {
    name: "Cà Mau",
    districts: [
      {
        name: "Cà Mau",
        communes: [
          { name: "An Xuyên" },
          { name: "Tân Thành" },
          { name: "Tân Xuyên" },
          { name: "Tắc Vân" },
          { name: "Lý Văn Lâm" }
        ]
      },
      {
        name: "Đầm Dơi",
        communes: [
          { name: "Nguyễn Huân" },
          { name: "Quách Phẩm" },
          { name: "Quách Phẩm Bắc" },
          { name: "Tân Dân" },
          { name: "Tân Tiến" }
        ]
      },
      {
        name: "Năm Căn",
        communes: [
          { name: "Hàm Rồng" },
          { name: "Hiệp Tùng" },
          { name: "Lâm Hải" },
          { name: "Tam Giang" },
          { name: "Tam Giang Đông" }
        ]
      },
      {
        name: "Thới Bình",
        communes: [
          { name: "Biển Bạch" },
          { name: "Biển Bạch Đông" },
          { name: "Hồ Thị Kỷ" },
          { name: "Thới Bình" },
          { name: "Trí Lực" }
        ]
      }
    ]
  }
];

// Helper function to get districts by province
export function getDistrictsByProvince(provinceName: string): string[] {
  const province = vietnamLocations.find(p => p.name === provinceName);
  return province?.districts.map(d => d.name) || [];
}

// Helper function to get communes by province and district
export function getCommunesByDistrict(provinceName: string, districtName: string): string[] {
  const province = vietnamLocations.find(p => p.name === provinceName);
  const district = province?.districts.find(d => d.name === districtName);
  return district?.communes.map(c => c.name) || [];
}

// Get all province names
export function getProvinceNames(): string[] {
  return vietnamLocations.map(p => p.name);
}
