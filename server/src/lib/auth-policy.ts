export const isStudentEmail=(email:string)=>email.toLowerCase().split('@').at(-1)==='student.aul.edu.ng';
export const studentViewLocked=(user:{role:string;accountType?:string})=>
 user.role==='USER'&&user.accountType==='PLAYER';
