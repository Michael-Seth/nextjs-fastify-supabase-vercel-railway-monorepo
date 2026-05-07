import { describe,it,expect } from "vitest"; import { buildApp } from "../../../app.js";
describe("Auth",()=>{
  it("GET /me without token → 401",async()=>{ const a=await buildApp(); const r=await a.inject({method:"GET",url:"/api/v1/auth/me"}); expect(r.statusCode).toBe(401); await a.close(); });
  it("POST /register validates email",async()=>{ const a=await buildApp(); const r=await a.inject({method:"POST",url:"/api/v1/auth/register",payload:{email:"bad",password:"Test1234!"}}); expect(r.statusCode).toBe(422); await a.close(); });
});
