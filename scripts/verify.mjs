import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadGeometry} from './audit-models.mjs';
import * as THREE from '../assets/vendor/three.module.js';
import {normalizeModel,attachNativeAnimation} from '../assets/model-quality.js';
import {LESSONS} from '../assets/lessons.js';
import {GUIDES} from '../assets/learning-guides.js';
import {diagram,animateDiagram} from '../assets/diagrams.js';
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-5,`${actual} != ${expected}`);
const root=new THREE.Group();root.scale.set(2,3,4);root.position.set(8,-3,5);root.add(new THREE.Mesh(new THREE.BoxGeometry()));normalizeModel(root);near(root.scale.y/root.scale.x,1.5);near(root.scale.z/root.scale.x,2);near(new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3()).length(),0);
let count=0;
for(const folder of await fs.readdir('models')){
 if(folder==='angiology')continue;
 const file=`models/${folder}/scene.gltf`;
 const json=JSON.parse(await fs.readFile(file));
 for(const item of [...json.buffers,...(json.images||[])])if(item.uri&&!item.uri.startsWith('data:'))await fs.access(`models/${folder}/${decodeURIComponent(item.uri)}`);
 const gltf=await loadGeometry(file);normalizeModel(gltf.scene);
 const bounds=new THREE.Box3().setFromObject(gltf.scene),size=bounds.getSize(new THREE.Vector3());near(Math.max(...size.toArray()),3);near(bounds.getCenter(new THREE.Vector3()).length(),0);
 if(folder==='human_heart_3d_model'){
  assert.ok(attachNativeAnimation(gltf.scene,gltf.animations));
  const pose=()=>{gltf.scene.updateMatrixWorld(true);const values=[];gltf.scene.traverse(o=>{if(o.isBone)values.push(...o.matrixWorld.elements);});return values;};
  const initial=pose();assert.ok(initial.length>0);gltf.scene.userData.animateNative(.25);assert.notDeepEqual(pose(),initial);gltf.scene.userData.resetNative();assert.deepEqual(pose(),initial);gltf.scene.userData.disposeAnimation();
 }
 count++;
}
assert.equal(count,9);
assert.equal(Object.keys(LESSONS).length,10);
const diagrams=[];const ids=new Set();
for(const lesson of Object.values(LESSONS)){
 assert.equal(lesson.steps.length,3);assert.equal(GUIDES[lesson.type].watch.length,3);assert.equal(GUIDES[lesson.type].terms.length,3);
 const svg=diagram(lesson.type);diagrams.push(svg);
 for(const [,id]of svg.matchAll(/id="([^"]+)"/g)){assert.ok(!ids.has(id));ids.add(id);}
 for(const [,id]of svg.matchAll(/url\(#([^)]+)\)/g))assert.ok(ids.has(id));
}
// Check causal movement independently of rendering: inhale flattens the dome, exhale restores it.
function dome(type,chapter,progress){let d;const mock={querySelector:s=>s==='svg.school-diagram'?{dataset:{type}}:s==='.diaphragm-line'?{setAttribute:(k,v)=>d=v}:null,querySelectorAll:()=>[]};animateDiagram(mock,0,chapter,progress);return d;}
assert.equal(dome('diaphragm',1,1),'M145 319Q280 311 415 319');assert.equal(dome('diaphragm',2,1),'M145 319Q280 251 415 319');assert.equal(dome('lungs',0,1),dome('lungs',1,.5));
assert.ok(!diagram('diaphragm').includes('Alveolus'));
await fs.writeFile('/tmp/corpus-diagrams.json',JSON.stringify(diagrams));
console.log('PASS: nine model geometries and referenced assets; native heart animation/reset; ten lessons and guides; unique diagram markers; breathing motion.');
