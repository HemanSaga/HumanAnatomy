import * as THREE from './vendor/three.module.js';

// Preserve imported node transforms. Previous code replaced root scale during fitting.
export function normalizeModel(root, extent=3) {
  root.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(root);
  const size=bounds.getSize(new THREE.Vector3());
  const factor=extent/Math.max(size.x,size.y,size.z);
  if(!Number.isFinite(factor)||factor<=0)throw new Error('Model has no usable geometry');
  root.scale.multiplyScalar(factor);
  root.position.multiplyScalar(factor).sub(bounds.getCenter(new THREE.Vector3()).multiplyScalar(factor));
  root.updateMatrixWorld(true);
  return root;
}
export function improveMaterials(root, anisotropy=4) {
  root.traverse(object=>{
    if(!object.isMesh)return;
    if(!object.geometry.attributes.normal)object.geometry.computeVertexNormals();
    object.frustumCulled=!object.isSkinnedMesh;
    for(const material of [].concat(object.material)){
      // Keep the artist's colours/textures, but remove exaggerated plastic reflections.
      if('metalness' in material)material.metalness=Math.min(material.metalness,.15);
      if('roughness' in material)material.roughness=Math.max(material.roughness,.52);
      for(const value of Object.values(material))if(value?.isTexture)value.anisotropy=anisotropy;
      material.needsUpdate=true;
    }
  });
}
export function attachNativeAnimation(root, clips) {
  if(!clips?.length)return false;
  const mixer=new THREE.AnimationMixer(root);
  const clip=clips[0];
  const action=mixer.clipAction(clip);action.play();mixer.setTime(0);
  root.userData.animationInfo={name:clip.name,duration:clip.duration,tracks:clip.tracks.length};
  root.userData.animateNative=time=>mixer.setTime(time);
  root.userData.resetNative=()=>mixer.setTime(0);
  root.userData.disposeAnimation=()=>{mixer.stopAllAction();mixer.uncacheRoot(root);};
  return true;
}
