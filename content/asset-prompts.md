# Image prompts for the explainer page

Generate each image in ChatGPT or Codex, save it as a PNG with the file name shown, and put it in `assets/raw/`.
Then run `npm run assets`. The script removes the white and magenta backgrounds, splits the tape, and writes `public/vox/*.webp`.

Every prompt can start with this style line:
> Style context: an asset for a Vox-style explainer page (paper collage, halftone print, highlighter, marker). Create exactly one image.

---

### 1. `paper.png` (square)
A seamless, tileable, square scan of plain uncoated off-white paper, very light warm grey, with subtle fibres and fine grain. No folds, stains, text, shadows or vignette. Flat, even lighting.

### 2. `highlighter.png` (wide, 3:1)
A single straight horizontal stroke of a broad chisel-tip highlighter, solid black ink on pure white, swiped once from left to right. Flat edges, faint streaks along the stroke, a slightly darker blob where it starts, and an angled chisel end. Nothing else in the image.

### 3. `circle.png` (wide, 2:1)
A single loose ellipse drawn with a thick black felt-tip marker on pure white, in one quick motion, with the ends overlapping and overshooting, like circling a word in a newspaper. Nothing else in the image.

### 4. `arrow.png` (wide, 2:1)
A single hand-drawn arrow in thick black felt-tip marker on pure white: one quick, slightly curved stroke from left to right with a simple open arrowhead on the right end. Nothing else in the image.

### 5. `torn.png` (very wide, about 8:1)
A long horizontal strip of paper with both long edges torn by hand, fibrous and jagged. The strip is solid black on pure white. No shadow, nothing else.

### 6. `tape.png`
Three separate pieces of beige, semi-translucent masking tape, each torn at both ends and slightly wrinkled, laid side by side with clear gaps between them, photographed flat from above on a perfectly flat solid magenta (#FF00FF) background. No shadows.

### 7. `pin.png` (square)
A single red plastic push-pin seen from a slight top-down angle, with a glossy round head and a short silver needle, on a perfectly flat solid magenta (#FF00FF) background. No shadow.

### 8. `cutout.png` (portrait, 4:5). Attach your blue-background photo.
Turn the attached portrait into a collage cut-out for a Vox-style explainer. Make it a black-and-white newspaper halftone print with coarse, clearly visible dots. Keep the same face, the same slight head tilt and gaze, the tousled wavy hair falling over the forehead, the small stud earring and the crew-neck t-shirt, cropped at the chest. Surround the figure with a thick, slightly irregular hand-cut white paper border that follows the silhouette. Put it on a perfectly flat solid magenta (#FF00FF) background. No shadow, no text.

Use the blue-background photo, not the Van Gogh one: a clean photo gives much better halftone dots.

### 9. `map.png` (wide, 16:9)
A vintage printed world map in Vox explainer style, centred so that India sits slightly right of the middle. India in a muted warm grey, a little darker than the other countries, the other land masses lighter, thin dark country borders, and fine halftone dots across the oceans. Flat, no labels, no text, no compass, no frame.

After the map arrives, India's position may need a small adjustment in `src/content.js` (`world.india`). I'll do that.

---

## Optional: logos and screenshots
If you have them, also put these in `assets/raw/`: logos or screenshots for Masai School, Eventory, Newral, Synappses, Competishun, AssumeChat, Fizz Social and PetTrace. If you don't have them, the clippings stay text-only.
