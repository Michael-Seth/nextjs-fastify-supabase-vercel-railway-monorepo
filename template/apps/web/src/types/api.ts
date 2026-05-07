export interface User {
  id: string; email: string; name: string | null; role: "admin" | "user" | "moderator";
  is_active: boolean; avatar_url: string | null; created_at: string;
}
export interface TokenPair { accessToken: string; refreshToken: string; expiresIn: number; }
export interface AuthResponse { user: User; tokens: TokenPair; }
export interface ApiError { statusCode: number; error: string; message: string; }
export interface PaginatedResult<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; };
}
export interface Todo { id: string; user_id: string; title: string; description: string | null; completed: boolean; created_at: string; updated_at: string; }
export interface ApiKey { id: string; user_id: string; name: string; key_preview: string; scopes: string[]; is_active: boolean; created_at: string; last_used_at: string | null; }
