# API Contract P0 (FE/BE Shared)

## 1) Scope
- This document defines shared API request/response contracts for P0 flow.
- Included endpoints:
  - `POST /api/upload/image`
  - `POST /api/products/create` (consumes uploaded image metadata)

## 2) Common Response Envelope
### Success
```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "string",
  "error": {
    "code": "STRING_CODE",
    "details": null
  }
}
```

Rules:
- `data` is always a flat object for endpoint payload.
- Do not return nested wrappers like `data.url.url`.
- `error.code` is stable and must be used by FE for handling.

## 3) Upload Image API
### Endpoint
- Method: `POST`
- Path: `/api/upload/image`
- Auth: required (Bearer token)
- Content-Type: `multipart/form-data`

### Request
- Form field:
  - `file`: binary image file

### Success Response (`200`)
```json
{
  "success": true,
  "message": "Upload file thành công",
  "data": {
    "url": "https://cdn.example.com/products/1713030123-abc123.jpg",
    "key": "products/1713030123-abc123.jpg",
    "mime": "image/jpeg",
    "size": 245123
  }
}
```

Field meaning:
- `url`: public URL for rendering image.
- `key`: storage object key for DB persistence and later delete/replace.
- `mime`: uploaded file MIME type.
- `size`: file size in bytes.

### Error Codes
- `400` + `UPLOAD_NO_FILE`: file is missing.
- `401` + `UNAUTHORIZED`: missing/invalid token.
- `500` + `INTERNAL_SERVER_ERROR`: unexpected server error.

## 4) Create Product API (P0 usage)
### Endpoint
- Method: `POST`
- Path: `/api/products/create`
- Auth: required
- Content-Type: `application/json`

### Request (minimum fields)
```json
{
  "name": "Product name",
  "description": "Product description",
  "category_id": "category-id",
  "base_price": 100000,
  "stock_quantity": 10,
  "image_url": "https://cdn.example.com/products/1713030123-abc123.jpg"
}
```

P0 flow:
1. FE uploads image via `/api/upload/image`.
2. FE receives `{ url, key, mime, size }`.
3. FE sends `image_url = data.url` into create product payload.
4. Optional: BE can store `key` in DB in next phase for robust delete/replace workflow.

## 5) FE Integration Notes
- FE should rely on `error.code`, not free-text `message`.
- FE should not infer nested fields; use exact contract keys.
- FE should treat contract changes as breaking and require spec update.
