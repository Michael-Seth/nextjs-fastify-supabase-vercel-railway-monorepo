import crypto from "crypto"; import { env } from "../../config/env.js";
export const generateApiKey=()=>`${env.API_KEY_PREFIX}${crypto.randomBytes(32).toString("base64url")}`;
export const hashApiKey=(k:string)=>crypto.createHash("sha256").update(k).digest("hex");
export const previewApiKey=(k:string)=>k.slice(0,12)+"…"+k.slice(-4);
