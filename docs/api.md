# AI Ops Hub — API Design

> **Phiên bản:** 1.0.0  
> **Cập nhật:** 2026-07-07  
> **Framework:** FastAPI (Python)  
> **Base URL:** `http://localhost:8000/v1`  
> **Auth:** JWT Bearer Token (phát sau Google OAuth)

---

## Quy ước chung

### Request Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Response Format (thành công)

```json
{
  "data": ...,
}
```

### Response Format (lỗi)

```json
{
  "detail": "Mô tả lỗi"
}
```

### HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| `200` | OK — thành công |
| `201` | Created — tạo mới thành công |
| `204` | No Content — xóa thành công |
| `400` | Bad Request — dữ liệu đầu vào không hợp lệ |
| `401` | Unauthorized — chưa đăng nhập hoặc token hết hạn |
| `403` | Forbidden — không đủ quyền |
| `404` | Not Found — không tìm thấy resource |
| `413` | Payload Too Large — file upload vượt giới hạn |
| `422` | Unprocessable Entity — validation error |
| `500` | Internal Server Error |

### Phân quyền API

| Ký hiệu | Ý nghĩa |
|---------|---------|
| 🔓 Public | Không cần token |
| 🔐 Auth | Cần JWT Bearer token |
| 🛡️ Admin | Cần token + role `admin` |

---

## Tổng quan các nhóm API

| Nhóm | Prefix | Bảng DB | Module FE |
|------|--------|---------|-----------|
| Auth | `/v1/auth` | `users` | Login page |
| Categories | `/v1/categories` | `categories` | FilterBar, CreateToolForm |
| Users | `/v1/users` | `users` | `/users` → UserManagementTable |
| Tools | `/v1/tools` | `tools`, `tool_categories`, `tool_roles`, `tool_prompts`, join tables | Dashboard, Hubs, ManageTools, CreateToolForm |
| Tool Guide Files | `/v1/tools/:id/guide-files` | `tool_guide_files` | CreateToolForm (upload file) |
| Upload | `/v1/upload` | *(Amazon S3)* | CreateToolForm (icon upload) |
| Steps | `/v1/steps` | `steps` | `/compliance-hub` → ComplianceHubView |

---

## 1. Auth

### `POST /v1/auth/google` 🔓

Google OAuth callback — đổi `code` lấy token nội bộ.

**FE gọi khi:** Người dùng đăng nhập bằng Google OAuth.

**Request Body:**
```json
{
  "code": "string (optional)",
  "redirect_uri": "string (optional)",
  "credential": "string (optional - ID Token from Google Client-side SDK)"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "山田 太郎",
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "role": "sale"
  }
}
```

**DB:** Upsert vào `users` theo `google_id`

---

### `POST /v1/auth/refresh-token` 🔐

Làm mới access token bằng refresh token.

**FE gọi khi:** Access token hết hạn, FE tự động gọi trước khi retry request.

**Request Header:**
```http
Authorization: Bearer <refresh_token>
```

**Response `200`:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

---

### `GET /v1/auth/me` 🔐

Lấy thông tin user đang đăng nhập.

**FE gọi khi:** Khởi động app để lấy profile user.

**Response `200`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "山田 太郎",
  "first_name": "太郎",
  "last_name": "山田",
  "avatar_url": "https://...",
  "role": "sale",
  "is_active": true,
  "last_login": "2026-07-07T08:00:00Z"
}
```

**DB:** `SELECT * FROM users WHERE id = :id AND deleted_at IS NULL`

---

## 2. Categories

### `GET /v1/categories` 🔐

Lấy danh sách tất cả categories (hub) theo thứ tự.

**FE gọi khi:** Load FilterBar dropdown, dropdown chọn category trong `CreateToolForm`.

**Response `200`:**
```json
[
  { "id": 1, "name": "クリエイティブハブ", "order": 1 },
  { "id": 2, "name": "コンプライアンスハブ", "order": 2 },
  { "id": 3, "name": "データハブ", "order": 3 }
]
```

**DB:** `SELECT id, name, order FROM categories ORDER BY order ASC`

---

## 3. Users

### `GET /v1/users` 🔐

Lấy danh sách users với phân trang.

**FE gọi khi:** Load trang `/users` → `UserManagementTable`.

**Query Params:**

| Param | Kiểu | Mặc định | Mô tả |
|-------|------|---------|-------|
| `skip` | `integer` | `0` | Số bản ghi bỏ qua (offset) |
| `limit` | `integer` | `100` | Số bản ghi tối đa trả về |
| `role` | `string` | — | Filter theo role |
| `search` | `string` | — | Tìm theo tên hoặc email |

**Response `200`:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "山田 太郎",
      "email": "taro.yamada@example.com",
      "role": "sale",
      "last_login": "2026-06-25T00:00:00Z",
      "is_active": true
    }
  ],
  "total": 7,
  "skip": 0,
  "limit": 100
}
```

**DB:** `SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id`

---

### `GET /v1/users/:id` 🔐

Lấy chi tiết 1 user.

**Response `200`:** User object đầy đủ.

**DB:** `SELECT * FROM users WHERE id = :id AND deleted_at IS NULL`

---

### `PUT /v1/users/:id` 🛡️ Admin

Cập nhật thông tin user — chủ yếu dùng để thay đổi `role`.

**FE gọi khi:** Admin bấm "Lưu" trong modal `ChangeRoleModal`.

**Request Body:**
```json
{
  "role": "marketing"
}
```

**Response `200`:** User object đã cập nhật.

**DB:** `UPDATE users SET role = :role, updated_at = now() WHERE id = :id`

---

### `DELETE /v1/users/:id` 🛡️ Admin

Xóa mềm user (soft delete).

**Response `204`:** No content.

**DB:** `UPDATE users SET deleted_at = now() WHERE id = :id`

---

## 4. Tools

### `GET /v1/tools` 🔐

Lấy danh sách tools với filter.

**FE gọi khi:** Load Dashboard, Creative Hub, Compliance Hub, Data Hub, Manage Tools.

**Query Params:**

| Param | Kiểu | Mặc định | Mô tả |
|-------|------|---------|-------|
| `category_id` | `integer` | — | Filter theo category ID |
| `hub` | `string` | — | Filter theo category slug (`creative`, `compliance`, `data`) |
| `role` | `string` | — | Filter theo role được phép xem |
| `search` | `string` | — | Tìm kiếm theo tên, mô tả |
| `visibility` | `string` | `public` | `public` / `draft` / `all` (admin only) |
| `skip` | `integer` | `0` | Pagination offset |
| `limit` | `integer` | `20` | Pagination limit |

**Response `200`:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "ChatGPT",
      "description": "コンテンツ作成や文章生成を支援する高度なAI言語モデル。",
      "icon": "https://upload.wikimedia.org/...",
      "url": "https://chat.openai.com",
      "status": "公開中",
      "visibility": "public",
      "categories": [
        { "id": 1, "name": "クリエイティブハブ" }
      ],
      "roles": ["marketing"],
      "login_ids": ["chatgpt-user01@company.local"],
      "created_at": "2026-07-01T00:00:00Z",
      "updated_at": "2026-07-07T00:00:00Z"
    }
  ],
  "total": 30,
  "skip": 0,
  "limit": 20
}
```

**DB Join:**
```sql
SELECT t.*, 
       array_agg(DISTINCT c.id) AS category_ids,
       array_agg(DISTINCT c.name) AS category_names,
       array_agg(DISTINCT tr.role) AS roles
FROM tools t
LEFT JOIN tool_categories tc ON tc.tool_id = t.id
LEFT JOIN categories c ON c.id = tc.category_id
LEFT JOIN tool_roles tr ON tr.tool_id = t.id
WHERE t.deleted_at IS NULL
GROUP BY t.id
```

---

### `GET /v1/tools/:id` 🔐

Lấy chi tiết 1 tool kèm **toàn bộ** thông tin từ các bảng quan hệ.

**FE gọi khi:** Load trang `/tools/:id` → `ToolDetailView`.

**Response `200`:**
```json
{
  "id": 1,
  "name": "ChatGPT",
  "description": "コンテンツ作成や文章生成を支援する高度なAI言語モデル。",
  "icon": "/static/uploads/icons/abc123.png",
  "url": "https://chat.openai.com",
  "status": "公開中",
  "visibility": "public",
  "login_ids": ["chatgpt-user01@company.local"],
  "guide_content": "## 使い方\n...",
  "admin_memo": null,
  "details": {
    "inputs": ["商談データ"],
    "outputDescription": "分析レポート"
  },
  "categories": [
    { "id": 1, "name": "クリエイティブハブ", "order": 1 }
  ],
  "roles": ["marketing", "sale"],
  "guide_files": [
    {
      "id": 1,
      "tool_id": 1,
      "original_name": "ChatGPT_guide.pdf",
      "stored_name": "f7c3a2b1-abc.pdf",
      "file_path": "/static/uploads/guides/f7c3a2b1-abc.pdf",
      "file_url": "/static/uploads/guides/f7c3a2b1-abc.pdf",
      "mime_type": "application/pdf",
      "file_size": 204800,
      "order": 0,
      "created_at": "2026-07-07T08:00:00Z"
    }
  ],
  "prompts": [
    {
      "id": 1,
      "tool_id": 1,
      "title": "商談データ分析",
      "description": "CRMデータから顧客の課題を抽出するプロンプト",
      "content": "以下のデータに基づいて処理を行ってください。\n\n[※ここにデータをペーストしてください]",
      "is_recommended": true,
      "order": 0,
      "roles": ["sale", "marketing"],
      "categories": [
        { "id": 1, "name": "クリエイティブハブ", "order": 1 }
      ],
      "created_at": "2026-07-07T08:00:00Z",
      "updated_at": "2026-07-07T08:00:00Z"
    },
    {
      "id": 2,
      "tool_id": 1,
      "title": "要約プロンプト",
      "description": "長文テキストを簡潔にまとめる",
      "content": "以下の文章を300字以内で要約してください。\n\n[※ここにテキストをペーストしてください]",
      "is_recommended": false,
      "order": 1,
      "roles": [],
      "categories": [],
      "created_at": "2026-07-07T08:00:00Z",
      "updated_at": "2026-07-07T08:00:00Z"
    }
  ],
  "created_at": "2026-07-01T00:00:00Z",
  "updated_at": "2026-07-07T00:00:00Z"
}
```

> **Lưu ý:** `roles: []` và `categories: []` trong prompt có nghĩa là prompt đó hiển thị cho **tất cả** role và hub.

**DB Join:**
```sql
-- Lấy tool
SELECT * FROM tools WHERE id = :id AND deleted_at IS NULL;

-- Lấy categories (tool_categories)
SELECT c.* FROM categories c
JOIN tool_categories tc ON tc.category_id = c.id
WHERE tc.tool_id = :id ORDER BY c.order;

-- Lấy roles (tool_roles)
SELECT role FROM tool_roles WHERE tool_id = :id;

-- Lấy guide files
SELECT * FROM tool_guide_files WHERE tool_id = :id ORDER BY "order";

-- Lấy prompts kèm roles và categories
SELECT p.*,
       array_agg(DISTINCT pr.role) FILTER (WHERE pr.role IS NOT NULL) AS roles,
       json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name))
         FILTER (WHERE c.id IS NOT NULL) AS categories
FROM tool_prompts p
LEFT JOIN tool_prompt_roles pr ON pr.prompt_id = p.id
LEFT JOIN tool_prompt_categories pc ON pc.prompt_id = p.id
LEFT JOIN categories c ON c.id = pc.category_id
WHERE p.tool_id = :id
GROUP BY p.id
ORDER BY p."order";
```

---

### `POST /v1/tools` 🛡️ Admin

Tạo mới tool kèm **prompts** trong cùng 1 request.

**FE gọi khi:** Submit form `CreateToolForm`.

**Request Body:**
```json
{
  "name": "ChatGPT",
  "description": "コンテンツ作成や文章生成を支援する高度なAI言語モデル。",
  "icon": "/static/uploads/icons/abc123.png",
  "url": "https://chat.openai.com",
  "status": "公開中",
  "visibility": "public",
  "category_ids": [1],
  "roles": ["marketing"],
  "login_ids": ["chatgpt-user01@company.local"],
  "guide_content": "## 使い方\n...",
  "admin_memo": "2026/07: 初回登録",
  "step_id": 1,
  "details": {
    "inputs": ["商談データ"],
    "outputDescription": "分析レポート"
  },
  "prompts": [
    {
      "title": "基本プロンプト",
      "description": "標準的な実行手順テンプレート",
      "content": "以下のデータに基づいて処理を行ってください。\n\n[※ここにデータをペーストしてください]",
      "is_recommended": true,
      "order": 0,
      "roles": ["sale", "marketing"],
      "category_ids": [1]
    }
  ]
}
```

**Response `201`:** Tool object đầy đủ (cùng cấu trúc với `GET /v1/tools/:id`).

**Field `step_id`:**
| Field | Kiểu | Bắt buộc | Mô tả |
|-------|------|------------|-------|
| `step_id` | `integer \| null` | Không | ID của step trong Compliance Flow. Nếu để `null` hoặc bỏ qua, tool không gắn với step nào. |

**DB (trong 1 transaction):**
1. INSERT INTO `tools` (bao gồm `step_id` nếu có)
2. INSERT INTO `tool_categories` (các category_id)
3. INSERT INTO `tool_roles` (các role)
4. INSERT INTO `tool_prompts` (danh sách prompts)
5. INSERT INTO `tool_prompt_roles` (roles của từng prompt)
6. INSERT INTO `tool_prompt_categories` (categories của từng prompt)

---

### `PUT /v1/tools/:id` 🛡️ Admin

Cập nhật tool kèm **prompts** trong cùng 1 request.

**FE gọi khi:** Submit form edit trong `CreateToolForm` (edit mode).

**Request Body:** Tương tự POST (tất cả fields đều optional — partial update). Riêng `prompts`:
- Nếu truyền `prompts` → xóa toàn bộ prompts cũ và tạo lại
- Nếu không truyền `prompts` → giữ nguyên prompts hiện tại

**Response `200`:** Tool object đầy đủ (cùng cấu trúc với `GET /v1/tools/:id`).

**DB (trong 1 transaction):**
1. UPDATE `tools`
2. DELETE + INSERT lại `tool_categories`
3. DELETE + INSERT lại `tool_roles`
4. DELETE + INSERT lại `tool_prompts` (nếu có truyền)
5. DELETE + INSERT lại `tool_prompt_roles`
6. DELETE + INSERT lại `tool_prompt_categories`

---

### `DELETE /v1/tools/:id` 🛡️ Admin

Xóa mềm tool.

**FE gọi khi:** Bấm nút xóa trong `ToolManagementTable`.

**Response `204`:** No content.

**DB:** `UPDATE tools SET deleted_at = now() WHERE id = :id`

---

## 5. Tool Guide Files

### `POST /v1/tools/:id/guide-files` 🛡️ Admin

Upload file hướng dẫn đính kèm vào tool (multipart/form-data).

**FE gọi khi:** Kéo thả hoặc chọn file trong `CreateToolForm` phần "参考資料アップロード".

**Request:** `multipart/form-data`

| Field | Kiểu | Mô tả |
|-------|------|-------|
| `file` | `File` | File cần upload |
| `order` | `integer` | Thứ tự hiển thị (optional, default 0) |

**Giới hạn:**
- Max size: **10MB** mỗi file
- Định dạng: PDF, DOCX, XLSX, PPTX, TXT, MD

**Luồng xử lý (S3):**
1. Backend nhận file qua `multipart/form-data`
2. Tạo `stored_name` = `{uuid4}.{ext}` để tránh trùng
3. Upload lên S3 bucket qua `boto3` (AWS SDK): `s3_client.upload_fileobj(file, bucket, key)`
4. S3 key: `guides/{tool_id}/{stored_name}`
5. Tạo presigned URL (expires 7 ngày) hoặc public URL tùy config bucket
6. INSERT record vào `tool_guide_files` với `file_path` = S3 key, `file_url` = URL công khai/presigned

**Response `201`:**
```json
{
  "id": 1,
  "tool_id": 1,
  "original_name": "ChatGPT_guide.pdf",
  "stored_name": "f7c3a2b1-abc.pdf",
  "file_path": "guides/1/f7c3a2b1-abc.pdf",
  "file_url": "https://<bucket>.s3.<region>.amazonaws.com/guides/1/f7c3a2b1-abc.pdf",
  "mime_type": "application/pdf",
  "file_size": 204800,
  "order": 0,
  "created_at": "2026-07-07T08:00:00Z"
}
```

**DB:** INSERT INTO `tool_guide_files`

---

### `GET /v1/tools/:id/guide-files` 🔐

Lấy danh sách file đính kèm của tool.

**Response `200`:** Array của guide file objects.

---

### `DELETE /v1/tools/:id/guide-files/:file_id` 🛡️ Admin

Xóa file đính kèm.

**Response `204`:** No content.

> ⚠️ Cần xóa cả file vật lý trên disk/S3 sau khi xóa record.

---

## 7. Upload (Icon)

### `POST /v1/upload/icon-from-url` 🔐 *(Khuyến nghị)*

Nhận vào **URL của một website**, backend tự động tìm và trả về **URL favicon** của site đó. Không cần upload file.

**FE gọi khi:** Người dùng nhập URL tool (vd: `https://chatgpt.com`) → FE gọi endpoint này để lấy icon tự động.

**Request:** `application/json`

```json
{
  "url": "https://chatgpt.com"
}
```

**Chiến lược tìm favicon (theo thứ tự ưu tiên):**

| Bước | Chiến lược | Mô tả |
|------|-----------|-------|
| 1 | HTML `<link rel="icon">` | Parse `<head>` HTML của trang, tìm tag `<link rel="icon">`, `<link rel="shortcut icon">`, `<link rel="apple-touch-icon">` |
| 2 | `/favicon.ico` | Thử truy cập `{origin}/favicon.ico` trực tiếp |
| 3 | Google Favicon API | Fallback về `https://www.google.com/s2/favicons?domain=...&sz=64` (luôn trả về kết quả) |

**Response `200`:**
```json
{
  "url": "https://cdn.oaistatic.com/favicon.ico",
  "source": "html_link_tag"
}
```

| Field | Giá trị có thể có |
|-------|------------------|
| `url` | URL favicon tìm được |
| `source` | `html_link_tag` \| `favicon_ico` \| `google_favicon_api` |

**Lỗi:**
- `400` — URL không hợp lệ (không parse được domain)
- `422` — Body thiếu field `url`

---

### `POST /v1/upload/icon` 🔐 *(Upload thủ công)*

Upload file ảnh icon trực tiếp lên server.

**FE gọi khi:** Người dùng chọn file ảnh thủ công trong `CreateToolForm`.

**Request:** `multipart/form-data`

| Field | Kiểu | Mô tả |
|-------|------|-------|
| `file` | `File` | File ảnh |

**Giới hạn:**
- Max size: **2MB**
- Định dạng: PNG, JPG, JPEG, WEBP

**Response `200`:**
```json
{
  "url": "/static/uploads/icons/f7c3a2b1.png"
}
```

---


## 8. Steps

### `GET /v1/steps` 🔐

Lấy tất cả steps theo thứ tự.

**FE gọi khi:** Load phần "コンプライアンスフロー" trong `ComplianceHubView`.

**Response `200`:**
```json
[
  {
    "id": 1,
    "order": 1,
    "icon": "🛡️",
    "title": "セキュリティポリシー確認",
    "description": "社内の安全基準およびセキュリティポリシーへの適合性を自動でスキャンします。"
  },
  {
    "id": 2,
    "order": 2,
    "icon": "🔍",
    "title": "機密データ検出",
    "description": "個人情報（PII）や保護すべき重要な機密情報の有無を厳格にチェックします。"
  }
]
```

**DB:** `SELECT * FROM steps ORDER BY "order" ASC`

---

### `POST /v1/steps` 🛡️ Admin — Bulk Save

Ghi lại toàn bộ thứ tự steps sau khi drag-drop.

**FE gọi khi:** Người dùng kéo thả xong trong `ComplianceHubView`.

**Request Body:**
```json
[
  { "id": 1, "order": 1, "icon": "🛡️", "title": "セキュリティポリシー確認", "description": "..." },
  { "id": 2, "order": 2, "icon": "🔍", "title": "機密データ検出", "description": "..." }
]
```

**Response `200`:** Danh sách steps đã lưu.

**DB:** DELETE all → INSERT all (atomic transaction)

---

### `GET /v1/steps/:id` 🔐

Lấy chi tiết 1 step.

**Response `200`:** Step object.

---

### `PUT /v1/steps/:id` 🛡️ Admin

Cập nhật 1 step.

**Request Body:**
```json
{
  "icon": "🔍",
  "title": "機密データ検出",
  "description": "...",
  "order": 2
}
```

**Response `200`:** Step object đã cập nhật.

---

### `DELETE /v1/steps/:id` 🛡️ Admin

Xóa 1 step.

**Response `204`:** No content.

---

## Mapping tổng hợp FE ↔ API ↔ DB

| FE Component | Action | API | DB Tables |
|-------------|--------|-----|-----------|
| Login page | Đăng nhập Google | `POST /v1/auth/google` | `users` |
| App init | Lấy user hiện tại | `GET /v1/auth/me` | `users` |
| Any page | Token hết hạn | `POST /v1/auth/refresh-token` | — |
| FilterBar | Load danh sách hub | `GET /v1/categories` | `categories` |
| Dashboard | Load tất cả tools | `GET /v1/tools` | `tools`, `tool_categories`, `tool_roles` |
| Creative Hub | Filter creative tools | `GET /v1/tools?hub=creative` | `tools`, `tool_categories` |
| Compliance Hub | Filter compliance tools | `GET /v1/tools?hub=compliance` | `tools`, `tool_categories` |
| Data Hub | Filter data tools | `GET /v1/tools?hub=data` | `tools`, `tool_categories` |
| ToolDetailView | Load tool + prompts | `GET /v1/tools/:id` | `tools`, `tool_prompts`, `tool_guide_files`, join tables |
| ToolDetailView | Filter prompts | `GET /v1/tools/:id/prompts?role=sale` | `tool_prompts`, `tool_prompt_roles`, `tool_prompt_categories` |
| CreateToolForm | Upload icon | `POST /v1/upload/icon` | *(Amazon S3)* |
| CreateToolForm | Tạo tool mới | `POST /v1/tools` | `tools`, `tool_categories`, `tool_roles` |
| CreateToolForm | Upload file guide | `POST /v1/tools/:id/guide-files` | `tool_guide_files` |
| CreateToolForm (edit) | Cập nhật tool | `PUT /v1/tools/:id` | `tools`, join tables |
| ToolManagementTable | Load all tools (admin) | `GET /v1/tools?visibility=all` | `tools`, `tool_categories`, `tool_roles` |
| ToolManagementTable | Xóa tool | `DELETE /v1/tools/:id` | `tools` (soft delete) |
| UserManagementTable | Load users | `GET /v1/users` | `users` |
| UserManagementTable (modal) | Đổi role | `PUT /v1/users/:id` | `users` |
| ComplianceHubView | Load flow | `GET /v1/steps` | `steps` |
| ComplianceHubView | Drag-drop reorder | `POST /v1/steps` | `steps` |
| ComplianceHubView | Thêm step | `PUT /v1/steps/:id` hoặc bulk save | `steps` |
| ComplianceHubView | Xóa step | `DELETE /v1/steps/:id` | `steps` |

---

## Ghi chú thiết kế

### Google OAuth Flow
1. FE redirect: `GET https://accounts.google.com/o/oauth2/v2/auth?...`
2. Google redirect về: `GET /v1/auth/google/callback?code=...`
3. Backend exchange code → `access_token` + `id_token`
4. Decode `id_token` → lấy `sub` (google_id), `email`, `name`, `picture`
5. Upsert `users` theo `google_id`
6. Phát JWT nội bộ → trả về FE

### Phân quyền filter tools
Tools có thể gắn với nhiều role qua bảng `tool_roles`:
- Nếu `tool_roles` rỗng → hiển thị cho tất cả user
- Nếu có rows → chỉ user có role trong danh sách mới thấy
- FE nên truyền `role=<user.role>` khi gọi `GET /v1/tools` để backend tự filter

### Pagination chuẩn
Tất cả endpoint list trả về format:
```json
{ "items": [...], "total": 100, "skip": 0, "limit": 20 }
```

### File Upload giới hạn
| Loại file | Max size | Endpoint | Storage |
|-----------|---------|----------|---------|
| Icon (ảnh) | 2 MB | `POST /v1/upload/icon` | Amazon S3 — key: `icons/{uuid}.{ext}` |
| Guide file (tài liệu) | 10 MB | `POST /v1/tools/:id/guide-files` | Amazon S3 — key: `guides/{tool_id}/{uuid}.{ext}` |

### S3 SDK — boto3
Backend sử dụng **`boto3`** (AWS SDK for Python) để tương tác với S3:

```python
import boto3

s3_client = boto3.client(
    's3',
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

# Upload file
s3_client.upload_fileobj(
    file_obj,
    settings.AWS_S3_BUCKET_NAME,
    s3_key,                          # vd: "icons/uuid.png"
    ExtraArgs={'ContentType': mime_type},
)

# Public URL
file_url = f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
```

> **Lưu ý xóa file:** Khi xóa record `tool_guide_files` hoặc soft-delete tool, cần gọi thêm:
> ```python
> s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=file_path)
> ```

