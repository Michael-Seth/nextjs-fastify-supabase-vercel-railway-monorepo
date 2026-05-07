import { supabaseAdmin } from "../config/database.js";

export interface StorageObject {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: Record<string, unknown> | null;
}
export class DatabaseError extends Error {
  constructor(
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}
const raise = (m: string, c?: string): never => {
  throw new DatabaseError(m, c);
};
export const db = {
  async findMany<T>(
    table: string,
    opts?: {
      select?: string;
      filters?: Record<string, unknown>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    }
  ): Promise<T[]> {
    let q = supabaseAdmin.from(table).select(opts?.select ?? "*");
    for (const [k, v] of Object.entries(opts?.filters ?? {}))
      if (v != null) q = q.eq(k, v as never);
    if (opts?.orderBy)
      q = q.order(opts.orderBy.column, { ascending: opts.orderBy.ascending ?? true });
    if (opts?.limit) q = q.limit(opts.limit);
    if (opts?.offset && opts.limit) q = q.range(opts.offset, opts.offset + opts.limit - 1);
    const { data, error } = await q;
    if (error) raise(error.message, error.code);
    return (data as T[]) ?? [];
  },
  async findOne<T>(
    table: string,
    filters: Record<string, unknown>,
    select = "*"
  ): Promise<T | null> {
    let q = supabaseAdmin.from(table).select(select);
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v as never);
    const { data, error } = await q.maybeSingle();
    if (error) raise(error.message, error.code);
    return data as T | null;
  },
  async create<T>(table: string, payload: Record<string, unknown>): Promise<T> {
    const { data, error } = await supabaseAdmin
      .from(table)
      .insert(payload as unknown as never)
      .select()
      .single();
    if (error) raise(error.message, error.code);
    return data as T;
  },
  async update<T>(
    table: string,
    filters: Record<string, unknown>,
    payload: Record<string, unknown>
  ): Promise<T> {
    let q = supabaseAdmin.from(table).update(payload as unknown as never);
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v as never);
    const { data, error } = await q.select().single();
    if (error) raise(error.message, error.code);
    return data as T;
  },
  async upsert<T>(
    table: string,
    payload: Record<string, unknown>,
    onConflict?: string
  ): Promise<T> {
    const { data, error } = await supabaseAdmin
      .from(table)
      .upsert(payload as unknown as never, onConflict ? { onConflict } : undefined)
      .select()
      .single();
    if (error) raise(error.message, error.code);
    return data as T;
  },
  async delete(table: string, filters: Record<string, unknown>): Promise<void> {
    let q = supabaseAdmin.from(table).delete();
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v as never);
    const { error } = await q;
    if (error) raise(error.message, error.code);
  },
  async count(table: string, filters?: Record<string, unknown>): Promise<number> {
    let q = supabaseAdmin.from(table).select("*", { count: "exact", head: true });
    for (const [k, v] of Object.entries(filters ?? {})) q = q.eq(k, v as never);
    const { count, error } = await q;
    if (error) raise(error.message, error.code);
    return count ?? 0;
  },
  async rpc<T>(fn: string, params?: Record<string, unknown>): Promise<T> {
    const { data, error } = await supabaseAdmin.rpc(
      fn as unknown as never,
      params as unknown as never
    );
    if (error) raise(error.message, error.code);
    return data as T;
  },
  auth: {
    async createUser(email: string, password: string, metadata?: Record<string, unknown>) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: metadata,
        email_confirm: true,
      });
      if (error) raise(error.message);
      return data.user;
    },
    async getUserById(id: string) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
      if (error) raise(error.message);
      return data.user;
    },
    async updateUser(
      id: string,
      attrs: { email?: string; password?: string; user_metadata?: Record<string, unknown> }
    ) {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, attrs);
      if (error) raise(error.message);
      return data.user;
    },
    async deleteUser(id: string) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) raise(error.message);
    },
    async listUsers(page = 1, perPage = 50) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) raise(error.message);
      return data;
    },
  },
  storage: {
    async upload(bucket: string, filePath: string, file: Buffer, contentType?: string) {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file, { contentType, upsert: true });
      if (error) raise(error.message);
      return data;
    },
    getPublicUrl: (bucket: string, filePath: string) =>
      supabaseAdmin.storage.from(bucket).getPublicUrl(filePath).data.publicUrl,
    async download(bucket: string, filePath: string) {
      const { data, error } = await supabaseAdmin.storage.from(bucket).download(filePath);
      if (error) raise(error.message);
      return data;
    },
    async remove(bucket: string, paths: string[]) {
      const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
      if (error) raise(error.message);
    },
    async list(bucket: string, folder?: string): Promise<StorageObject[]> {
      const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder);
      if (error) raise(error.message);
      return (data ?? []) as StorageObject[];
    },
  },
};
