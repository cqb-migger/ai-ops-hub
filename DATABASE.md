# Database Schema Design (PostgreSQL)

Tài liệu này mô tả cấu trúc cơ sở dữ liệu (Database Schema) cho hệ thống, sử dụng hệ quản trị PostgreSQL. Thiết kế chú trọng vào việc tối ưu hóa truy vấn bằng cách sử dụng kiểu dữ liệu `JSONB` cho các dữ liệu có tính cấu trúc động (như tài liệu và câu lệnh gợi ý), đồng thời chuẩn hóa các bảng cơ sở.

Hệ thống bao gồm các bảng chính:
- **`tools`**: Quản lý danh sách công cụ, tài liệu đính kèm và các câu lệnh gợi ý (prompts).
- **`steps`**: Quản lý các bước trong quy trình.
- **`users`**: Quản lý thông tin người dùng và xác thực SSO.

---

## 1. Bảng `tools` (Quản lý Công cụ)

Bảng này chứa thông tin cấu hình của các công cụ. Để tối ưu hiệu năng và thiết kế, các danh sách như tài liệu (Documents) và câu lệnh (Prompts) được nhúng trực tiếp bằng kiểu `JSONB`.

### Các trường dữ liệu:

- **`id`** (`String` / `UUID`): Khóa chính (Primary Key).
- **`name`** (`String`): Tên của công cụ.
- **`description`** (`Text`): Mô tả tóm tắt về chức năng của công cụ.
- **`icon`** (`String`): Chuỗi URL trỏ tới ảnh (vd: `https://.../logo.png`) hoặc ký tự Emoji (vd: `📊`).
- **`url`** (`String`): Đường dẫn truy cập công cụ.
- **`login_ids`** (`Array of Strings`): Danh sách các tài khoản đăng nhập dùng chung (Login ID) do công ty cấp để truy cập vào URL của công cụ (VD: `['admin@congty.com']`). *Lưu ý: Chỉ lưu ID/Username, không lưu mật khẩu.*
- **`status`** (`String`): Trạng thái hiển thị của công cụ (`public` hoặc `private`).
- **`role`** (`String`): Đối tượng sử dụng chính của công cụ (Ví dụ: `sales`, `marketing`, `hr`).
- **`note`** (`Text`): Ghi chú bổ sung dành cho quản trị viên hoặc lưu trữ thông tin mở rộng.
- **`category`** (`JSONB` / `Array of Strings`): Mảng chứa 1 hoặc nhiều danh mục (Hub) mà công cụ trực thuộc (VD: `['クリエイティブハブ', 'データハブ']`).
- **`step_id`** (`String`, Nullable): ID của bước (Step) mà công cụ trực thuộc. Vì 1 công cụ chỉ thuộc 1 Step nên trường này lưu chuỗi đơn (hoặc UUID).
- **`documents`** (`JSONB`): Cột lưu trữ mảng các tài liệu liên quan đến công cụ. Cấu trúc mỗi object:
  - `name` (`String`): Tên tài liệu.
  - `url` (`String`): Đường dẫn tài liệu.
  - `type` (`String`): Loại tài liệu (`guide` cho tài liệu hướng dẫn, `attachment` cho tệp đính kèm).
- **`prompts`** (`JSONB`): Cột lưu trữ mảng các câu lệnh gợi ý thuộc về công cụ. Cấu trúc mỗi object:
  - `title` (`String`): Tiêu đề prompt.
  - `description` (`Text`): Mô tả mục đích.
  - `content` (`Text`): Nội dung chi tiết của câu lệnh.
  - `status` (`String`): Trạng thái hiển thị (`public` hoặc `private`).
  - `category` (`JSONB` / `Array of Strings`): Danh mục áp dụng của prompt.

---

## 2. Bảng `steps` (Quản lý Quy trình)

Bảng này lưu trữ cấu hình các bước (steps) trong luồng thực thi của hệ thống, tương ứng với model `Step` phía backend.

### Các trường dữ liệu:

- **`id`** (`String`): Khóa chính. Lưu theo định dạng custom (VD: `step-1`, `step-<timestamp>`).
- **`order`** (`Integer`): Vị trí thứ tự ưu tiên của bước (dùng để sắp xếp).
- **`icon`** (`String`, Nullable): Biểu tượng đại diện cho bước.
- **`title`** (`String`): Tiêu đề của bước.
- **`description`** (`Text`, Nullable): Mô tả chi tiết hoặc hướng dẫn thao tác của bước.
- **`created_at`** (`DateTime`): Thời gian khởi tạo bản ghi.
- **`updated_at`** (`DateTime`): Thời gian tự động cập nhật khi có thay đổi bản ghi.

---

## 3. Bảng `users` (Quản lý Người dùng)

Bảng quản lý thông tin tài khoản truy cập. Hệ thống tích hợp xác thực SSO (Single Sign-On), do đó bảng được thiết kế tối giản, loại bỏ trường mật khẩu truyền thống.

### Các trường dữ liệu:

- **`id`** (`UUID` / `Integer`): Khóa chính (Primary Key).
- **`email`** (`String`, Unique): Địa chỉ email, được sử dụng làm định danh duy nhất (Unique) trên hệ thống.
- **`name`** (`String`): Tên hiển thị đầy đủ của người dùng (tổng hợp từ `first_name` và `last_name`).
- **`provider`** (`String`): Nền tảng xác thực SSO (Ví dụ: `google`, `microsoft`).
- **`role`** (`String`): Quyền hạn truy cập của người dùng trên hệ thống (Ví dụ: `admin`, `user`).
- **`favorite_tools`** (`Array of Strings`): Mảng chứa ID của các công cụ mà người dùng đã thêm vào danh sách yêu thích.
- **`last_login`** (`DateTime`): Thời gian ghi nhận lần đăng nhập thành công gần nhất.
- **`created_at`** (`DateTime`): Thời điểm tài khoản được tự động cấp phép (Provisioning) trên hệ thống.
- **`updated_at`** (`DateTime`): Thời điểm thông tin người dùng được đồng bộ hoặc thay đổi lần cuối.
- **`deleted_at`** (`DateTime`, Nullable): Thời gian tài khoản bị vô hiệu hóa (phục vụ cơ chế Soft Delete).
