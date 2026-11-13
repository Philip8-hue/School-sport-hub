/** Rollout switch: verification remains available, but does not restrict daily use until explicitly enabled. */
export const verificationEnforced=()=>process.env.REQUIRE_EMAIL_VERIFICATION==='true';
export const requiresEmailVerification=(user:{role?:string;emailVerificationRequired?:boolean})=>user.role!=='ADMIN'&&verificationEnforced()&&user.emailVerificationRequired===true;

export const anchorEmailDeadline='2026-11-14T23:59:00+01:00';
export const verifiedSignInRequired=()=>process.env.REQUIRE_VERIFIED_SIGN_IN==='true';
export const studentEmailDomain=()=>verifiedSignInRequired()
 ? (Date.now()>=Date.parse(anchorEmailDeadline)?'student.aul.edu.ng':'')
 : process.env.ANCHOR_STUDENT_EMAIL_DOMAIN?.trim().toLowerCase()||'';
export const unverifiedSignIn=(user:{emailVerifiedAt?:Date|null})=>verifiedSignInRequired()&&!user.emailVerifiedAt;
export const isStudentEmail=(email:string)=>email.toLowerCase().split('@').at(-1)===(studentEmailDomain()||'student.aul.edu.ng');
export function studentSignInError(user:{role:string;email:string;emailVerifiedAt?:Date|null}){
 if(user.role!=='USER'||!studentEmailDomain())return null;
 if(!isStudentEmail(user.email))return 'SCHOOL_EMAIL_REQUIRED';
 return user.emailVerifiedAt?null:'SCHOOL_EMAIL_UNVERIFIED';
}
export const studentViewLocked=(user:{role:string;accountType?:string})=>
 Boolean(studentEmailDomain()&&user.role==='USER'&&user.accountType==='PLAYER');
