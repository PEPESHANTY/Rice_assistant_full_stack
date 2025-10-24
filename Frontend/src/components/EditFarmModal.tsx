import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  vietnamLocations, 
  getDistrictsByProvince, 
  getCommunesByDistrict 
} from '../data/vietnamLocations';
import { useApp } from './AppContext';

interface EditFarmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmId: string;
}

export function EditFarmModal({ open, onOpenChange, farmId }: EditFarmModalProps) {
  const { user, language, updateFarm } = useApp();
  
  // Find the farm data
  const farm = user?.farms.find(f => f.id === farmId);

  // Farm form state
  const [farmForm, setFarmForm] = useState({
    name: '',
    province: '',
    district: '',
    commune: '',
    totalArea: '',
    areaUnit: 'ha',
    notes: ''
  });

  // Districts and communes based on selected province/district
  const [districts, setDistricts] = useState<string[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && farm) {
      // Parse location string (e.g., "An Giang, Chau Doc, Ward 1")
      const locationParts = farm.location.split(',').map(s => s.trim());
      
      setFarmForm({
        name: farm.name,
        province: locationParts[0] || '',
        district: locationParts[1] || '',
        commune: locationParts[2] || '',
        totalArea: '',
        areaUnit: 'ha',
        notes: ''
      });

      // Load districts for the province
      if (locationParts[0]) {
        const districtList = getDistrictsByProvince(locationParts[0]);
        setDistricts(districtList);
        
        // Load communes for the district
        if (locationParts[1]) {
          const communeList = getCommunesByDistrict(locationParts[0], locationParts[1]);
          setCommunes(communeList);
        }
      }
    }
  }, [open, farm]);

  // Handle province change
  const handleProvinceChange = (province: string) => {
    setFarmForm(prev => ({ ...prev, province, district: '', commune: '' }));
    const districtList = getDistrictsByProvince(province);
    setDistricts(districtList);
    setCommunes([]);
  };

  // Handle district change
  const handleDistrictChange = (district: string) => {
    setFarmForm(prev => ({ ...prev, district, commune: '' }));
    const communeList = getCommunesByDistrict(farmForm.province, district);
    setCommunes(communeList);
  };

  const handleSave = () => {
    // Validation
    if (!farmForm.name.trim()) {
      toast.error(t.farmNameRequired);
      return;
    }
    if (!farmForm.province) {
      toast.error(t.provinceRequired);
      return;
    }

    // Build location string
    const locationParts = [farmForm.province, farmForm.district, farmForm.commune].filter(Boolean);
    const location = locationParts.join(', ');

    // Update farm via context
    if (updateFarm) {
      updateFarm(farmId, {
        name: farmForm.name,
        location: location
      });
      toast.success(t.successMessage);
      onOpenChange(false);
    }
  };

  const texts = {
    EN: {
      title: 'Edit Farm Information',
      subtitle: 'Update your farm location and details',
      farmInfo: 'Farm Information',
      farmName: 'Farm Name',
      farmNamePlaceholder: 'e.g., My Main Farm',
      province: 'Province',
      selectProvince: 'Select Province',
      district: 'District',
      selectDistrict: 'Select District',
      commune: 'Commune',
      selectCommune: 'Select Commune',
      totalArea: 'Total Area',
      areaPlaceholder: 'e.g., 10',
      notes: 'Notes',
      farmNotesPlaceholder: 'Add farm-level details...',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      successMessage: '✅ Farm details updated successfully.',
      farmNameRequired: '⚠️ Farm name is required.',
      provinceRequired: '⚠️ Province is required.',
      optional: '(optional)'
    },
    VI: {
      title: 'Chỉnh Sửa Thông Tin Nông Trại',
      subtitle: 'Cập nhật vị trí và thông tin nông trại',
      farmInfo: 'Thông Tin Nông Trại',
      farmName: 'Tên Nông Trại',
      farmNamePlaceholder: 'vd: Nông Trại Chính',
      province: 'Tỉnh/Thành',
      selectProvince: 'Chọn Tỉnh/Thành',
      district: 'Quận/Huyện',
      selectDistrict: 'Chọn Quận/Huyện',
      commune: 'Xã/Phường',
      selectCommune: 'Chọn Xã/Phường',
      totalArea: 'Tổng Diện Tích',
      areaPlaceholder: 'vd: 10',
      notes: 'Ghi Chú',
      farmNotesPlaceholder: 'Thêm ghi chú về nông trại...',
      cancel: 'Hủy',
      saveChanges: 'Lưu Thay Đổi',
      successMessage: '✅ Đã cập nhật thông tin nông trại.',
      farmNameRequired: '⚠️ Tên nông trại là bắt buộc.',
      provinceRequired: '⚠️ Tỉnh/Thành là bắt buộc.',
      optional: '(tùy chọn)'
    }
  };

  const t = texts[language];

  if (!farm) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="heading-md flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t.title}
              </DialogTitle>
              <DialogDescription className="text-responsive-sm">
                {t.subtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Farm Information */}
              <div className="space-y-4">
                <h3 className="text-responsive-lg font-medium text-gray-900">{t.farmInfo}</h3>
                
                {/* Farm Name */}
                <div className="space-y-2">
                  <Label htmlFor="farm-name" className="text-responsive-base">
                    {t.farmName}
                  </Label>
                  <Input
                    id="farm-name"
                    value={farmForm.name}
                    onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                    placeholder={t.farmNamePlaceholder}
                    className="farmer-input"
                  />
                </div>

                {/* Location - Province */}
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-responsive-base">
                    {t.province}
                  </Label>
                  <Select value={farmForm.province} onValueChange={handleProvinceChange}>
                    <SelectTrigger className="farmer-input">
                      <SelectValue placeholder={t.selectProvince} />
                    </SelectTrigger>
                    <SelectContent>
                      {vietnamLocations.map((location, index) => (
                        <SelectItem key={`${location.name}-${index}`} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location - District */}
                {farmForm.province && (
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-responsive-base">
                      {t.district}
                    </Label>
                    <Select value={farmForm.district} onValueChange={handleDistrictChange} disabled={!districts.length}>
                      <SelectTrigger className="farmer-input">
                        <SelectValue placeholder={t.selectDistrict} />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Location - Commune */}
                {farmForm.district && (
                  <div className="space-y-2">
                    <Label htmlFor="commune" className="text-responsive-base">
                      {t.commune} <span className="text-gray-400">{t.optional}</span>
                    </Label>
                    <Select value={farmForm.commune} onValueChange={(value) => setFarmForm({ ...farmForm, commune: value })} disabled={!communes.length}>
                      <SelectTrigger className="farmer-input">
                        <SelectValue placeholder={t.selectCommune} />
                      </SelectTrigger>
                      <SelectContent>
                        {communes.map((commune) => (
                          <SelectItem key={commune} value={commune}>
                            {commune}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
