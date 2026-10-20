# Classroom handover

## Launch

From this project folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ and refresh an already-open tab to load the changes. Keep the server running. The hosted site is https://hemansaga.github.io/HumanAnatomy/. Deploy the complete `assets/` and `models/` directories alongside `index.html` when hosting.

## Suggested demonstration

1. In **Explore**, select **Heart**, then **Watch it work**. The model uses its supplied skeletal animation. The highlighted diagram routes are teaching stages; both sides normally pump together.
2. Use **Front**, **Side** and **Back** to inspect the model. Labels, X-ray, wireframe and explode controls support discussion of its structure.
3. Open **Video lessons** and choose **Lungs**. Use **Preview voice** and select a voice suited to the presentation computer. Enable **Pause after each chapter** for discussion.
4. Walk through the focus prompt and vocabulary, then open **Check your understanding**. Use the diaphragm lesson to connect muscle contraction, volume, pressure and airflow.
5. Return to the explorer for organ details and quizzes.

## Check on the presentation computer

- Confirm the organ models render, labels are legible, and view controls work.
- Listen to the selected voice through the actual speakers. Check play, pause, seeking, mute and switching lessons. Captions and transcripts remain available without speech.
- Check lessons at the intended projector/window size. On small screens, swipe the diagram horizontally to read the full layout.
- Let model textures finish loading before presenting. Keep a reliable connection if using online voices; core Three.js code and models are local.

## What is implemented, and what is approximate

The heart uses its supplied skeletal animation. Breathing deformation and working diagrams illustrate mechanisms; they are not physiological simulations.

The missing original circulation binary is replaced by a clearly labeled schematic. Lessons are interactive browser animations with a character and speech synthesis, not exported video files. Voice selection and pacing are improved, but no professionally recorded narration was added.

## Verification

Run `node scripts/verify.mjs` for nine model geometries and referenced assets, preserved model proportions/centering, heart animation and reset, ten lessons with guides, unique SVG marker IDs, and breathing movement direction. Syntax and SVG parsing checks complement these checks.

These checks do not establish GPU rendering, playback interaction or audible output. Verify those on the presentation computer before presenting.
