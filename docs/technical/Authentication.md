# Authentication

Sprint 1 uses JWT authentication.

## Roles

- student
- parent
- admin

## Current behaviour

- Login returns JWT
- JWT is stored in local storage for development
- HTTP-only cookie is also set by the API
- Protected routes require valid authentication

Future versions should add refresh tokens and stricter production cookie handling.
