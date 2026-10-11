# api-auth

Shared authentication building blocks for API libraries:

- `AuthGuard` – verifies the `Bearer` JWT and puts its payload on `request.user`
- `@CurrentUserId()` – route param decorator returning `request.user.sub`

`JwtService` is provided by the global `JwtModule` registered in `apps/api` `AuthModule`.
