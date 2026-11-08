/** Rollout switch: verification remains available, but does not restrict daily use until explicitly enabled. */
export const verificationEnforced=()=>process.env.REQUIRE_EMAIL_VERIFICATION==='true';
export const requiresEmailVerification=(user:{role?:string;emailVerificationRequired?:boolean})=>user.role!=='ADMIN'&&verificationEnforced()&&user.emailVerificationRequired===true;
