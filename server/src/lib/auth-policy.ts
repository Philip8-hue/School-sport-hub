/** Rollout switch: verification remains available, but does not restrict daily use until explicitly enabled. */
export const verificationEnforced=()=>process.env.REQUIRE_EMAIL_VERIFICATION==='true';
export const requiresEmailVerification=(user:{role?:string;emailVerificationRequired?:boolean})=>user.role!=='ADMIN'&&verificationEnforced()&&user.emailVerificationRequired===true;

export const studentEmailDomain=()=>process.env.ANCHOR_STUDENT_EMAIL_DOMAIN?.trim().toLowerCase()||'';
export const isStudentEmail=(email:string)=>email.toLowerCase().split('@').at(-1)===studentEmailDomain();
export function studentSignInError(user:{role:string;email:string;emailVerifiedAt?:Date|null}){
 if(user.role!=='USER'||!studentEmailDomain())return null;
 if(!isStudentEmail(user.email))return 'SCHOOL_EMAIL_REQUIRED';
 return user.emailVerifiedAt?null:'SCHOOL_EMAIL_UNVERIFIED';
}
export const studentViewLocked=(user:{role:string;accountType?:string})=>
 Boolean(studentEmailDomain()&&user.role==='USER'&&user.accountType==='PLAYER');
