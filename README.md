# personalweb
personal website/ landing page. Also big oppo to learn html yeet.

ryandchavez.com is Ryan's apartment in pixel art, played like an old point-and-click adventure game: a living room, a bedroom and a kitchen, with a floor plan in the menu for getting around.

Visits start in the hallway at the front door (navy, brass peephole, RDC doorbell). Open it and the camera walks through the doorway into the living room; the bell just rings. The door shows once per browser tab session.

- `index.html`: page shell, the rooms' close-up panels, the menu, and a plain-text version for crawlers and no-JS visitors
- `room.js`: draws the 320×180 scenes, lighting and camera, and runs the interactions; the bookshelf catalog, places and map data live here too
- `room.css`: layout and styling; colors come from `TOKENS` in `room.js`
- `fonts/`: Pixelify Sans, Silkscreen and Atkinson Hyperlegible, served from the site (SIL Open Font License, see `fonts/OFL.txt`)
- `404.html`: the wrong door, for links that go nowhere
- `og-door.png`: social preview (a screenshot of the front door)

Browsers in dark mode get the evening; otherwise afternoon or evening follows the visitor's local time (evening from 6pm to 6am, with a golden hour late in the afternoon). The lamps, the string lights, the switch in the menu and a nap in the bed all flip between day and night for the rest of the visit (browser tab session). A few things remember a visitor across visits in their browser: the snake plant, the apples, the ripening bananas and the herbs.
