# CORPUS — Interactive Human Anatomy Atlas

An interactive 3D human anatomy explorer built with **Three.js**. Load and inspect real GLTF anatomical models — skeleton, heart, lungs, diaphragm, digestive system, circulatory system, and musculature — directly in the browser, with narrated overviews, quizzes, and full exam-style assessment.

**Live demo:** _add your GitHub Pages link here after deploying_

---

## Features

### Core
- **10 interactive 3D organ/system models** (GLTF/GLB) with orbit, pan, and zoom controls
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
- [Three.js](https://threejs.org/) r128 (GLTFLoader + DRACOLoader) via CDN
- Web Speech API for narration
- `localStorage` for progress and quiz history persistence
- Pure CSS (custom properties / design tokens), Google Fonts (Bricolage Grotesque, Plus Jakarta Sans, Space Mono)

---

## Project Structure

```
HumanAnatomy/
├── index.html          # entire app (markup, styles, and logic)
├── models/              # GLTF/GLB models + textures for each system
│   ├── human_skeleton/
│   ├── human_heart_3d_model/
│   ├── realistic_human_lungs/
│   ├── human_diaphragm/
│   ├── digestive_system/
│   ├── angiology/
│   ├── ecorche_-_anatomy_study/
│   ├── liver/            # added — CC BY-SA, derived from BodyParts3D
│   ├── kidneys/           # added — CC BY-SA, derived from BodyParts3D
│   └── eyeball/           # added — CC BY-SA, derived from BodyParts3D
└── README.md
```

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

## Credits

3D models sourced from Sketchfab (see each model's `license.txt` for attribution).

## License

Educational project. Third-party 3D assets remain under their original licenses (see `models/*/license.txt`).
