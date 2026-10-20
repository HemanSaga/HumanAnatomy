// High-school biology: explicit mechanisms, vocabulary and common misconceptions.
const heartSource = ['NHLBI · How the heart works', 'https://www.nhlbi.nih.gov/health/heart/blood-flow'];
const lungSource = ['NHLBI · How the lungs work', 'https://www.nhlbi.nih.gov/health/lungs'];
const digestionSource = ['NIDDK · Your digestive system', 'https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works'];
export const LESSONS = {
  human_heart_3d_model: { type:'heart', title:'A heartbeat explained', subtitle:'Two pumps. One extraordinary rhythm.', color:'#ef8f91', metric:'A continuous cycle', steps:[
    ['Fill', 'Follow one route through the heart. Oxygen-poor blood returns from the body through the venae cavae. It enters the right atrium, then passes through the tricuspid valve into the right ventricle. Valves open and close as pressure changes.'],
    ['To the lungs', 'The right ventricle contracts and sends blood through the pulmonary artery to the lungs. In lung capillaries, blood loses carbon dioxide and gains oxygen. It returns through the pulmonary veins to the left atrium. Blue is only a diagram convention: blood is always red.'],
    ['To the body', 'Blood passes through the mitral valve into the left ventricle. Its thick muscular wall contracts, pushing blood through the aortic valve and into the aorta. Oxygen reaches body tissues. Both sides normally pump together; we separate the route into stages to explain it.']
  ], source:heartSource },
  realistic_human_lungs: { type:'lungs', title:'Take a breath with me', subtitle:'The tiny exchange behind every breath.', color:'#93caca', metric:'Inhale → exchange → exhale', steps:[
    ['Inhale', 'Watch the diaphragm flatten and move down. Together with the rib muscles, it increases the volume of the chest. Pressure inside the lungs falls below atmospheric pressure. Air flows into both lungs through the trachea and branching airways.'],
    ['Exchange', 'Now zoom into an alveolus, a tiny air sac. Oxygen diffuses across its thin wall into the blood. Carbon dioxide diffuses in the opposite direction. Each gas moves down its own partial-pressure gradient. Breathing moves air; diffusion exchanges gases.'],
    ['Exhale', 'During quiet exhalation, the diaphragm relaxes and rises. The lungs recoil, reducing their volume and increasing pressure. Air flows out through the same airways in both lungs. Exhaled air still contains oxygen; it simply contains more carbon dioxide than inhaled air.']
  ], source:lungSource },
  human_diaphragm: { type:'diaphragm', title:'The muscle behind a breath', subtitle:'A small movement with a big purpose.', color:'#b7afd8', metric:'Contract → descend → relax', steps:[
    ['At rest', 'The diaphragm is a dome-shaped muscle below the lungs. It separates the chest cavity from the abdominal cavity. At the end of a relaxed breath out, its dome sits higher. It changes chest volume; it does not directly pump oxygen into blood.'],
    ['Contract', 'The diaphragm contracts, flattens and moves downward. Chest volume increases. Pressure inside the lungs drops below the air pressure outside, so air enters. Notice the order: muscle contraction, volume increase, pressure decrease, then airflow.'],
    ['Relax', 'The diaphragm relaxes and returns toward its domed shape. Elastic recoil of the lungs helps drive a quiet breath out. Forced exhalation, such as blowing out candles, also recruits other muscles. The diagram exaggerates movement so its direction is easy to see.']
  ], source:lungSource },
  digestive_system: { type:'digestion', title:'Follow a bite of food', subtitle:'From the first bite to usable nutrients.', color:'#e6b78a', metric:'Move → digest → absorb', steps:[
    ['Move', 'Digestion starts in the mouth: chewing breaks food apart and saliva begins starch digestion. After swallowing, waves of muscular contraction called peristalsis move the food through the oesophagus. The moving dot represents food, not blood.'],
    ['Digest', 'In the stomach, muscles mix food with acid and enzymes. The mixture moves into the small intestine. Pancreatic enzymes help digest nutrients, while bile breaks large fat droplets into smaller ones. Bile is not an enzyme.'],
    ['Absorb', 'Villi increase the surface area of the small intestine, where most nutrients are absorbed into blood or lymph. The large intestine absorbs more water. Undigested material becomes faeces. Digestion breaks food down; absorption moves nutrients into the body.']
  ], source:digestionSource },
  angiology: { type:'circulation', title:'Your body’s delivery network', subtitle:'A round trip that never takes a break.', color:'#ef8f91', metric:'Arteries → capillaries → veins', steps:[
    ['Deliver', 'Think of circulation as a delivery network. The heart sends blood through arteries, which carry it away from the heart toward organs and tissues.'],
    ['Exchange', 'Tiny vessels called capillaries allow oxygen and nutrients to move to tissues. Carbon dioxide and other waste products move into the blood.'],
    ['Return', 'Veins carry blood back toward the heart. Blood then travels through the lung circuit to exchange gases before it is sent around the body again.']
  ], source:heartSource },
  liver: { type:'liver', title:'Your quiet multitasker', subtitle:'Processing nutrients. Making bile.', color:'#d2ad83', metric:'Receive → process → support digestion', steps:[
    ['Receive', 'Your liver receives blood from the digestive tract through the portal vein, and oxygen-rich blood through the hepatic artery. It is a busy processing center.'],
    ['Process', 'Liver cells process nutrients and help maintain the body’s chemical balance. The liver also makes important proteins and helps break down many substances.'],
    ['Make bile', 'The liver makes bile. The gallbladder stores and concentrates it, then releases it into the small intestine to help digest fats. The branches here show these different routes.']
  ], source:digestionSource },
  kidneys: { type:'kidney', title:'Small filters, essential work', subtitle:'Keeping the right things in balance.', color:'#d8a6bc', metric:'Filter → reclaim → excrete', steps:[
    ['Filter', 'A nephron is a microscopic kidney unit. Blood pressure drives water and small dissolved substances from a capillary knot, the glomerulus, into Bowman’s capsule. Blood cells and most proteins remain in the bloodstream. The new fluid is called filtrate, not yet urine.'],
    ['Reclaim', 'Filtrate flows along the tubule. Useful substances, including glucose, and most water are reabsorbed into the blood. Other substances can be secreted from blood into the tubule. Follow the arrows: reabsorption returns substances to blood, not to the bladder.'],
    ['Excrete', 'The remaining fluid becomes urine. It passes into collecting ducts, then toward the renal pelvis and ureter. The bladder stores urine. By adjusting water and salt loss, kidneys help maintain homeostasis: stable conditions inside the body.']
  ], source:['NIDDK · Your kidneys and how they work','https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work'] },
  human_skeleton: { type:'joint', title:'Built to support. Made to move.', subtitle:'Bones and joints working together.', color:'#d6c9a1', metric:'Support → pivot → protect', steps:[
    ['Support', 'Your skeleton gives your body a framework. Bones support your weight and provide attachment points for muscles. Some also protect delicate organs.'],
    ['Move', 'Where bones meet, joints allow different kinds of movement. In this simplified elbow, the forearm pivots around a hinge-like joint as muscles pull on bones.'],
    ['Protect', 'Cartilage covers the ends of bones in many joints, helping them move smoothly. Ligaments help connect bone to bone and stabilize the joint.']
  ], source:['OpenStax · Synovial joints','https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints'] },
  'ecorche_-_anatomy_study': { type:'muscle', title:'How a muscle makes a move', subtitle:'A pull, a partner, and a moving joint.', color:'#de9b94', metric:'Signal → contract → release', steps:[
    ['Signal', 'Movement starts with a signal from the nervous system. Inside a muscle, tiny protein filaments slide past each other to produce force.'],
    ['Contract', 'As the biceps contracts, it pulls through a tendon on the forearm. The elbow bends. The changing band in this diagram represents the muscle shortening.'],
    ['Release', 'Muscles pull; they cannot actively push bones away. Opposing muscle groups coordinate movement. The triceps helps straighten the elbow as the biceps relaxes.']
  ], source:['OpenStax · Muscle contraction','https://openstax.org/books/anatomy-and-physiology-2e/pages/10-3-muscle-fiber-contraction-and-relaxation'] },
  eyeball: { type:'eye', title:'From light to sight', subtitle:'An image becomes a signal.', color:'#98c2df', metric:'Focus → detect → signal', steps:[
    ['Focus', 'Follow both light rays in the same direction, into the eye. The cornea provides much of the bending, while the lens adjusts focus. Light passes through the pupil and is focused onto the retina at the back of the eye.'],
    ['Detect', 'The retina contains photoreceptors. Rods are especially useful in dim light; cones support colour vision and fine detail. These cells begin converting light into signals. The retina detects light; it does not send light to the brain.'],
    ['Signal', 'Retinal circuits process the information. The optic nerve carries electrical signals to the brain, which interprets them as vision. The six external eye muscles change where you look. They do not focus the lens: that involves the ciliary muscle inside the eye.']
  ], source:['NEI · How the eyes work','https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work'] }
};
