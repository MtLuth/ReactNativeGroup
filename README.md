# MTShop – Ứng dụng Thương mại điện tử Thời trang

MTShop là ứng dụng thương mại điện tử được phát triển bằng **React Native** (cho Android) với backend sử dụng **Node.js + Express.js** và cơ sở dữ liệu **MongoDB**. Ứng dụng cho phép người dùng duyệt sản phẩm thời trang, thêm vào giỏ hàng, đặt hàng và theo dõi đơn hàng dễ dàng.

---

## 🎨 Thiết kế giao diện (Figma)

Link giao diện thiết kế:  
👉 [Xem trên Figma](https://www.figma.com/design/bzypufFYOG7lzWqLwSF6Dx/MTShop?node-id=1-16990&t=WFRlKYARUmYbMi6b-1)

---

## 👥 Thành viên thực hiện

| Họ và tên   | MSSV     |
| ----------- | -------- |
| Nguyễn Minh | 21110242 |
| Mai Tấn Tài | 21110851 |

---

## 🛠️ Công nghệ sử dụng

### Frontend

- React Native
- React Navigation
- Axios
- NativeWind (Tailwind CSS cho React Native)
- Socket.IO client

### Backend

- Node.js
- Express.js
- Mongoose (ODM cho MongoDB)
- migrate-mongo (quản lý migration)
- JWT (xác thực người dùng)
- Socket.IO server (thông báo realtime)

---

## ⚙️ Các chức năng chính

- Đăng ký / đăng nhập
- Xem danh mục & chi tiết sản phẩm
- Thêm/xoá sản phẩm vào giỏ hàng
- Đặt hàng & theo dõi trạng thái đơn hàng
- Hệ thống thông báo đơn hàng realtime
- Quản lý tài khoản người dùng

---

## 📦 Cài đặt & chạy ứng dụng

### Frontend

```bash
cd MTshop
npm install
npm run android
```

### Backend

```bash
cd backend
npm install
npm run dev
```
