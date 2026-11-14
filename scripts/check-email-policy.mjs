import assert from 'node:assert/strict';
import {isStudentEmail, studentViewLocked} from '../dist/server/src/lib/auth-policy.js';
assert.equal(isStudentEmail('person@student.aul.edu.ng'),true);
assert.equal(isStudentEmail('person@student.aul.edu.ng.example'),false);
assert.equal(studentViewLocked({role:'USER',accountType:'PLAYER'}),true);
assert.equal(studentViewLocked({role:'ADMIN',accountType:'PLAYER'}),false);
console.log('Optional school email correction and player view checks passed.');
