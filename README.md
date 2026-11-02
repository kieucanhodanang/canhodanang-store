# Căn Hộ Đà Nẵng — Astro website

Deploy to Cloudflare Pages with `npm run build`, output `dist`, branch `main`.

## Local

`npm install` then `npm run dev`.

## Note

All project descriptions are informational placeholders. No unverified prices or listings. Search on the homepage currently routes to the project directory; full dynamic search/filtering and CMS are planned for a later phase. Sitemap is currently manually maintained: update `public/sitemap.xml` when adding routes. Zalo URL should be verified on a live device.

Bản cập nhật: Bộ lọc Mua / Thuê dài hạn / Thuê theo ngày trên trang chủ, với phòng ngủ, diện tích, giá và hướng. Trang /tim-kiem/ nhận tham số URL, chưa có dữ liệu tin đăng.


## Cập nhật giao diện trang chủ
- Banner cao cấp và khối tìm kiếm nổi.
- Mặc định ưu tiên tab Mua căn hộ; giữ nguyên 3 hình thức giao dịch và các bộ lọc.
- Chưa có dữ liệu tin đăng hay CMS; bộ lọc chưa trả về căn hộ thực tế.
- Sau khi upload lên GitHub, Cloudflare Pages tự build/deploy.
