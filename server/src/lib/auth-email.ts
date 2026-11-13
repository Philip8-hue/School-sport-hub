import type {Request} from 'express';
import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {audit,hashToken} from './auth-security.js';
function deliveryConfig(){
 const provider=process.env.AUTH_EMAIL_PROVIDER||'resend';
 if(provider==='brevo'&&process.env.BREVO_API_KEY&&process.env.BREVO_SENDER_EMAIL){
  return {provider,apiKey:process.env.BREVO_API_KEY,from:process.env.BREVO_SENDER_EMAIL} as const;
 }
 if(provider==='resend'&&process.env.RESEND_API_KEY&&process.env.EMAIL_FROM){
  return {provider,apiKey:process.env.RESEND_API_KEY,from:process.env.EMAIL_FROM} as const;
 }
 return null;
}
export function emailConfigured(){return Boolean(deliveryConfig()&&process.env.APP_BASE_URL&&appBase());}
export function appBase(){const value=process.env.APP_BASE_URL||(process.env.NODE_ENV!=='production'&&process.env.VERCEL!=='1'?'http://localhost:5000':'');if(!value)return null;try{const url=new URL(value);if(url.username||url.password||url.search||url.hash)return null;if(url.protocol!=='https:'&&!(['localhost','127.0.0.1','127.0.0.2'].includes(url.hostname)&&process.env.VERCEL!=='1'&&process.env.NODE_ENV!=='production'))return null;return url.origin;}catch{return null;}}
export async function sendAuthEmail(r:Request,user:{id:number;email:string},purpose:'RESET'|'VERIFY'|'NOTICE'|'EMAIL_CHANGE',raw?:string){const base=appBase();const link=base&&raw?`${base}/${purpose==='RESET'?'reset-password':'verify-email'}.html#token=${raw}${purpose==='EMAIL_CHANGE'?'&change=1':''}`:null;const subject=purpose==='RESET'?'Reset your Sports Hub password':purpose==='EMAIL_CHANGE'?'Confirm your new Sports Hub email':purpose==='VERIFY'?'Verify your Sports Hub email':'Your Sports Hub password was changed';const text=purpose==='NOTICE'?'Your Sports Hub password was changed. All previous sessions were signed out. If this was not you, use Forgot password on the official site to secure your account.':`${purpose==='RESET'?'Reset your password within 15 minutes':purpose==='EMAIL_CHANGE'?'Confirm your new email within 24 hours':'Verify your email within 24 hours'} using this single-use link:\n${link}\n\nIf you did not request this, ignore this email. Never share this link. Password recovery does not remove authenticator verification.`;
 if(process.env.NODE_ENV==='test'&&process.env.AUTH_TEST_EMAIL_DIR&&process.env.VERCEL!=='1'&&process.env.DATABASE_PROVIDER==='sqlite'){await mkdir(process.env.AUTH_TEST_EMAIL_DIR,{recursive:true});await writeFile(path.join(process.env.AUTH_TEST_EMAIL_DIR,hashToken(user.email+purpose)+'.json'),JSON.stringify({to:user.email,purpose,link,text}));return true;}
 const delivery=deliveryConfig();
 if(!base||!process.env.APP_BASE_URL||!delivery||(purpose!=='NOTICE'&&!link)){await audit(r,'EMAIL_NOT_CONFIGURED',user.id);return false;}
 try{
  const timeout=AbortSignal.timeout(8000);
  const response=delivery.provider==='brevo'
   ?await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',signal:timeout,headers:{'api-key':delivery.apiKey,'Content-Type':'application/json'},body:JSON.stringify({sender:{name:'Sports Hub',email:delivery.from},to:[{email:user.email}],subject,textContent:text})})
   :await fetch('https://api.resend.com/emails',{method:'POST',signal:timeout,headers:{Authorization:`Bearer ${delivery.apiKey}`,'Content-Type':'application/json','Idempotency-Key':hashToken((raw||'notice')+user.id+purpose+(raw?'':Date.now()))},body:JSON.stringify({from:delivery.from,to:[user.email],subject,text})});
  if(!response.ok)throw new Error('delivery');
  await audit(r,'EMAIL_SENT_'+purpose,user.id);return true;
 }catch{await audit(r,'EMAIL_DELIVERY_FAILED',user.id);return false;}}
