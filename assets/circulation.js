// Original schematic fallback: the repository's Angiology GLTF lacks scene.bin.
// This illustrates two connected circuits, not anatomically positioned vessels.
export function createCirculationModel(THREE) {
  const group = new THREE.Group();
  const particles = [];
  const routes = [
    { color:0xe5898c, points:[[0,0,0],[-.5,-.3,0],[-.8,-1,0],[-.65,-1.8,0],[0,-2.1,0]] },
    { color:0x74abd6, points:[[0,-2.1,0],[.65,-1.8,0],[.8,-1,0],[.5,-.3,0],[0,0,0]] },
    { color:0x74abd6, points:[[0,0,0],[-.5,.4,0],[-.6,1,0],[0,1.4,0]] },
    { color:0xe5898c, points:[[0,1.4,0],[.6,1,0],[.5,.4,0],[0,0,0]] }
  ];
  for(const route of routes) {
    const curve = new THREE.CatmullRomCurve3(route.points.map(p=>new THREE.Vector3(...p)));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve,64,.045,8,false),new THREE.MeshBasicMaterial({color:route.color}));
    group.add(tube);
    for(let i=0;i<5;i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(.07,10,10),new THREE.MeshStandardMaterial({color:0xffedc0,emissive:route.color,emissiveIntensity:.5}));
      group.add(dot);particles.push({dot,curve,offset:i/5});
    }
  }
  const heart = new THREE.Mesh(new THREE.SphereGeometry(.23,24,20),new THREE.MeshStandardMaterial({color:0xc76a7d,roughness:.5}));
  heart.scale.set(1,.95,.65);group.add(heart);
  group.userData.updateFlow = time => {
    for(const p of particles)p.dot.position.copy(p.curve.getPointAt((time/5+p.offset)%1));
  };
  group.userData.updateFlow(0);
  return group;
}
