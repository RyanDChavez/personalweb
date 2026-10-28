# personalweb
personal website/ landing page. Also big oppo to learn html yeet.

ryandchavez.com is "The Living Room": a pixel-art midcentury living room played like an old point-and-click adventure game.

- `index.html`: page shell, the room's markup (panels, HUD) and a plain-text version for crawlers and no-JS visitors
- `room.js`: draws the 320×180 scene, lighting, rug and camera, and runs the interactions
- `room.css`: layout and styling; colors come from `TOKENS` in `room.js`
- `og.png`: social preview (a screenshot of the room)

The lamp switches afternoon ↔ evening; the choice is remembered, and first-time visitors with a dark system theme start in the evening.
