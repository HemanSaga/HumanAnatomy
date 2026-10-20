# CORPUS — Interactive Human Anatomy Atlas

An interactive 3D human anatomy explorer built with **Three.js**. Load and inspect real GLTF anatomical models — skeleton, heart, lungs, diaphragm, digestive system, circulatory system, and musculature — directly in the browser, with narrated overviews, quizzes, and full exam-style assessment.

**Live demo:** [Open CORPUS](https://hemansaga.github.io/HumanAnatomy/)

---

## Living Atlas upgrade

- A responsive paper-and-forest interface with a dedicated dark 3D stage.
- **Watch it work** starts a narrated, captioned walkthrough beside the selected model. The heart uses its source skeletal animation, lungs expand/recoil, and diaphragm descends/rises. The other systems include animated working diagrams beside their anatomy; circulation uses a labeled 3D schematic fallback.
- **Video lessons** contains ten short browser-rendered explainers, each with three chapters and Milo, an animated character guide. Includes play/pause, restart, chapter selection, timeline seeking, playback speed, mute, voice selection, fullscreen, and transcripts.
- High-school lesson references are linked within each lesson. The diagrams and model deformations are simplified educational illustrations, not clinical simulations.
- Narration uses device speech synthesis and begins only after a playback action. Available voices and audio quality vary by browser/OS. Captions continue when voice playback is unavailable. These are interactive animated lessons, not downloadable or prerecorded video files.
- Reduced-motion preferences suppress lesson animation; keyboard users can access organ cards, model hotspots, chapters, and player controls. Space toggles playback in the lesson view when focus is not on another control.
- Model switching ignores stale loads and disposes replaced geometry, materials, and textures.

The existing static-server and GitHub Pages workflow still applies; include the new `assets/` directory when deploying. Three.js and GLTFLoader are bundled locally; web fonts and some device voices may require internet.

## High-school presentation update

- Larger stage-by-stage diagrams, sentence captions, vocabulary, focus prompts, and understanding checks for ten lessons.
- Pause-after-chapter mode for classroom discussion, voice preview and saved voice choice. Narration is still device speech synthesis, not a studio recording.
- Model fitting preserves imported transforms. Neutral lighting and material adjustments improve inspection; the original texture assets are retained.
- Run `node scripts/verify.mjs` for geometry, source-asset, native-animation and lesson checks. This does not test GPU rendering or spoken output.
- See [DELIVERY.md](DELIVERY.md) for the launch and presentation checklist.

## Features

### Core
- **10 interactive 3D organ/system views** (nine GLTF models plus the circulation schematic) with orbit, pan, and zoom controls
- **Wireframe view** and **explode view** for structural inspection
- Per-organ **overview, key stats, functions, and "did you know" facts**
- **Audio narration** for every system via the Web Speech API
- Per-organ **quiz** with instant feedback

### Advanced (added on top of the original build)
- 🔍 **Search & filter** — find any organ instantly by name or system, with quick-filter chips
- ✅ **Progress tracking** — visited systems are remembered (localStorage) and shown as a live progress bar in the header
- ◐ **Cross-section / X-Ray mode** — a real-time clipping-plane slider (X/Y/Z axis) that slices through any model to reveal internal structure, powered by Three.js `localClippingEnabled`
- 🏷️ **Numbered part labels** — clickable hotspots on each model that surface a short description of that anatomical structure
- ➜ **Blood / air flow animation** — animated directional arrows on the heart and lungs showing circulation and respiration pathways
- ✋ **Pan mode + two-finger touch panning** — dedicated toolbar toggle (or Shift+drag) to move the camera up/down/left/right, in addition to orbit rotation
- 🎓 **Master Quiz mode** — a full exam pulling randomized questions from every system, with:
  - Score history saved locally across sessions
  - A printable **certificate of completion** (generated as a browser print/PDF) for scores of 70% and above

---

## Tech Stack

- Vanilla JavaScript (ES modules) — no build step required
- [Three.js](https://threejs.org/) r128 with GLTFLoader, bundled in `assets/vendor/` under its MIT license
- Web Speech API for narration
- `localStorage` for progress and quiz history persistence
- Pure CSS (custom properties / design tokens), Google Fonts (Bricolage Grotesque, Plus Jakarta Sans, Space Mono)

---

## Project Structure

```
HumanAnatomy/
├── index.html          # atlas, 3D viewer, organ data, quizzes
├── assets/
│   ├── experience.css   # responsive explorer and lesson studio design
│   ├── experience.js    # model demonstrations, player, narration state
│   ├── lessons.js       # ten scripts and learning references
│   ├── circulation.js  # original circulation schematic fallback
│   └── diagrams.js      # animated diagrams and Milo character
├── models/              # GLTF/GLB models + textures for each system
│   ├── human_skeleton/
│   ├── human_heart_3d_model/
│   ├── realistic_human_lungs/
│   ├── human_diaphragm/
│   ├── digestive_system/
│   ├── angiology/
│   ├── ecorche_-_anatomy_study/
│   ├── human_liver_and_gallbladder/
│   ├── human_kidney/
│   └── muscles_of_the_orbit_eye/
└── README.md
```

## Known source-asset limitation

`models/angiology/scene.bin` is absent from the original repository. The circulatory entry uses an original, animated two-circuit schematic from `assets/circulation.js`, visibly labeled in the viewer. It is not the detailed Angiology mesh. To restore that mesh, obtain its missing binary under its original license, place it beside `scene.gltf`, and remove `schematic: true` from the circulatory entry in `index.html`.

## Credits

The original 3D models are sourced from Sketchfab under the licenses in their model folders (including CC-BY-4.0 and CC-BY-SA-4.0) — full attribution is included in each model's own `license.txt`. Notably:

- **Human liver and gallbladder** by [ElliotSS](https://sketchfab.com/ElliotSS)
- **Human Kidney** by [neshallads](https://sketchfab.com/neshallads)
- **Muscles of the Orbit (Eye)** by [thunderpig](https://sketchfab.com/thunderpig)

## Running Locally

No build tools needed — it's a static site. Because it loads 3D model files via `fetch`, it must be served over HTTP (not opened as a `file://` path):

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use any static server (VS Code Live Server, `npx serve`, etc).

## Deployment (GitHub Pages)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then **Save**.
5. Your site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

## License

Educational project. Third-party 3D assets remain under their original licenses (see `models/*/license.txt`).
