import assert from 'node:assert/strict';
import sharp from 'sharp';
import { preparePlayerPhoto } from '../dist/server/src/lib/player-photo.js';

// Different corners catch permanent cropping even if the output ratio looks right.
for (const [width,height] of [[700,500],[500,900],[1800,450]]) {
  const pixels=Buffer.alloc(width*height*3);
  const colors=[[240,20,20],[20,240,20],[20,20,240],[240,240,20]];
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const color=colors[(y>=height/2?2:0)+(x>=width/2?1:0)];
    for(let channel=0;channel<3;channel++)pixels[(y*width+x)*3+channel]=color[channel];
  }
  const input=await sharp(pixels,{raw:{width,height,channels:3}}).png().toBuffer();
  const output=await preparePlayerPhoto(input);
  const {data,info}=await sharp(output).removeAlpha().raw().toBuffer({resolveWithObject:true});
  assert.ok(Math.abs(info.width/info.height-width/height)<0.01,'Original aspect ratio must survive');
  assert.ok(output.length<=48*1024);assert.ok(Math.max(info.width,info.height)<=1024);
  const points=[[2,2],[info.width-3,2],[2,info.height-3],[info.width-3,info.height-3]];
  points.forEach(([x,y],index)=>colors[index].forEach((expected,channel)=>assert.ok(Math.abs(data[(y*info.width+x)*3+channel]-expected)<35,'Each original corner must be retained')));
}
const rotated=await sharp({create:{width:700,height:500,channels:3,background:'#346747'}}).jpeg().withMetadata({orientation:6}).toBuffer();
const corrected=await sharp(await preparePlayerPhoto(rotated)).metadata();
assert.equal(corrected.width,500);assert.equal(corrected.height,700);assert.equal(corrected.exif,undefined);
console.log('Full-photo checks passed: portrait, landscape, wide images, all four edges, orientation, metadata stripping and 48 KB storage cap.');
