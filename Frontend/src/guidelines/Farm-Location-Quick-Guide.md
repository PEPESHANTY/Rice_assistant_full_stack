# Farm Location Selector - Quick User Guide

## How to Add a Farm with Location

### Step-by-Step Process:

#### 1. Open Add Farm Modal
- Go to **Profile** page
- Click **"Add Farm"** button
- Modal appears with form

#### 2. Enter Farm Name
```
Field: Farm Name
Example: "Main Rice Farm" or "Trang trại lúa chính"
```

#### 3. Select Province (Step 1 of location)
```
Dropdown: Province / Tỉnh/Thành phố
Options: 13 Mekong Delta provinces
Example: "An Giang"
```
⚠️ **District and Commune dropdowns are disabled until you select a province**

#### 4. Select District (Step 2 of location)
```
Dropdown: District / Quận/Huyện
Options: Districts in selected province (e.g., Chợ Mới, Long Xuyên)
Example: "Chợ Mới"
```
✅ **Dropdown becomes enabled after selecting province**  
⚠️ **Commune dropdown still disabled**

#### 5. Select Commune (Step 3 of location)
```
Dropdown: Commune / Phường/Xã
Options: Communes in selected district (e.g., Tấn Mỹ, Long Điền A)
Example: "Tấn Mỹ"
```
✅ **Dropdown becomes enabled after selecting district**

#### 6. Submit
- Click **"Add Farm"** button
- Farm is saved with location: "Tấn Mỹ, Chợ Mới, An Giang"
- Success message appears

## Visual Flow Diagram

```
┌─────────────────────────────────────┐
│     Click "Add Farm" Button         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Enter Farm Name                    │
│  [Main Rice Farm____________]       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Select Province                    │
│  [An Giang              ▼]          │
│  ✅ Enabled                          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Select District                    │
│  [Chợ Mới               ▼]          │
│  ✅ Enabled (after province)         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Select Commune                     │
│  [Tấn Mỹ                ▼]          │
│  ✅ Enabled (after district)         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Click "Add Farm"                   │
│  [Add Farm]  [Cancel]               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  ✅ Farm Added!                      │
│  Location: Tấn Mỹ, Chợ Mới, An Giang│
└─────────────────────────────────────┘
```

## What Happens If You Change Your Mind?

### Change Province:
- **District** resets to empty
- **Commune** resets to empty
- Must re-select both

### Change District:
- **Commune** resets to empty
- Must re-select commune
- Province stays the same

## Error Prevention

### Missing Farm Name:
```
❌ Error: "Please fill in all farm details"
Action: Enter a farm name
```

### Missing Province:
```
❌ Error: "Please fill in all farm details"
Action: Select a province from dropdown
```

### Missing District:
```
❌ Error: "Please fill in all farm details"
Action: Select province first, then district
```

### Missing Commune:
```
❌ Error: "Please fill in all farm details"
Action: Select province and district first, then commune
```

## Mobile Experience

### On Small Phones (≤480px):
- **Dropdowns stack vertically** (one per row)
- **Dropdown height: 44px** (easy to tap)
- **Buttons stack vertically** (Add Farm on top, Cancel below)
- **Helper text wraps** properly

### On Tablets (481-1023px):
- **Dropdowns remain vertical** (better readability)
- **Slightly larger** dropdowns (44-52px)
- **Buttons side-by-side** (Add Farm | Cancel)

### On Desktop (≥1024px):
- **Dropdowns at maximum size** (52px)
- **Modal centered** with comfortable width
- **Easy mouse interaction**

## Available Provinces

### Mekong Delta (13 provinces):
1. **An Giang** - 4 districts
2. **Cần Thơ** - 4 districts
3. **Đồng Tháp** - 4 districts
4. **Kiên Giang** - 4 districts
5. **Long An** - 4 districts
6. **Tiền Giang** - 4 districts
7. **Bến Tre** - 4 districts
8. **Trà Vinh** - 4 districts
9. **Vĩnh Long** - 4 districts
10. **Hậu Giang** - 4 districts
11. **Sóc Trăng** - 4 districts
12. **Bạc Liêu** - 4 districts
13. **Cà Mau** - 4 districts

Each district has **5 sample communes** for selection.

## Example: Complete Farm Entry

### English:
```
Farm Name: North Field Rice Farm
Province: An Giang
District: Chợ Mới
Commune: Tấn Mỹ

Result: "Tấn Mỹ, Chợ Mới, An Giang"
```

### Vietnamese:
```
Tên Trang Trại: Trang trại lúa Đồng Bắc
Tỉnh/Thành phố: An Giang
Quận/Huyện: Chợ Mới
Phường/Xã: Tấn Mỹ

Kết quả: "Tấn Mỹ, Chớ Mới, An Giang"
```

## Tips for Fast Entry

### 1. **Start Typing in Dropdown**
Most browsers allow typing to filter options:
- Type "An" → jumps to "An Giang"
- Type "Cho" → jumps to "Chợ Mới"

### 2. **Use Tab Key**
- Tab → Next field
- Enter → Select highlighted option

### 3. **Know Your Location**
Have your complete address ready:
- Province name
- District name
- Commune name

### 4. **Use Browser Autofill**
After first entry, browser may remember selections

## Troubleshooting

### "District dropdown won't open"
**Solution:** Select a province first

### "Commune dropdown won't open"
**Solution:** Select province AND district first

### "I selected the wrong province"
**Solution:** Just select a different province - district and commune will reset automatically

### "Can't find my commune"
**Solution:** Currently showing 5 sample communes per district. If yours isn't listed, contact support to add it

### "Dropdown text is too small"
**Solution:** Go to Profile → Accessibility → Set text size to "Large"

---

## Summary

✅ **Easy 3-step process:** Province → District → Commune  
✅ **No typing errors:** Select from list  
✅ **Smart cascading:** Options filter automatically  
✅ **Mobile-friendly:** Large touch targets  
✅ **Bilingual:** Works in English and Vietnamese  
✅ **Clear guidance:** Helper text shows what to do  

**Need Help?** The dropdowns guide you step-by-step with helper text!
