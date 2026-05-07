import { env } from "../config/env.js"; import { logger } from "../utils/logger.js";
interface Opts{to:string|string[];subject:string;html:string;text?:string;}
export const emailService={
  async send(o:Opts){ if(!env.RESEND_API_KEY){logger.warn("No RESEND_API_KEY");return;} const{Resend}=await import("resend"); const{error}=await new Resend(env.RESEND_API_KEY).emails.send({from:env.FROM_EMAIL,to:o.to,subject:o.subject,html:o.html,text:o.text}); if(error) throw new Error(error.message); },
  sendWelcome:(to:string,name:string)=>emailService.send({to,subject:"Welcome!",html:`<h1>Welcome, ${name}!</h1>`}),
  sendPasswordReset:(to:string,link:string)=>emailService.send({to,subject:"Reset password",html:`<p><a href="${link}">Reset</a> — expires 1hr</p>`}),
};
