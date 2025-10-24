# Farm Location Selector Implementation

## Overview
Replaced free-text farm location input with a cascading dropdown system (Province → District → Commune) for consistent data entry and better user experience.

## What Was Changed

### 1. Created Vietnamese Location Data (`/data/vietnamLocations.ts`)
- **13 Mekong Delta provinces** with complete district and commune data
- Provinces included:
  - An Giang, Cần Thơ, Đồng Tháp, Kiên Giang
  - Long An, Tiền Giang, Bến Tre, Trà Vinh
  - Vĩnh Long, Hậu Giang, Sóc Trăng, Bạc Liêu, Cà Mau
- **4-5 districts per province** (rice-farming focused)
- **5 communes per district** (representative sample)
- **Helper functions** for filtering:
  - `getDistrictsByProvince(provinceName)`
  - `getCommunesByDistrict(provinceName, districtName)`
  - `getProvinceNames()`

### 2. Updated Profile Component (`/components/Profile.tsx`)

#### Imports Added:
```tsx
import { 
  vietnamLocations, 
  getDistrictsByProvince, 
  getCommunesByDistrict 
} from '../data/vietnamLocations';
```

#### Add Farm Modal - Complete Redesign:

**Before:**
- Province: Hardcoded 13 options in dropdown
- District: Free text input
- Commune: Free text input

**After:**
- Province: Dynamic dropdown from `vietnamLocations`
- District: Cascading dropdown (disabled until province selected)
- Commune: Cascading dropdown (disabled until district selected)

## Responsive Features

### Touch-Friendly Sizing
```tsx
className="farmer-input"
style={{ minHeight: 'clamp(44px, 11vw, 52px)' }}
```
- **Mobile (≤480px):** 44px minimum height
- **Tablet (481-1023px):** Scales proportionally
- **Desktop (≥1024px):** 52px maximum height

### Fluid Typography
```tsx
style={{ fontSize: 'clamp(14px, 1.6vw, 16px)' }}
```
- Labels: 14-16px (fluid)
- Dropdown items: 14-16px (fluid)
- Helper text: 11-13px (fluid)

### Layout
- **Single column** at all breakpoints (optimized for mobile)
- Vertical spacing: 8px between dropdowns (responsive padding)
- Modal padding: `padding-responsive` class
- Buttons: Full width on mobile, side-by-side on tablet+

### No Horizontal Scrolling
- All elements use `max-width: 100%`
- Modal: `max-w-lg max-h-[90vh] overflow-y-auto`
- Touch targets: ≥44×44px minimum

## User Experience

### Cascading Logic
1. **Select Province** → District dropdown enables
2. **Select District** → Commune dropdown enables
3. **Change Province** → District and Commune reset
4. **Change District** → Commune resets

### Visual Feedback
- Disabled dropdowns are visually muted
- Helper text appears below disabled dropdowns:
  - "Please select a province first" / "Vui lòng chọn tỉnh/thành trước"
  - "Please select a district first" / "Vui lòng chọn quận/huyện trước"

### Bilingual Support
All placeholders and helper text support EN/VI:
```tsx
{t.selectProvincePlaceholder}  // "Select province" / "Chọn tỉnh/thành"
{t.selectDistrictPlaceholder}  // "Select district" / "Chọn quận/huyện"
{t.selectCommunePlaceholder}   // "Select commune" / "Chọn phường/xã"
```

## Validation

### Before Submission:
```tsx
if (!newFarm.name || !newFarm.province || !newFarm.district || !newFarm.commune) {
  toast.error(
    language === 'EN' 
      ? 'Please fill in all farm details' 
      : 'Vui lòng điền đầy đủ thông tin trang trại'
  );
  return;
}
```

### Success Message:
```tsx
toast.success(
  language === 'EN' 
    ? 'Farm added successfully!' 
    : 'Đã thêm trang trại thành công!'
);
```

## Data Storage Format

Farm location is stored as concatenated string:
```tsx
location: `${newFarm.commune}, ${newFarm.district}, ${newFarm.province}`
```

Example: `"Tấn Mỹ, Chợ Mới, An Giang"`

## Responsive Utilities Used

### From globals.css:
- `.farmer-input` - Touch-friendly input (44-52px height)
- `.farmer-button` - Touch-friendly button (48-56px height)
- `.btn-touch-responsive` - Touch button with responsive sizing
- `.padding-responsive` - Fluid padding (12-20px)
- `.gap-responsive-sm` - Fluid gap (4-8px)
- `.heading-md` - Fluid heading (20-26px)
- `.text-responsive-xs` - Fluid small text (11-13px)

### Custom clamp() values:
```css
/* Labels and dropdown items */
fontSize: 'clamp(14px, 1.6vw, 16px)'

/* Helper text */
fontSize: 'clamp(11px, 2vw, 13px)'

/* Dropdown height */
minHeight: 'clamp(44px, 11vw, 52px)'
```

## Testing Checklist

### Functionality:
- [x] Province dropdown populates all 13 provinces
- [x] District dropdown populates when province selected
- [x] Commune dropdown populates when district selected
- [x] Dropdowns reset properly when parent changes
- [x] Validation prevents submission with missing fields
- [x] Success message appears on farm creation
- [x] Farm displays with correct location format

### Responsive:
- [x] Dropdowns ≥44px height on mobile (320px)
- [x] Text readable at all viewport sizes
- [x] No horizontal scrolling
- [x] Modal scrollable on small screens
- [x] Buttons stack on mobile, horizontal on tablet+
- [x] Touch targets adequate for finger tapping

### Bilingual:
- [x] All labels translate (EN/VI)
- [x] All placeholders translate (EN/VI)
- [x] All helper text translates (EN/VI)
- [x] All error/success messages translate (EN/VI)

### Accessibility:
- [x] Labels properly associated with inputs
- [x] Disabled state clearly indicated
- [x] Helper text provides context
- [x] Keyboard navigation works
- [x] Touch targets meet WCAG standards (≥44×44px)

## Future Enhancements

### Potential Additions:
1. **Search/Filter** in dropdown lists for faster selection
2. **GPS Auto-detect** to pre-populate nearest province
3. **Edit Farm** modal with same cascading logic
4. **Location History** to suggest previously used locations
5. **Map View** to visualize farm location
6. **Expand Data** to include all Vietnamese provinces (63 total)
7. **Custom Location** option for edge cases

### Data Expansion:
Currently includes 13 Mekong Delta provinces. To expand:
1. Add more provinces to `vietnamLocations.ts`
2. Add districts and communes for each
3. No code changes needed - dropdown automatically populates

## Code Maintenance

### Adding New Province:
```tsx
// In /data/vietnamLocations.ts
{
  name: "Province Name",
  districts: [
    {
      name: "District Name",
      communes: [
        { name: "Commune 1" },
        { name: "Commune 2" }
      ]
    }
  ]
}
```

### Modifying Dropdown Styling:
All responsive values are in inline styles using `clamp()`:
- Adjust min/max values to change size range
- Adjust vw value to change scaling rate
- Keep min ≥44px for touch targets

## Benefits

### For Farmers:
✅ No typing errors in location names  
✅ Consistent data format  
✅ Faster input with dropdowns  
✅ Large touch targets for ease of use  
✅ Clear guidance with helper text  
✅ Works on all device sizes  

### For Developers:
✅ Clean, queryable location data  
✅ Easy to add new provinces/districts  
✅ Reusable location data structure  
✅ Type-safe with TypeScript  
✅ Bilingual from the start  

### For Data Analysis:
✅ Standardized location names  
✅ No duplicate spellings  
✅ Easy to group by province/district  
✅ Ready for mapping/visualization  

---

**Implementation Date:** December 2024  
**Status:** ✅ Complete and Tested  
**Responsive:** ✅ Mobile-First (320px - 1920px+)  
**Bilingual:** ✅ EN/VI Support  
**Accessibility:** ✅ WCAG Touch Targets Met
