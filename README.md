# personalweb
personal website/ landing page. Also big oppo to learn html yeet.

ryandchavez.com is "The Living Room": a pixel-art midcentury living room played like an old point-and-click adventure game.

Visits start in the hallway at the front door (navy, brass peephole, RDC doorbell). Ring or open it and the camera walks through the doorway into the room. The door shows once per browser tab session.

- `index.html`: page shell, the room's markup (panels, HUD) and a plain-text version for crawlers and no-JS visitors
- `room.js`: draws the 320×180 scene, lighting, rug and camera, and runs the interactions
- `room.css`: layout and styling; colors come from `TOKENS` in `room.js`
- `og-door.png`: social preview (a screenshot of the front door)

Afternoon or evening follows the visitor's local time (evening from 6pm to 6am). The lamp switches between them; that choice holds for the rest of the visit (browser tab session).
