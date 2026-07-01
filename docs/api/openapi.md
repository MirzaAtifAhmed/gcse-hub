# API Documentation

The API exposes a lightweight OpenAPI document at:

```txt
GET /api/docs
```

Health check:

```txt
GET /api/health
```

Authentication uses JWT in either:

- the `Authorization: Bearer <token>` header, or
- the secure `token` cookie set by login/register.
