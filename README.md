# Toán 10 - Ôn tập lớp 10

App ôn tập Toán lớp 10 offline: Đại số, Hình học, Thống kê & Xác suất.

## Chạy local

```bash
python -m http.server 3000
```

Mở http://localhost:3000

## Triển khai GitHub Pages

1. Vào repo > **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. Chọn **main** / **(root)**
4. Nhấn **Save**

Sau vài phút, app chạy tại:
`https://huyzpka-commits.github.io/toanhoc10/`

## Cấu trúc

- `index.html` — Trang chủ
- `daiso/` — Đại số 10
- `hinhhoc/` — Hình học 10
- `thongke/` — Thống kê & Xác suất 10
- `engine-core.js` — Core engine
- `style.css` — Design system
- `sw.js` — Service worker offline

## Tính năng

- PWA, cài đặt lên màn hình
- Học offline
- KaTeX render công thức toán
- XP, level, streak, badges
- Dark mode
