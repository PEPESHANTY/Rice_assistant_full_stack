import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useApp } from './AppContext';
import { EditFarmModal } from './EditFarmModal';
import { EditPlotModal } from './EditPlotModal';
import { 
  User, 
  MapPin, 
  Phone, 
  Plus, 
  Edit, 
  Save, 
  X,
  Camera,
  Trash2,
  Leaf,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  vietnamLocations, 
  getDistrictsByProvince, 
  getCommunesByDistrict 
} from '../data/vietnamLocations';
import { farmsAPI, authAPI, plotsAPI } from '../services/api';

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
  
  // Otherwise assume NORTH
  return 'NORTH';
};

// Get suggested area units based on farm location
const getSuggestedAreaUnits = (location: string): string[] => {
  const region = getRegionFromProvince(location);
  return AREA_UNITS[region];
};

export function Profile() {
  const { user, updateUser, language, fontSize, setFontSize } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    language: user?.language || 'EN'
  });

  const [newFarm, setNewFarm] = useState({
    name: '',
    province: '',
    district: '',
    commune: ''
  });

  const [newPlot, setNewPlot] = useState({
    farmId: '',
    name: '',
    soilType: '',
    riceVariety: '',
    sowingDate: '',
    harvestDate: '',
    irrigation: '',
    area: '',
    areaUnit: 'm²',
    notes: ''
  });

  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [showEditFarmModal, setShowEditFarmModal] = useState(false);
  const [showEditPlotModal, setShowEditPlotModal] = useState(false);
  const [editFarmId, setEditFarmId] = useState<string | null>(null);
  const [editPlotId, setEditPlotId] = useState<string | null>(null);
  const [showAllUnitsAddPlot, setShowAllUnitsAddPlot] = useState(false);
  const [isSubmittingFarm, setIsSubmittingFarm] = useState(false);
  const [isSubmittingPlot, setIsSubmittingPlot] = useState(false);

  const texts = {
    EN: {
      profile: 'Profile',
      personalInfo: 'Personal Information',
      accessibility: 'Accessibility',
      accessibilityDesc: 'Adjust text size for better readability',
      textSize: 'Text Size',
      small: 'Small',
      default: 'Default',
      large: 'Large',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      language: 'Preferred Language',
      english: 'English',
      vietnamese: 'Vietnamese',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      myFarmsPlots: 'My Farms & Plots',
      addFarm: 'Add Farm',
      addPlot: 'Add Plot',
      farmName: 'Farm Name',
      province: 'Province',
      district: 'District',
      commune: 'Commune',
      plotName: 'Plot Name',
      soilType: 'Soil Type',
      riceVariety: 'Rice Variety',
      sowingDate: 'Sowing Date',
      harvestDate: 'Expected Harvest Date',
      irrigation: 'Irrigation Method',
      area: 'Area (sào)',
      notes: 'Notes',
      clayLoam: 'Clay Loam',
      alluvial: 'Alluvial',
      sandy: 'Sandy',
      floodIrrigation: 'Flood Irrigation',
      dripIrrigation: 'Drip Irrigation',
      sprinkler: 'Sprinkler',
      photos: 'Photos',
      addPhotos: 'Add Photos',
      noFarms: 'No farms added yet',
      farmDetails: 'Farm Details',
      plotDetails: 'Plot Details',
      selectProvinceFirst: 'Please select a province first',
      selectDistrictFirst: 'Please select a district first',
      selectProvincePlaceholder: 'Select province',
      selectDistrictPlaceholder: 'Select district',
      selectCommunePlaceholder: 'Select commune',
      personalInfoDesc: 'Manage your account information',
      personalInfoSubDesc: 'Update your personal details and preferences',
      preview: 'Preview',
      previewText: 'This is how text will appear in the app.',
      farmsDesc: 'Manage your farms and plots',
      notProvided: 'Not provided',
      profileUpdated: 'Profile updated successfully!',
      profileDescription: 'Manage your account and farm information',
      plots: 'plots',
      editFarm: 'Edit Farm',
      noPlots: 'No plots in this farm',
      soil: 'Soil',
      sowing: 'Sowing',
      farm: 'Farm',
      selectFarm: 'Select farm',
      plotNamePlaceholder: 'e.g., Plot A',
      selectIrrigationMethod: 'Select irrigation method',
      notesPlaceholder: 'Additional notes about this plot...'
    },
    VI: {
      profile: 'Hồ Sơ',
      personalInfo: 'Thông Tin Cá Nhân',
      accessibility: 'Khả Năng Truy Cập',
      accessibilityDesc: 'Điều chỉnh kích thước chữ để dễ đọc hơn',
      textSize: 'Kích Thước Chữ',
      small: 'Nhỏ',
      default: 'Mặc Định',
      large: 'Lớn',
      name: 'Họ và Tên',
      email: 'Thư Điện Tử',
      phone: 'Số Điện Thoại',
      language: 'Ngôn Ngữ Ưa Thích',
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt',
      edit: 'Chỉnh Sửa',
      save: 'Lưu',
      cancel: 'Hủy',
      myFarmsPlots: 'Trang Trại & Lô Đất',
      addFarm: 'Thêm Trang Trại',
      addPlot: 'Thêm Lô Đất',
      farmName: 'Tên Trang Trại',
      province: 'Tỉnh/Thành phố',
      district: 'Quận/Huyện',
      commune: 'Phường/Xã',
      plotName: 'Tên Lô Đất',
      soilType: 'Loại Đất',
      riceVariety: 'Giống Lúa',
      sowingDate: 'Ngày Gieo',
      harvestDate: 'Ngày Thu Hoạch Dự Kiến',
      irrigation: 'Phương Pháp Tưới',
      area: 'Diện Tích (sào)',
      notes: 'Ghi Chú',
      clayLoam: 'Đất Sét Pha',
      alluvial: 'Đất Phù Sa',
      sandy: 'Đất Cát',
      floodIrrigation: 'Tưới Ngập',
      dripIrrigation: 'Tưới Nhỏ Giọt',
      sprinkler: 'Tưới Phun',
      photos: 'Hình Ảnh',
      addPhotos: 'Thêm Hình Ảnh',
      noFarms: 'Chưa có trang trại nào',
      farmDetails: 'Chi Tiết Trang Trại',
      plotDetails: 'Chi Tiết Lô Đất',
      selectProvinceFirst: 'Vui lòng chọn tỉnh/thành trước',
      selectDistrictFirst: 'Vui lòng chọn quận/huyện trước',
      selectProvincePlaceholder: 'Chọn tỉnh/thành',
      selectDistrictPlaceholder: 'Chọn quận/huyện',
      selectCommunePlaceholder: 'Chọn phường/xã',
      personalInfoDesc: 'Quản lý thông tin tài khoản',
      personalInfoSubDesc: 'Cập nhật thông tin cá nhân và tùy chọn',
      preview: 'Xem Trước',
      previewText: 'Đây là cách văn bản sẽ xuất hiện trong ứng dụng.',
      farmsDesc: 'Quản lý trang trại và lô đất',
      notProvided: 'Chưa cung cấp',
      profileUpdated: 'Đã cập nhật hồ sơ thành công!',
      profileDescription: 'Quản lý thông tin tài khoản và trang trại',
      plots: 'lô đất',
      editFarm: 'Sửa Trang Trại',
      noPlots: 'Chưa có lô đất trong trang trại này',
      soil: 'Đất',
      sowing: 'Gieo',
      farm: 'Trang Trại',
      selectFarm: 'Chọn trang trại',
      plotNamePlaceholder: 'vd: Lô A',
      selectIrrigationMethod: 'Chọn phương pháp tưới',
      notesPlaceholder: 'Ghi chú thêm về lô đất này...'
    }
  };

  const t = texts[language];

  const handleSaveProfile = () => {
    updateUser(editForm);
    setIsEditing(false);
    toast.success(t.profileUpdated);
  };

  const handleAddFarm = async () => {
    if (!newFarm.name || !newFarm.province || !newFarm.district || !newFarm.commune) {
      toast.error(
        language === 'EN' 
          ? 'Please fill in all farm details' 
          : 'Vui lòng điền đầy đủ thông tin trang trại'
      );
      return;
    }

    setIsSubmittingFarm(true);
    try {
      const farmData = {
        name: newFarm.name,
        province: newFarm.province,
        district: newFarm.district,
        addressText: `${newFarm.commune}, ${newFarm.district}, ${newFarm.province}`
      };

      const response = await farmsAPI.createFarm(farmData);
      
      // Reload user data to get the updated farms from backend
      const userData = await authAPI.getCurrentUser();
      const farms = await farmsAPI.getFarms();
      const plots = await plotsAPI.getPlots();
      
      // Transform API data to match our interface
      const updatedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email || '',
        phone: userData.phone,
        language: userData.language === 'en' ? 'EN' : 'VI',
        fontSize: userData.font_scale as 'small' | 'default' | 'large' || 'default',
        farms: farms.map((farm: any) => ({
          id: farm.id,
          name: farm.name,
          location: farm.addressText || `${farm.province || ''}, ${farm.district || ''}`.trim(),
          plots: plots.filter((plot: any) => plot.farmId === farm.id).map((plot: any) => ({
            id: plot.id,
            name: plot.name,
            soilType: plot.soil_type || '',
            riceVariety: plot.variety || '',
            sowingDate: plot.planting_date || '',
            harvestDate: plot.harvest_date || '',
            irrigation: plot.irrigation_method || '',
            area: plot.area_m2 || 0,
            areaUnit: 'm²',
            photos: plot.photos || []
          }))
        }))
      };
      
      updateUser(updatedUser);
      setNewFarm({ name: '', province: '', district: '', commune: '' });
      setShowAddFarm(false);
      toast.success(
        language === 'EN' 
          ? 'Farm added successfully!' 
          : 'Đã thêm trang trại thành công!'
      );
    } catch (error) {
      console.error('Failed to create farm:', error);
      toast.error(
        language === 'EN' 
          ? 'Failed to create farm. Please try again.' 
          : 'Không thể tạo trang trại. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmittingFarm(false);
    }
  };

  const handleAddPlot = async () => {
    if (!newPlot.farmId || !newPlot.name || !newPlot.soilType || !newPlot.riceVariety) {
      toast.error('Please fill in all required plot details');
      return;
    }

    // Check if sowing date is later than harvest date
    if (newPlot.sowingDate && newPlot.harvestDate) {
      const sowingDate = new Date(newPlot.sowingDate);
      const harvestDate = new Date(newPlot.harvestDate);
      
      if (sowingDate > harvestDate) {
        toast.error(
          language === 'EN' 
            ? 'Sowing date cannot be later than harvest date. Please check your dates.'
            : 'Ngày gieo không thể sau ngày thu hoạch. Vui lòng kiểm tra lại ngày tháng.'
        );
        return;
      }
    }

    setIsSubmittingPlot(true);
    try {
      const plotData = {
        farmId: newPlot.farmId,
        name: newPlot.name,
        area_m2: parseFloat(newPlot.area) || 0,
        soil_type: newPlot.soilType,
        variety: newPlot.riceVariety,
        planting_date: newPlot.sowingDate || null,
        harvest_date: newPlot.harvestDate || null,
        irrigation_method: newPlot.irrigation,
        notes: newPlot.notes,
        photos: []
      };

      const response = await plotsAPI.createPlot(plotData);
      
      // Reload user data to get the updated plots from backend
      const userData = await authAPI.getCurrentUser();
      const farms = await farmsAPI.getFarms();
      const plots = await plotsAPI.getPlots();
      
      // Transform API data to match our interface
      const updatedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email || '',
        phone: userData.phone,
        language: userData.language === 'en' ? 'EN' : 'VI',
        fontSize: userData.font_scale as 'small' | 'default' | 'large' || 'default',
        farms: farms.map((farm: any) => ({
          id: farm.id,
          name: farm.name,
          location: farm.addressText || `${farm.province || ''}, ${farm.district || ''}`.trim(),
          plots: plots.filter((plot: any) => plot.farmId === farm.id).map((plot: any) => ({
            id: plot.id,
            name: plot.name,
            soilType: plot.soil_type || '',
            riceVariety: plot.variety || '',
            sowingDate: plot.planting_date || '',
            harvestDate: plot.harvest_date || '',
            irrigation: plot.irrigation_method || '',
            area: plot.area_m2 || 0,
            areaUnit: 'm²',
            photos: plot.photos || []
          }))
        }))
      };
      
      updateUser(updatedUser);
      setNewPlot({
        farmId: '',
        name: '',
        soilType: '',
        riceVariety: '',
        sowingDate: '',
        harvestDate: '',
        irrigation: '',
        area: '',
        areaUnit: 'm²',
        notes: ''
      });
      setShowAddPlot(false);
      toast.success('Plot added successfully!');
    } catch (error) {
      console.error('Failed to create plot:', error);
      toast.error('Failed to create plot. Please try again.');
    } finally {
      setIsSubmittingPlot(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Add extra padding-bottom on mobile to account for bottom nav - 80px for safe area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-[80px] lg:pb-8" style={{ width: '100%', maxWidth: '100vw' }}>
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.profile}
          </h1>
          <p className="text-gray-600">
            {t.profileDescription}
          </p>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <Card className="overflow-hidden">
            <CardHeader style={{ padding: '16px 24px 12px' }}>
              <div className="flex flex-col min-[400px]:flex-row min-[400px]:justify-between min-[400px]:items-start gap-3">
                <div className="flex-1 min-w-0" style={{ overflow: 'hidden' }}>
                  <CardTitle className="flex items-center gap-2" style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '700', color: '#111827', overflow: 'hidden' }}>
                    <User className="flex-shrink-0" style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)' }} />
                    <span className="truncate" style={{ minWidth: 0 }}>{t.personalInfo}</span>
                  </CardTitle>
                  <CardDescription style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '20px', color: '#6B7280', marginTop: '4px' }}>
                    {t.personalInfoSubDesc}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="w-full min-[400px]:w-auto flex-shrink-0"
                    style={{ 
                      padding: '10px 16px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      borderRadius: '8px',
                      minWidth: 'fit-content'
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t.edit}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">{t.language}</Label>
                      <Select 
                        value={editForm.language} 
                        onValueChange={(value: 'EN' | 'VI') => setEditForm({ ...editForm, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EN">{t.english}</SelectItem>
                          <SelectItem value="VI">{t.vietnamese}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      {t.save}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="flex-shrink-0 text-gray-400" style={{ width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)' }} />
                    <div className="min-w-0 flex-1">
                      <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#6B7280' }}>{t.name}</p>
                      <p className="font-medium truncate" style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="flex-shrink-0 text-gray-400" style={{ width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)' }} />
                    <div className="min-w-0 flex-1">
                      <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#6B7280' }}>{t.phone}</p>
                      <p className="font-medium truncate" style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{user?.phone || t.notProvided}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}>
                      {user?.language === 'VI' ? t.vietnamese : t.english}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card className="overflow-hidden">
            <CardHeader style={{ padding: '16px 24px 12px' }}>
              <CardTitle className="flex items-center" style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '700', color: '#111827' }}>
                <Eye className="flex-shrink-0" style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)', marginRight: '8px' }} />
                <span className="truncate">{t.accessibility}</span>
              </CardTitle>
              <CardDescription style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '20px', color: '#6B7280', marginTop: '4px' }}>
                {t.accessibilityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">{t.textSize}</Label>
                  <div className="flex flex-wrap gap-3">
                    {/* Small Button */}
                    <button
                      onClick={() => setFontSize('small')}
                      className="flex-1 min-w-[90px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: fontSize === 'small' ? '2px solid #2E7D32' : '2px solid #E5E7EB',
                        backgroundColor: fontSize === 'small' ? '#DCFCE7' : '#FFFFFF',
                        color: fontSize === 'small' ? '#14532D' : '#374151',
                        cursor: 'pointer'
                      }}
                      aria-label="Small text size"
                      aria-pressed={fontSize === 'small'}
                    >
                      🅢 {t.small}
                    </button>

                    {/* Default Button */}
                    <button
                      onClick={() => setFontSize('default')}
                      className="flex-1 min-w-[90px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: fontSize === 'default' ? '2px solid #2E7D32' : '2px solid #E5E7EB',
                        backgroundColor: fontSize === 'default' ? '#DCFCE7' : '#FFFFFF',
                        color: fontSize === 'default' ? '#14532D' : '#374151',
                        cursor: 'pointer'
                      }}
                      aria-label="Default text size"
                      aria-pressed={fontSize === 'default'}
                    >
                      🅓 {t.default}
                    </button>

                    {/* Large Button */}
                    <button
                      onClick={() => setFontSize('large')}
                      className="flex-1 min-w-[90px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: fontSize === 'large' ? '2px solid #2E7D32' : '2px solid #E5E7EB',
                        backgroundColor: fontSize === 'large' ? '#DCFCE7' : '#FFFFFF',
                        color: fontSize === 'large' ? '#14532D' : '#374151',
                        cursor: 'pointer'
                      }}
                      aria-label="Large text size"
                      aria-pressed={fontSize === 'large'}
                    >
                      🅛 {t.large}
                    </button>
                  </div>
                </div>

                {/* Preview Text */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-2" style={{ fontSize: '12px' }}>{t.preview}:</p>
                  <p className="text-gray-900" style={{ lineHeight: '1.5' }}>
                    {t.previewText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farms & Plots */}
          <Card className="overflow-hidden">
            <CardHeader style={{ padding: '16px 24px 12px' }}>
              <div className="flex flex-col min-[420px]:flex-row min-[420px]:justify-between min-[420px]:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center" style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '700', color: '#111827' }}>
                    <MapPin className="flex-shrink-0" style={{ width: 'clamp(18px, 4.5vw, 20px)', height: 'clamp(18px, 4.5vw, 20px)', marginRight: '8px' }} />
                    <span className="truncate">{t.myFarmsPlots}</span>
                  </CardTitle>
                  <CardDescription style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '20px', color: '#6B7280', marginTop: '4px' }}>
                    {t.farmsDesc}
                  </CardDescription>
                </div>
                
                {/* Action Buttons - Stack on mobile, horizontal on larger screens */}
                <div 
                  className="flex flex-col min-[420px]:flex-row gap-2 min-[420px]:gap-3"
                  style={{ flexShrink: 0 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddFarm(true)}
                    className="w-full min-[420px]:w-auto"
                    style={{
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      minWidth: 'fit-content'
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addFarm}
                  </Button>
                  {user?.farms.length > 0 && (
                    <Button 
                      onClick={() => {
                        setShowAddPlot(true);
                        setShowAllUnitsAddPlot(false); // Reset to show suggested units
                      }}
                      className="w-full min-[420px]:w-auto"
                      style={{
                        padding: '10px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '8px',
                        minWidth: 'fit-content'
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addPlot}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {user?.farms.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{t.noFarms}</p>
                  <Button onClick={() => setShowAddFarm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addFarm}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {user?.farms.map(farm => (
                    <div key={farm.id} className="border rounded-lg overflow-hidden" style={{ padding: '16px' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 
                          className="text-gray-900 truncate flex-1"
                          style={{ 
                            fontSize: 'clamp(14px, 2.5vw, 16px)',
                            fontWeight: '600'
                          }}
                        >
                          {farm.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditFarmId(farm.id);
                            setShowEditFarmModal(true);
                          }}
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            borderRadius: '6px'
                          }}
                          aria-label={t.editFarm}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <p 
                          className="text-gray-600 flex items-center gap-1 flex-1"
                          style={{ fontSize: 'clamp(12px, 2.2vw, 14px)' }}
                        >
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{farm.location}</span>
                        </p>
                        <Badge variant="outline">
                          {farm.plots.length} {t.plots}
                        </Badge>
                      </div>
                      
                      {farm.plots.length === 0 ? (
                        <p 
                          className="text-gray-500 text-center py-4"
                          style={{ fontSize: 'clamp(12px, 2.2vw, 14px)' }}
                        >
                          {t.noPlots}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {farm.plots.map(plot => (
                            <div key={plot.id} className="bg-gray-50 rounded-lg overflow-hidden" style={{ padding: '16px' }}>
                              <div className="mb-3">
                                {/* Plot name and Edit Button on same line */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 
                                    className="text-gray-900 flex-1"
                                    style={{ 
                                      fontSize: 'clamp(14px, 3vw, 16px)',
                                      fontWeight: '600',
                                      lineHeight: '1.3'
                                    }}
                                  >
                                    {plot.name}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditFarmId(farm.id);
                                      setEditPlotId(plot.id);
                                      setShowEditPlotModal(true);
                                    }}
                                    style={{
                                      padding: '6px 10px',
                                      fontSize: 'clamp(11px, 2.5vw, 13px)',
                                      borderRadius: '6px',
                                      height: 'auto'
                                    }}
                                    className="flex items-center"
                                    aria-label={t.edit}
                                  >
                                    <Edit style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }} />
                                  </Button>
                                </div>
                                {/* Rice variety badge */}
                                <Badge 
                                  variant="secondary"
                                  style={{
                                    fontSize: 'clamp(11px, 2.5vw, 13px)',
                                    padding: '4px 10px'
                                  }}
                                >
                                  {plot.riceVariety}
                                </Badge>
                              </div>
                              <div 
                                className="space-y-2 text-gray-600"
                                style={{ fontSize: 'clamp(12px, 2.2vw, 14px)' }}
                              >
                                <p><span className="font-medium">{t.soil}:</span> {plot.soilType}</p>
                                <p><span className="font-medium">{t.area}:</span> {plot.area} {plot.areaUnit || 'm²'}</p>
                                <p><span className="font-medium">{t.irrigation}:</span> {plot.irrigation}</p>
                                {plot.sowingDate && (
                                  <p><span className="font-medium">{t.sowing}:</span> {new Date(plot.sowingDate).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Farm Modal */}
              {showAddFarm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <CardHeader className="padding-responsive">
                      <CardTitle className="heading-md">{t.addFarm}</CardTitle>
                    </CardHeader>
                    <CardContent className="padding-responsive space-y-4">
                      {/* Farm Name */}
                      <div className="space-y-2">
                        <Label 
                          htmlFor="farm-name"
                          style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                        >
                          {t.farmName}
                        </Label>
                        <Input
                          id="farm-name"
                          className="farmer-input"
                          value={newFarm.name}
                          onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                          placeholder={language === 'EN' ? 'e.g., Main Farm' : 'vd. Trang trại chính'}
                        />
                      </div>
                      
                      {/* Province Dropdown */}
                      <div className="space-y-2">
                        <Label 
                          htmlFor="farm-province"
                          style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                        >
                          {t.province}
                        </Label>
                        <Select 
                          value={newFarm.province} 
                          onValueChange={(value) => setNewFarm({ ...newFarm, province: value, district: '', commune: '' })}
                        >
                          <SelectTrigger 
                            className="farmer-input"
                            style={{ minHeight: 'clamp(44px, 11vw, 52px)' }}
                          >
                            <SelectValue placeholder={t.selectProvincePlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {vietnamLocations.map(province => (
                              <SelectItem 
                                key={province.name} 
                                value={province.name}
                                style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                              >
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* District Dropdown - Disabled until province selected */}
                      <div className="space-y-2">
                        <Label 
                          htmlFor="farm-district"
                          style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                        >
                          {t.district}
                        </Label>
                        <Select 
                          value={newFarm.district} 
                          onValueChange={(value) => setNewFarm({ ...newFarm, district: value, commune: '' })}
                          disabled={!newFarm.province}
                        >
                          <SelectTrigger 
                            className="farmer-input"
                            style={{ minHeight: 'clamp(44px, 11vw, 52px)' }}
                            disabled={!newFarm.province}
                          >
                            <SelectValue placeholder={t.selectDistrictPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {getDistrictsByProvince(newFarm.province).map(district => (
                              <SelectItem 
                                key={district} 
                                value={district}
                                style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                              >
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!newFarm.province && (
                          <p 
                            className="text-gray-500 text-responsive-xs"
                            style={{ fontSize: 'clamp(11px, 2vw, 13px)' }}
                          >
                            {t.selectProvinceFirst}
                          </p>
                        )}
                      </div>
                      
                      {/* Commune Dropdown - Disabled until district selected */}
                      <div className="space-y-2">
                        <Label 
                          htmlFor="farm-commune"
                          style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                        >
                          {t.commune}
                        </Label>
                        <Select 
                          value={newFarm.commune} 
                          onValueChange={(value) => setNewFarm({ ...newFarm, commune: value })}
                          disabled={!newFarm.district}
                        >
                          <SelectTrigger 
                            className="farmer-input"
                            style={{ minHeight: 'clamp(44px, 11vw, 52px)' }}
                            disabled={!newFarm.district}
                          >
                            <SelectValue placeholder={t.selectCommunePlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {getCommunesByDistrict(newFarm.province, newFarm.district).map(commune => (
                              <SelectItem 
                                key={commune} 
                                value={commune}
                                style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
                              >
                                {commune}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!newFarm.district && (
                          <p 
                            className="text-gray-500 text-responsive-xs"
                            style={{ fontSize: 'clamp(11px, 2vw, 13px)' }}
                          >
                            {t.selectDistrictFirst}
                          </p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-responsive-sm pt-2">
                        <Button 
                          onClick={handleAddFarm} 
                          className="farmer-button flex-1 bg-green-600 hover:bg-green-700"
                          disabled={isSubmittingFarm}
                        >
                          {isSubmittingFarm ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {language === 'EN' ? 'Creating...' : 'Đang tạo...'}
                            </>
                          ) : (
                            t.addFarm
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAddFarm(false)}
                          className="btn-touch-responsive"
                          disabled={isSubmittingFarm}
                        >
                          {t.cancel}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Add Plot Modal */}
              {showAddPlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>{t.addPlot}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plot-farm">{t.farm}</Label>
                          <Select 
                            value={newPlot.farmId} 
                            onValueChange={(value) => setNewPlot({ ...newPlot, farmId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t.selectFarm} />
                            </SelectTrigger>
                            <SelectContent>
                              {user?.farms.map(farm => (
                                <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-name">{t.plotName}</Label>
                          <Input
                            id="plot-name"
                            value={newPlot.name}
                            onChange={(e) => setNewPlot({ ...newPlot, name: e.target.value })}
                            placeholder={t.plotNamePlaceholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-soil">{t.soilType}</Label>
                          <Select 
                            value={language === 'VI' ? getSoilTypeTranslation(newPlot.soilType, 'VI') : newPlot.soilType} 
                            onValueChange={(value) => {
                              // Store in English for consistency
                              const englishValue = language === 'VI' ? getSoilTypeTranslation(value, 'EN') : value;
                              setNewPlot({ ...newPlot, soilType: englishValue });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'EN' ? 'Select soil type' : 'Chọn loại đất'} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {(language === 'VI' ? SOIL_TYPES_VI : SOIL_TYPES_EN).map((soil, index) => (
                                <SelectItem key={`${soil}-${index}`} value={soil}>
                                  {soil}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-variety">{t.riceVariety}</Label>
                          <Select 
                            value={newPlot.riceVariety} 
                            onValueChange={(value) => setNewPlot({ ...newPlot, riceVariety: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'EN' ? 'Select rice variety' : 'Chọn giống lúa'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OM 18">OM 18</SelectItem>
                              <SelectItem value="OM 5451">OM 5451</SelectItem>
                              <SelectItem value="OM 6976">OM 6976</SelectItem>
                              <SelectItem value="OM 4900">OM 4900</SelectItem>
                              <SelectItem value="OM 2517">OM 2517</SelectItem>
                              <SelectItem value="OM 380">OM 380</SelectItem>
                              <SelectItem value="OM 9577">OM 9577</SelectItem>
                              <SelectItem value="OM 6162">OM 6162</SelectItem>
                              <SelectItem value="ST24">ST24</SelectItem>
                              <SelectItem value="ST25">ST25</SelectItem>
                              <SelectItem value="ST21">ST21</SelectItem>
                              <SelectItem value="ST20">ST20</SelectItem>
                              <SelectItem value="IR64">IR64</SelectItem>
                              <SelectItem value="IR50404">IR50404</SelectItem>
                              <SelectItem value="IR6">IR6</SelectItem>
                              <SelectItem value="IR32">IR32</SelectItem>
                              <SelectItem value="Jasmine 85">Jasmine 85</SelectItem>
                              <SelectItem value="Tài Nguyên">Tài Nguyên</SelectItem>
                              <SelectItem value="Đài Thơm 8">Đài Thơm 8</SelectItem>
                              <SelectItem value="Nàng Hoa 9">Nàng Hoa 9</SelectItem>
                              <SelectItem value="Nàng Hương">Nàng Hương</SelectItem>
                              <SelectItem value="Nàng Nhen">Nàng Nhen</SelectItem>
                              <SelectItem value="VNR20">VNR20</SelectItem>
                              <SelectItem value="VNR2">VNR2</SelectItem>
                              <SelectItem value="Nếp Cái Hoa Vàng">Nếp Cái Hoa Vàng</SelectItem>
                              <SelectItem value="Tám Xoan">Tám Xoan</SelectItem>
                              <SelectItem value="Khang Dân 18">Khang Dân 18</SelectItem>
                              <SelectItem value="Nhật Bản">Nhật Bản</SelectItem>
                              <SelectItem value="RVT">RVT</SelectItem>
                              <SelectItem value="ĐT8">ĐT8</SelectItem>
                              <SelectItem value="Đài Loan">Đài Loan</SelectItem>
                              <SelectItem value="Khang Dân">Khang Dân</SelectItem>
                              <SelectItem value="Thiên Ưu 8">Thiên Ưu 8</SelectItem>
                              <SelectItem value="Một Bụi Đỏ">Một Bụi Đỏ</SelectItem>
                              <SelectItem value="Bắc Hương">Bắc Hương</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-area">{t.area}</Label>
                          <div className="flex flex-col min-[481px]:flex-row gap-2">
                            <Input
                              id="plot-area"
                              type="number"
                              step="0.1"
                              min="0"
                              value={newPlot.area}
                              onChange={(e) => setNewPlot({ ...newPlot, area: e.target.value })}
                              placeholder={language === 'VI' ? 'Nhập giá trị diện tích' : 'Enter area value'}
                              className="flex-1 min-[481px]:w-[60%]"
                              style={{ 
                                height: '44px',
                                borderRadius: '8px',
                                border: '1px solid #D1D5DB',
                                fontSize: 'clamp(14px, 1.6vw, 16px)'
                              }}
                            />
                            <Select 
                              value={newPlot.areaUnit} 
                              onValueChange={(value) => setNewPlot({ ...newPlot, areaUnit: value })}
                            >
                              <SelectTrigger 
                                className="flex-1 min-[481px]:w-[40%]"
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
                                {(() => {
                                  // Get the selected farm's location
                                  const selectedFarm = user?.farms.find(f => f.id === newPlot.farmId);
                                  const suggestedUnits = selectedFarm 
                                    ? getSuggestedAreaUnits(selectedFarm.location)
                                    : AREA_UNITS.ALL;
                                  const unitsToShow = showAllUnitsAddPlot ? AREA_UNITS.ALL : suggestedUnits;
                                  
                                  return unitsToShow.map((unit, index) => (
                                    <SelectItem key={`${unit}-${index}`} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ));
                                })()}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-start justify-between gap-2 mt-1">
                            <p className="text-xs text-gray-500 flex-1">
                              {(() => {
                                const selectedFarm = user?.farms.find(f => f.id === newPlot.farmId);
                                if (!selectedFarm) {
                                  return language === 'VI' 
                                    ? 'Chọn trang trại trước để xem đơn vị gợi ý' 
                                    : 'Select a farm first to see recommended units';
                                }
                                const region = getRegionFromProvince(selectedFarm.location);
                                if (region === 'SOUTH') {
                                  return language === 'VI' 
                                    ? 'Đơn vị phổ biến ở miền Nam: Công Lớn và Công Nhỏ'
                                    : 'Common units in South Vietnam: Công Lớn and Công Nhỏ';
                                } else if (region === 'CENTRAL') {
                                  return language === 'VI'
                                    ? 'Đơn vị phổ biến ở miền Trung: Sào (500 m²)'
                                    : 'Common unit in Central Vietnam: Sào (500 m²)';
                                } else {
                                  return language === 'VI'
                                    ? 'Đơn vị phổ biến ở miền Bắc: Sào (360 m²)'
                                    : 'Common unit in North Vietnam: Sào (360 m²)';
                                }
                              })()}
                            </p>
                            {!showAllUnitsAddPlot && newPlot.farmId && (
                              <button
                                type="button"
                                onClick={() => setShowAllUnitsAddPlot(true)}
                                className="text-xs text-green-600 hover:text-green-700 underline whitespace-nowrap"
                              >
                                {language === 'VI' ? 'Hiện tất cả đơn vị' : 'Show all units'}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-irrigation">{t.irrigation}</Label>
                          <Select 
                            value={newPlot.irrigation} 
                            onValueChange={(value) => setNewPlot({ ...newPlot, irrigation: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t.selectIrrigationMethod} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flood Irrigation">{t.floodIrrigation}</SelectItem>
                              <SelectItem value="Drip Irrigation">{t.dripIrrigation}</SelectItem>
                              <SelectItem value="Sprinkler">{t.sprinkler}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-sowing">{t.sowingDate}</Label>
                          <Input
                            id="plot-sowing"
                            type="date"
                            value={newPlot.sowingDate}
                            onChange={(e) => setNewPlot({ ...newPlot, sowingDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plot-harvest">{t.harvestDate}</Label>
                          <Input
                            id="plot-harvest"
                            type="date"
                            value={newPlot.harvestDate}
                            onChange={(e) => setNewPlot({ ...newPlot, harvestDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plot-notes">{t.notes}</Label>
                        <Textarea
                          id="plot-notes"
                          value={newPlot.notes}
                          onChange={(e) => setNewPlot({ ...newPlot, notes: e.target.value })}
                          placeholder={t.notesPlaceholder}
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleAddPlot} 
                          className="flex-1"
                          disabled={isSubmittingPlot}
                        >
                          {isSubmittingPlot ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {language === 'EN' ? 'Creating...' : 'Đang tạo...'}
                            </>
                          ) : (
                            t.addPlot
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddPlot(false);
                            setShowAllUnitsAddPlot(false); // Reset to show suggested units
                          }}
                          disabled={isSubmittingPlot}
                        >
                          {t.cancel}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Farm Modal */}
      {editFarmId && (
        <EditFarmModal
          open={showEditFarmModal}
          onOpenChange={setShowEditFarmModal}
          farmId={editFarmId}
        />
      )}

      {/* Edit Plot Modal */}
      {editFarmId && editPlotId && (
        <EditPlotModal
          open={showEditPlotModal}
          onOpenChange={setShowEditPlotModal}
          farmId={editFarmId}
          plotId={editPlotId}
        />
      )}
    </div>
  );
}
