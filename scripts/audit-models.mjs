// Inspect local GLTF geometry without a browser or GPU. Texture decoding is not required.
import fs from 'node:fs/promises';
import path from 'node:path';
import { GLTFLoader } from '../assets/vendor/GLTFLoader.js';
import { Box3,Vector3 } from '../assets/vendor/three.module.js';
export async function loadGeometry(file) {
  const data=JSON.parse(await fs.readFile(file,'utf8'));
  for(const buffer of data.buffers||[]) {
    if(!buffer.uri.startsWith('data:')) buffer.uri='data:application/octet-stream;base64,'+(await fs.readFile(path.join(path.dirname(file),buffer.uri))).toString('base64');
  }
  data.images=[];data.textures=[];
  for(const m of data.materials||[]) {
    for(const key of Object.keys(m))if(/texture/i.test(key))delete m[key];
    if(m.pbrMetallicRoughness)for(const key of Object.keys(m.pbrMetallicRoughness))if(/texture/i.test(key))delete m.pbrMetallicRoughness[key];
    for(const ext of Object.values(m.extensions||{}))for(const key of Object.keys(ext))if(/texture/i.test(key))delete ext[key];
  }
  return new Promise((resolve,reject)=>new GLTFLoader().parse(JSON.stringify(data),'',resolve,reject));
}
if(process.argv[1]?.endsWith('audit-models.mjs')) {
  for(const folder of await fs.readdir('models')) {
    try {
      const gltf=await loadGeometry(`models/${folder}/scene.gltf`);
      const size=new Box3().setFromObject(gltf.scene).getSize(new Vector3());
      const meshes=[];
      gltf.scene.traverse(o=>{if(o.isMesh){const b=new Box3().setFromObject(o);meshes.push({name:o.name,triangles:(o.geometry.index?.count||o.geometry.attributes.position.count)/3,size:b.getSize(new Vector3()).toArray().map(x=>+x.toFixed(2))});}});
      console.log(JSON.stringify({folder,size:size.toArray().map(x=>+x.toFixed(2)),animations:gltf.animations.map(a=>({name:a.name,duration:a.duration,tracks:a.tracks.length})),meshes}));
    }catch(e){console.log(JSON.stringify({folder,error:e.message}));}
  }
}
