-- Run in Supabase SQL editor
CREATE TABLE IF NOT EXISTS public.users (id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,email TEXT NOT NULL UNIQUE,name TEXT,role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user','moderator')),is_active BOOLEAN NOT NULL DEFAULT TRUE,avatar_url TEXT,last_login_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.refresh_tokens (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,token_hash TEXT NOT NULL UNIQUE,expires_at TIMESTAMPTZ NOT NULL,is_revoked BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.api_keys (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,name TEXT NOT NULL,key_hash TEXT NOT NULL UNIQUE,key_preview TEXT NOT NULL,scopes TEXT[] NOT NULL DEFAULT ARRAY['*'],last_used_at TIMESTAMPTZ,expires_at TIMESTAMPTZ,is_active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.todos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,title TEXT NOT NULL,description TEXT,completed BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at=NOW(); RETURN NEW; END; $$;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER todos_updated_at BEFORE UPDATE ON public.todos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY; ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY; ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own" ON public.users FOR ALL USING (auth.uid()=id OR (SELECT role FROM public.users WHERE id=auth.uid())='admin');
CREATE POLICY "todos_own" ON public.todos FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "apikeys_own" ON public.api_keys FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "tokens_own" ON public.refresh_tokens FOR ALL USING (auth.uid()=user_id);
CREATE INDEX IF NOT EXISTS idx_rt_user ON public.refresh_tokens(user_id); CREATE INDEX IF NOT EXISTS idx_rt_hash ON public.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_ak_user ON public.api_keys(user_id); CREATE INDEX IF NOT EXISTS idx_ak_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_todos_user ON public.todos(user_id);
