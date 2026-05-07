export type Database = {
  public: {
    Tables: {
      users: { Row:{ id:string;email:string;name:string|null;role:string;is_active:boolean;avatar_url:string|null;last_login_at:string|null;created_at:string;updated_at:string; }; Insert:Omit<Database["public"]["Tables"]["users"]["Row"],"created_at"|"updated_at">; Update:Partial<Database["public"]["Tables"]["users"]["Insert"]>; };
      api_keys: { Row:{ id:string;user_id:string;name:string;key_hash:string;key_preview:string;scopes:string[];last_used_at:string|null;expires_at:string|null;is_active:boolean;created_at:string; }; Insert:Omit<Database["public"]["Tables"]["api_keys"]["Row"],"id"|"created_at">; Update:Partial<Database["public"]["Tables"]["api_keys"]["Insert"]>; };
      refresh_tokens: { Row:{ id:string;user_id:string;token_hash:string;expires_at:string;is_revoked:boolean;created_at:string; }; Insert:Omit<Database["public"]["Tables"]["refresh_tokens"]["Row"],"id"|"created_at">; Update:Partial<Database["public"]["Tables"]["refresh_tokens"]["Insert"]>; };
      todos: { Row:{ id:string;user_id:string;title:string;description:string|null;completed:boolean;created_at:string;updated_at:string; }; Insert:Omit<Database["public"]["Tables"]["todos"]["Row"],"id"|"created_at"|"updated_at">; Update:Partial<Database["public"]["Tables"]["todos"]["Insert"]>; };
    };
    Views: Record<string,never>; Functions: Record<string,never>;
    Enums: { user_role:"admin"|"user"|"moderator" };
  };
};
