/**
 * EditPlotModal - Edit plot/field information with regional area unit suggestions
 * 
 * Features:
 * - Regional area unit suggestions based on farm location:
 *   • South Vietnam: Công Lớn (1,300 m²), Công Nhỏ (1,000 m²)
 *   • Central Vietnam: Sào (500 m²)
 *   • North Vietnam: Sào (360 m²)
 * - Option to show all units if preferred unit is not in suggested list
 * - Bilingual support (English/Vietnamese)
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useApp } from './AppContext';

interface EditPlotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmId: string;
  plotId: string;
}

// Vietnamese rice varieties
const RICE_VARIETIES = [
  // Jasmine Rice
  'OM 5451', 'OM 6976', 'OM 9577', 'OM 18',
  // High Yield Varieties  
  'ST 24', 'ST 25', 'ST 21',
  // IR Series (IRRI)
  'IR 50404', 'IR 64', 'IR 36',
  // Aromatic/Premium
  'Jasmine 85', 'Nàng Hoa 9', 'VNR 20',
  // Traditional Vietnamese
  'Nếp Cái Hoa Vàng', 'Tám Thơm', 'Đài Thơm 8',
  // Other popular varieties
  'Khang Dân', 'Nhị Ưu 838', 'Q5', 'MTL 560',
  'Một Bụi Đỏ', 'Xi 23', 'Bắc Hương', 'Sóc Thái',
  'Đốc Phụng', 'Nàng Thơm Chợ Đào', 'Other'
];

// Common soil types in Vietnam for rice farming (bilingual)
const SOIL_TYPES_EN = [
  'Alluvial soil',
  'Clay',
  'Clay loam',
  'Sandy loam',
  'Silty clay',
  'Silty loam',
  'Peat soil',
  'Gray soil',
  'Red basalt soil',
  'Saline soil',
  'Acid sulfate soil',
  'Other'
];

const SOIL_TYPES_VI = [
  'Đất phù sa',
  'Đất sét',
  'Đất sét pha',
  'Đất pha cát',
  'Đất sét bùn',
  'Đất pha bùn',
  'Đất than bùn',
  'Đất xám',
  'Đất bazan đỏ',
  'Đất mặn',
  'Đất phèn',
  'Khác'
];

// Create a mapping between English and Vietnamese soil types
const getSoilTypeTranslation = (soilType: string, toLang: 'EN' | 'VI'): string => {
  const index = toLang === 'VI' 
    ? SOIL_TYPES_EN.indexOf(soilType)
    : SOIL_TYPES_VI.indexOf(soilType);
  
  if (index === -1) return soilType;
  
  return toLang === 'VI' 
    ? SOIL_TYPES_VI[index]
    : SOIL_TYPES_EN[index];
};

// Area units for Vietnamese farmers based on regions
const AREA_UNITS = {
  SOUTH: ['Công Lớn (1,300 m²)', 'Công Nhỏ (1,000 m²)', 'm²'],
  CENTRAL: ['Sào (500 m²)', 'm²'],
  NORTH: ['Sào (360 m²)', 'm²'],
  ALL: ['Công Lớn (1,300 m²)', 'Công Nhỏ (1,000 m²)', 'Sào (500 m²)', 'Sào (360 m²)', 'm²']
};

// Map provinces to regions
const getRegionFromProvince = (location: string): 'SOUTH' | 'CENTRAL' | 'NORTH' => {
  const province = location.split(',')[0]?.trim().toLowerCase() || '';
  
  // Southern provinces (Mekong Delta and Southeast)
  const southProvinces = [
    'an giang', 'cần thơ', 'đồng tháp', 'tiền giang', 'vĩnh long', 
    'bến tre', 'trà vinh', 'sóc trăng', 'bạc liêu', 'cà mau', 
    'kiên giang', 'hậu giang', 'long an', 'tây ninh', 'bình dương',
    'bình phước', 'đồng nai', 'bà rịa - vũng tàu', 'hồ chí minh',
    'tp hồ chí minh', 'tp.hcm', 'sài gòn'
  ];
  
  // Central provinces (Central Coast and Central Highlands)
  const centralProvinces = [
    'thừa thiên huế', 'huế', 'quảng nam', 'quảng ngãi', 'bình định',
    'phú yên', 'khánh hòa', 'ninh thuận', 'bình thuận',
    'đắk lắk', 'đắk nông', 'gia lai', 'kon tum', 'lâm đồng',
    'quảng bình', 'quảng trị', 'hà tĩnh', 'nghệ an', 'thanh hóa'
  ];
  
  // If in south list, return SOUTH
  if (southProvinces.some(p => province.includes(p))) {
    return 'SOUTH';
  }
  
  // If in central list, return CENTRAL
  if (centralProvinces.some(p => province.includes(p))) {
    return 'CENTRAL';
  }
  
  // Otherwise assume NORTH (Red River Delta and Northern Provinces)
  // Includes: Hà Nội, Hải Phòng, Hải Dương, Hưng Yên, Hà Nam, Nam Định, 
  // Thái Bình, Ninh Bình, Bắc Ninh, Vĩnh Phúc, Phú Thọ, etc.
  return 'NORTH';
};

// Get suggested area units based on farm location
const getSuggestedAreaUnits = (location: string): string[] => {
  const region = getRegionFromProvince(location);
  return AREA_UNITS[region];
};

export function EditPlotModal({ open, onOpenChange, farmId, plotId }: EditPlotModalProps) {
  const { user, language, updatePlot } = useApp();
  
  // Find the farm and plot data
  const farm = user?.farms.find(f => f.id === farmId);
  const plot = farm?.plots.find(p => p.id === plotId);
  
  // Get region-based suggested units
  const suggestedUnits = farm ? getSuggestedAreaUnits(farm.location) : AREA_UNITS.ALL;
  const region = farm ? getRegionFromProvince(farm.location) : null;

  // Plot form state
  const [plotForm, setPlotForm] = useState({
    name: '',
    area: '',
    areaUnit: 'm²',
    riceVariety: '',
    sowingDate: '',
    irrigation: '',
    soilType: '',
    notes: ''
  });
  
  // Toggle to show all units or just suggested ones
  const [showAllUnits, setShowAllUnits] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && plot) {
      setPlotForm({
        name: plot.name,
        area: plot.area.toString(),
        areaUnit: plot.areaUnit || 'm²',
        riceVariety: plot.riceVariety,
        sowingDate: plot.sowingDate || '',
        irrigation: plot.irrigation,
        soilType: plot.soilType || '',
        notes: ''
      });
      // Reset to show suggested units by default
      setShowAllUnits(false);
    }
  }, [open, plot]);

  const handleSave = () => {
    // Validation
    if (!plotForm.name.trim()) {
      toast.error(t.plotNameRequired);
      return;
    }
    if (!plotForm.area || parseFloat(plotForm.area) <= 0) {
      toast.error(t.areaRequired);
      return;
    }
    if (!plotForm.riceVariety) {
      toast.error(t.varietyRequired);
      return;
    }
    if (!plotForm.soilType) {
      toast.error(t.soilTypeRequired);
      return;
    }

    // Update plot via context
    if (updatePlot) {
      updatePlot(farmId, plotId, {
        name: plotForm.name,
        area: parseFloat(plotForm.area),
        areaUnit: plotForm.areaUnit,
        riceVariety: plotForm.riceVariety,
        sowingDate: plotForm.sowingDate,
        irrigation: plotForm.irrigation,
        soilType: plotForm.soilType
      });
      toast.success(t.successMessage);
      onOpenChange(false);
    }
  };

  const texts = {
    EN: {
      title: 'Edit Plot Information',
      subtitle: 'Update plot details and crop information',
      plotInfo: 'Plot Information',
      plotName: 'Plot Name',
      plotNamePlaceholder: 'e.g., Plot A',
      area: 'Area',
      areaPlaceholder: 'Enter area value',
      areaHelper: 'Select the unit you prefer to use for measuring your field area.',
      areaHelperSouth: 'Common units in South Vietnam: Công Lớn and Công Nhỏ',
      areaHelperCentral: 'Common unit in Central Vietnam: Sào (500 m²)',
      areaHelperNorth: 'Common unit in North Vietnam: Sào (360 m²)',
      allUnits: 'Show all units',
      riceVariety: 'Rice Variety',
      selectVariety: 'Select variety',
      sowingDate: 'Sowing Date',
      selectDate: 'Select date',
      irrigation: 'Irrigation Type',
      selectIrrigation: 'Select irrigation type',
      flood: 'Flood',
      sprinkler: 'Sprinkler',
      drip: 'Drip',
      rainfed: 'Rainfed',
      soilType: 'Soil Type',
      soilPlaceholder: 'e.g., Clay loam',
      notes: 'Notes',
      plotNotesPlaceholder: 'Add any observations or remarks...',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      successMessage: '✅ Plot details updated successfully.',
      plotNameRequired: '⚠️ Plot name is required.',
      areaRequired: '⚠️ Area is required and must be greater than 0.',
      varietyRequired: '⚠️ Rice variety is required.',
      soilTypeRequired: '⚠️ Soil type is required.',
      selectSoilType: 'Select soil type',
      optional: '(optional)'
    },
    VI: {
      title: 'Chỉnh Sửa Thông Tin Lô Đất',
      subtitle: 'Cập nhật chi tiết lô đất và thông tin cây trồng',
      plotInfo: 'Thông Tin Lô Đất',
      plotName: 'Tên Lô Đất',
      plotNamePlaceholder: 'vd: Lô A',
      area: 'Diện Tích',
      areaPlaceholder: 'Nhập giá trị diện tích',
      areaHelper: 'Chọn đơn vị bạn muốn sử dụng để đo diện tích ruộng.',
      areaHelperSouth: 'Đơn vị phổ biến ở miền Nam: Công Lớn và Công Nhỏ',
      areaHelperCentral: 'Đơn vị phổ biến ở miền Trung: Sào (500 m²)',
      areaHelperNorth: 'Đơn vị phổ biến ở miền Bắc: Sào (360 m²)',
      allUnits: 'Hiện tất cả đơn vị',
      riceVariety: 'Giống Lúa',
      selectVariety: 'Chọn giống lúa',
      sowingDate: 'Ngày Gieo',
      selectDate: 'Chọn ngày',
      irrigation: 'Hệ Thống Tưới',
      selectIrrigation: 'Chọn hệ thống tưới',
      flood: 'Ngập nước',
      sprinkler: 'Tưới phun',
      drip: 'Tưới nhỏ giọt',
      rainfed: 'Nước mưa',
      soilType: 'Loại Đất',
      soilPlaceholder: 'vd: Đất phù sa',
      notes: 'Ghi Chú',
      plotNotesPlaceholder: 'Thêm ghi chú hoặc quan sát...',
      cancel: 'Hủy',
      saveChanges: 'Lưu Thay Đổi',
      successMessage: '✅ Đã cập nhật thông tin lô đất.',
      plotNameRequired: '⚠️ Tên lô đất là bắt buộc.',
      areaRequired: '⚠️ Diện tích là bắt buộc và phải lớn hơn 0.',
      varietyRequired: '⚠️ Giống lúa là bắt buộc.',
      soilTypeRequired: '⚠️ Loại đất là bắt buộc.',
      selectSoilType: 'Chọn loại đất',
      optional: '(tùy chọn)'
    }
  };

  const t = texts[language];
  
  // Get soil types in current language
  const soilTypes = language === 'VI' ? SOIL_TYPES_VI : SOIL_TYPES_EN;

  if (!plot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="heading-md flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {t.title}
              </DialogTitle>
              <DialogDescription className="text-responsive-sm">
                {t.subtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Plot Information */}
              <div className="space-y-4">
                <h3 className="text-responsive-lg font-medium text-gray-900">{t.plotInfo}</h3>
                
                {/* Plot Name */}
                <div className="space-y-2">
                  <Label htmlFor="plot-name" className="text-responsive-base">
                    {t.plotName}
                  </Label>
                  <Input
                    id="plot-name"
                    value={plotForm.name}
                    onChange={(e) => setPlotForm({ ...plotForm, name: e.target.value })}
                    placeholder={t.plotNamePlaceholder}
                    className="farmer-input"
                  />
                </div>

                {/* Area with Unit Selector */}
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-responsive-base">
                    {t.area}
                  </Label>
                  <div className="flex flex-col min-[481px]:flex-row gap-2">
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      min="0"
                      value={plotForm.area}
                      onChange={(e) => setPlotForm({ ...plotForm, area: e.target.value })}
                      placeholder={t.areaPlaceholder}
                      className="farmer-input flex-1 min-[481px]:w-[60%]"
                      style={{ 
                        height: '44px',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: 'clamp(14px, 1.6vw, 16px)'
                      }}
                    />
                    <Select 
                      value={plotForm.areaUnit} 
                      onValueChange={(value) => setPlotForm({ ...plotForm, areaUnit: value })}
                    >
                      <SelectTrigger 
                        className="farmer-input flex-1 min-[481px]:w-[40%]"
                        style={{ 
                          height: '44px',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: 'clamp(14px, 1.6vw, 16px)'
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(showAllUnits ? AREA_UNITS.ALL : suggestedUnits).map((unit, index) => (
                          <SelectItem key={`${unit}-${index}`} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-start justify-between gap-2 mt-1">
                    <p className="text-xs text-gray-500 flex-1">
                      {region === 'SOUTH' ? t.areaHelperSouth : 
                       region === 'CENTRAL' ? t.areaHelperCentral : 
                       region === 'NORTH' ? t.areaHelperNorth : 
                       t.areaHelper}
                    </p>
                    {!showAllUnits && (
                      <button
                        type="button"
                        onClick={() => setShowAllUnits(true)}
                        className="text-xs text-green-600 hover:text-green-700 underline whitespace-nowrap"
                      >
                        {t.allUnits}
                      </button>
                    )}
                  </div>
                </div>

                {/* Rice Variety */}
                <div className="space-y-2">
                  <Label htmlFor="variety" className="text-responsive-base">
                    {t.riceVariety}
                  </Label>
                  <Select value={plotForm.riceVariety} onValueChange={(value) => setPlotForm({ ...plotForm, riceVariety: value })}>
                    <SelectTrigger className="farmer-input">
                      <SelectValue placeholder={t.selectVariety} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {RICE_VARIETIES.map((variety, index) => (
                        <SelectItem key={`${variety}-${index}`} value={variety}>
                          {variety}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sowing Date */}
                <div className="space-y-2">
                  <Label htmlFor="sowing-date" className="text-responsive-base">
                    {t.sowingDate} <span className="text-gray-400">{t.optional}</span>
                  </Label>
                  <Input
                    id="sowing-date"
                    type="date"
                    value={plotForm.sowingDate}
                    onChange={(e) => setPlotForm({ ...plotForm, sowingDate: e.target.value })}
                    className="farmer-input"
                  />
                </div>

                {/* Irrigation Type */}
                <div className="space-y-2">
                  <Label htmlFor="irrigation" className="text-responsive-base">
                    {t.irrigation}
                  </Label>
                  <Select value={plotForm.irrigation} onValueChange={(value) => setPlotForm({ ...plotForm, irrigation: value })}>
                    <SelectTrigger className="farmer-input">
                      <SelectValue placeholder={t.selectIrrigation} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flood">{t.flood}</SelectItem>
                      <SelectItem value="Sprinkler">{t.sprinkler}</SelectItem>
                      <SelectItem value="Drip">{t.drip}</SelectItem>
                      <SelectItem value="Rainfed">{t.rainfed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Soil Type */}
                <div className="space-y-2">
                  <Label htmlFor="soil-type" className="text-responsive-base">
                    {t.soilType}
                  </Label>
                  <Select 
                    value={language === 'VI' ? getSoilTypeTranslation(plotForm.soilType, 'VI') : plotForm.soilType} 
                    onValueChange={(value) => {
                      // Store in English for consistency
                      const englishValue = language === 'VI' ? getSoilTypeTranslation(value, 'EN') : value;
                      setPlotForm({ ...plotForm, soilType: englishValue });
                    }}
                  >
                    <SelectTrigger className="farmer-input">
                      <SelectValue placeholder={t.selectSoilType} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {soilTypes.map((soil, index) => (
                        <SelectItem key={`${soil}-${index}`} value={soil}>
                          {soil}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleSave} className="farmer-button flex-1">
                  {t.saveChanges}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="farmer-button sm:flex-initial"
                >
                  {t.cancel}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
