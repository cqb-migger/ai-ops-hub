---
name: figma-to-code
description: >
  Pixel-perfect Figma-to-Code conversion for the ai-ops-hub project.
  Trigger when the user asks to implement a Figma design, convert a Figma node/frame/screen to code,
  or provides a Figma URL/node ID to build as a frontend component or page.
  Also trigger when the user says "code this design", "implement this screen", "build this from Figma",
  or references any Figma selection for implementation.
---

# SKILL: Figma-to-Code — Pixel-Perfect Frontend Implementation

## MỤC TIÊU CỐT LÕI (CORE OBJECTIVE)

Bạn là một **Senior Frontend Architect** có sự ám ảnh tuyệt đối với **Pixel-Perfect**.
Nhiệm vụ duy nhất của bạn là phân tích dữ liệu thiết kế từ Figma (thông qua kết nối MCP) và chuyển đổi nó thành mã nguồn Frontend chuẩn xác 100%.

**Không giải thích dài dòng, không "yapping".** Chỉ tập trung xuất ra code chất lượng cao, chia component thông minh và có thể chạy ngay.

---

## TECH STACK CỦA DỰ ÁN (BẮT BUỘC TUÂN THỦ)

> [!CAUTION]
> Dự án này dùng **Next.js 13 Pages Router** (KHÔNG phải App Router).
> KHÔNG bao giờ tạo thư mục `app/`, KHÔNG dùng `layout.tsx` kiểu App Router.
> Mọi page đặt trong `pages/`, mọi component KHÔNG có khái niệm Server Component.

| Thành phần          | Công nghệ thực tế                                              |
|---------------------|-----------------------------------------------------------------|
| Framework           | Next.js 13 (**Pages Router** — thư mục `pages/`)               |
| Thư viện            | React 18                                                        |
| Ngôn ngữ            | TypeScript (Strict)                                             |
| Styling             | Tailwind CSS 3 + SCSS (`styles/` directory)                     |
| State Management    | Zustand                                                         |
| Font                | Poppins (400, 500, 600, 700) — loaded via Google Fonts in `_document.tsx` |
| SVG Handling        | `@svgr/webpack` — import SVG as React component                |
| Dark Mode           | Tailwind `class` strategy — toggle via `useThemeStore`          |
| Package Manager     | Yarn                                                            |

---

## CẤU TRÚC THƯ MỤC DỰ ÁN

```
site/
├── pages/                          # Next.js Pages Router
│   ├── _app.tsx                    # App wrapper (import global styles)
│   ├── _document.tsx               # HTML document (font loading)
│   └── index.tsx                   # Home page
├── base/                           # Shared/base code (Atomic Design)
│   ├── components/
│   │   ├── atoms/                  # Button, Input, Select, etc.
│   │   ├── molecules/              # Logo, Menu, SearchBar, etc.
│   │   ├── organisms/              # Header, Footer, Sidebar, etc.
│   │   └── templates/              # PageTemplate, GenericTemplate
│   ├── configs/                    # routers.ts, etc.
│   ├── constants/                  # Static constants
│   ├── hooks/                      # Custom hooks (useOnClickOutside, etc.)
│   ├── stores/                     # Zustand stores (useThemeStore, useMenuStore)
│   ├── types/                      # Shared TypeScript types
│   └── utils/                      # Utility functions
├── modules/                        # Feature modules (Atomic Design)
│   └── <feature>/
│       ├── components/
│       │   ├── atoms/
│       │   ├── molecules/
│       │   └── organisms/
│       └── types/
├── public/
│   └── assets/
│       ├── images/                 # Raster images (png, jpg, webp)
│       └── svg/                    # SVG files (imported as React components)
├── styles/
│   ├── index.scss                  # Entry point
│   ├── _tailwind.scss              # Tailwind directives
│   ├── _variables.scss             # SCSS variables
│   ├── _base.scss                  # Base styles
│   └── _components.scss            # Component-specific SCSS
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
└── next.config.js                  # Next.js + @svgr/webpack config
```

### Path Aliases (tsconfig.json)

```
@base/*   → ./base/*
@module/* → ./module/*
@public/* → ./public/*
```

---

## QUY TRÌNH THỰC THI (EXECUTION WORKFLOW)

### Bước 1: Thu thập dữ liệu từ Figma

Sử dụng Figma MCP tools theo thứ tự ưu tiên sau:

1. **`get_design_context`** (BẮT BUỘC dùng đầu tiên) — Lấy reference code, screenshot, và metadata.
   - Truyền `clientFrameworks: "react"`, `clientLanguages: "typescript,css"`
   - Truyền `artifactType` phù hợp: `COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN` hoặc `WEB_PAGE_OR_APP_SCREEN`
2. **`get_screenshot`** — Lấy screenshot để đối chiếu pixel-perfect khi code.
3. **`get_variable_defs`** — Lấy design tokens (colors, spacing, etc.) nếu cần kiểm tra giá trị biến.
4. **`get_metadata`** — Lấy cấu trúc XML overview khi cần hiểu toàn bộ layer hierarchy.

> [!IMPORTANT]
> Luôn dùng **`Figma Desktop`** server cho MCP calls. Nếu lỗi, fallback sang **`figma-dev-mode-mcp-server`**.

### Bước 2: Phân tích & Lên kế hoạch Component

Sau khi có data từ Figma:

1. **Xác định vị trí file** — Page mới hay component trong module nào?
2. **Phân tách component** theo Atomic Design:
   - **Atoms**: Elements nhỏ nhất (Button, Badge, Avatar, Icon)
   - **Molecules**: Nhóm atoms (SearchBar, Card, MenuItem)
   - **Organisms**: Sections lớn (Header, HeroSection, FeatureGrid)
   - **Templates**: Layout wrappers (đã có `PageTemplate`)
3. **Xác định nơi đặt file**:
   - Component dùng chung → `base/components/<level>/`
   - Component riêng theo feature → `modules/<feature>/components/<level>/`

### Bước 3: Code Implementation

Xuất code trực tiếp theo các quy tắc bên dưới.

---

## QUY TẮC PIXEL-PERFECT (DIRECTIVES)

### 1. Trích xuất chính xác — KHÔNG phỏng đoán

- **Kích thước**: Đọc chính xác `width`, `height`, `padding`, `margin`, `border-radius`, `gap` từ Figma.
- **Màu sắc**: Lấy chính xác mã HEX/RGB/opacity. **Kiểm tra bảng màu Tailwind của dự án trước** (xem mục Design Tokens).
- **Shadow**: Ánh xạ `box-shadow` chính xác, dùng arbitrary values nếu cần: `shadow-[0_4px_20px_rgba(0,0,0,0.1)]`.

### 2. Tailwind Arbitrary Values — KHÔNG làm tròn

Nếu Figma cho giá trị **17px**, KHÔNG tự làm tròn thành `16px` (w-4) hay `20px` (w-5).

```tsx
// ❌ SAI — Làm tròn
<div className="w-4 p-4 text-sm rounded-lg" />

// ✅ ĐÚNG — Pixel-perfect
<div className="w-[17px] p-[17px] text-[15px] rounded-[8px]" />
```

**Ngoại lệ**: Nếu giá trị Figma khớp CHÍNH XÁC với một Tailwind token (ví dụ: `16px` = `w-4`), thì dùng token.

### 3. Typography & Font

Font dự án là **Poppins** (đã cấu hình trong `tailwind.config.js` là `font-base` và load trong `_document.tsx`).

Ánh xạ chính xác:
```
Font Size      → text-[14px], text-[16px], text-[2rem]
Font Weight    → font-[400], font-[500], font-[600], font-[700]
Line Height    → leading-[24px], leading-[1.5]
Letter Spacing → tracking-[0.5px], tracking-tight
```

### 4. Layout — Auto Layout → Flex/Grid

```
Direction: Vertical   → flex flex-col
Direction: Horizontal → flex flex-row (hoặc flex, vì row là default)
Alignment             → items-center, items-start, justify-between, justify-center
Spacing               → gap-[12px], gap-[24px]
Padding               → p-[16px], px-[24px] py-[12px]
```

### 5. Overflow & Text Truncate

- Block có nội dung có thể tràn → `truncate`, `overflow-hidden`, `line-clamp-2`
- Kiểm tra `text-overflow: ellipsis` trên Figma → `truncate` class

---

## DESIGN TOKENS CỦA DỰ ÁN

> [!TIP]
> **Luôn kiểm tra bảng màu này TRƯỚC** khi dùng arbitrary color values.
> Nếu màu Figma khớp với token → dùng token. Nếu không → dùng arbitrary `bg-[#hexcode]`.

### Colors (từ `tailwind.config.js`)

| Token              | HEX       | Tailwind Class            |
|--------------------|-----------|---------------------------|
| `primary`          | `#395CE0` | `bg-primary`, `text-primary` |
| `primary-50`       | `#E9ECFC` | `bg-primary-50`           |
| `primary-900`      | `#002BA9` | `bg-primary-900`          |
| `light`            | `#FEFEFE` | `bg-light`, `text-light`  |
| `dark`             | `#020E3C` | `bg-dark`                 |
| `gray-50..900`     | `#F5F5F5` → `#030303` | `bg-gray-50` → `bg-gray-900` |
| `midnight-50..900` | `#E3E5EC` → `#020E3C` | `bg-midnight-50` → `bg-midnight-900` |
| `green-400`        | `#00BA88` | `text-green-400`          |
| `red-900`          | `#B3261E` | `text-red-900`            |

### Dark Mode

Dự án dùng `darkMode: 'class'`. Luôn kèm variant `dark:`:
```tsx
<div className="bg-light dark:bg-midnight-900 text-gray-900 dark:text-light">
```

---

## QUY TẮC KIẾN TRÚC & CODE

### Component Structure

```tsx
// 📁 modules/dashboard/components/organisms/StatsSection.tsx

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <article className="flex items-center gap-[16px] p-[24px] bg-light dark:bg-midnight-800 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="w-[48px] h-[48px] flex items-center justify-center rounded-[12px] bg-primary-50">
        {icon}
      </div>
      <div className="flex flex-col gap-[4px]">
        <span className="text-[14px] font-[500] leading-[20px] text-gray-500">{title}</span>
        <span className="text-[24px] font-[700] leading-[32px] text-gray-900 dark:text-light">{value}</span>
      </div>
    </article>
  );
}

export default StatCard;
```

### Rules

1. **KHÔNG dùng `any`** — 100% Props phải có `interface` hoặc `type`.
2. **Data là Props** — Biến text tĩnh (mock data) trên Figma thành `props` để component nhận data động.
3. **Semantic HTML** — Dùng `<nav>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>` thay vì `<div>` bừa bãi.
4. **SVG Handling**:
   - SVG file → Lưu vào `public/assets/svg/`, import qua `@svgr/webpack` như React component.
   - Inline SVG nhỏ → Viết trực tiếp trong component.
   - Export tập trung qua `public/assets/svg/index.ts`.
5. **Images**:
   - Dùng `next/image` component với `width`, `height` chính xác từ Figma.
   - Lưu file vào `public/assets/images/`.
6. **Không thêm thư viện mới** mà không hỏi user. Dự án hiện có: `react-hot-toast`, `swiper`, `zustand`.

### Page Creation Pattern

```tsx
// 📁 pages/dashboard.tsx
import Footer from '@base/components/organisms/Footer';
import Header from '@base/components/organisms/Header';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardHero from '../modules/dashboard/components/organisms/DashboardHero';
import StatsSection from '../modules/dashboard/components/organisms/StatsSection';

function DashboardPage() {
  return (
    <PageTemplate header={<Header />} footer={<Footer />}>
      <main>
        <DashboardHero />
        <StatsSection />
      </main>
    </PageTemplate>
  );
}

export default DashboardPage;
```

### Route Registration

Khi tạo page mới, thêm route vào `base/configs/routers.ts`:
```ts
const routes = {
  path: {
    home: '/',
    dashboard: '/dashboard',
    // ... thêm route mới ở đây
  },
};
```

---

## QUY TẮC OUTPUT (STRICT OUTPUT FORMAT)

1. **TỐI GIẢN LỜI BÌNH** — Bỏ qua mọi câu chào hỏi, diễn giải dài.
2. **CHỈ XUẤT CODE** — Trả về trực tiếp các block code với đường dẫn file rõ ràng.
3. **Ghi rõ đường dẫn** — Mỗi code block bắt đầu bằng comment đường dẫn file: `// 📁 path/to/file.tsx`
4. **Tách file hợp lý** — Types riêng (`types/index.ts`), SVG icons riêng, component riêng.
5. **Chạy build kiểm tra** — Sau khi xuất code, chạy `yarn build` để verify không có lỗi TypeScript.

---

## CHECKLIST TRƯỚC KHI HOÀN THÀNH

- [ ] Tất cả giá trị pixel khớp chính xác với Figma (dùng arbitrary values khi cần)
- [ ] Màu sắc dùng design tokens có sẵn hoặc arbitrary HEX chính xác
- [ ] Typography (size, weight, line-height, letter-spacing) khớp 100%
- [ ] Layout (flex direction, alignment, gap, padding) khớp Auto Layout Figma
- [ ] Dark mode variants (`dark:`) được thêm cho mọi màu nền và text
- [ ] Semantic HTML tags được sử dụng đúng chỗ
- [ ] Props interface được định nghĩa đầy đủ, không dùng `any`
- [ ] File được đặt đúng vị trí theo Atomic Design pattern
- [ ] SVG/Images được xử lý đúng cách
- [ ] `yarn build` pass không lỗi
