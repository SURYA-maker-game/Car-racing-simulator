# CAR RACING SIMULATOR

A browser-based arcade racing game with a car garage, checkpoints, drifting, nitro, mini-map, achievements, and online room-based multiplayer.

## Run locally
1. Install Node.js.
2. Run `npm install`.
3. Run `npm start`.
4. Open http://localhost:3000

## Deploy
Push the project files to GitHub, then in Render choose **New + → Blueprint** and select this repository. Render reads `render.yaml`.

Multiplayer uses Socket.IO room membership and live player position updates. This is a casual prototype, not a competitive server-authoritative racing system.
