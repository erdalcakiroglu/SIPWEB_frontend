# Use Case screenshots

Drop screenshots for each case study in a folder named after its `slug`:

```
public/use-cases/<slug>/<name>.png
```

Then register them in `app/use-cases/data.ts`.

## Two places you can show an image

1. **Inline with an analysis step** — add an `image` to an `AnalysisStep`:

   ```ts
   {
     module: 'Blocking Analysis',
     action: 'Captured a live snapshot during a stall and expanded the blocking chain.',
     signal: 'A single head blocker holding key locks while 40+ sessions queued behind it.',
     image: {
       src: '/use-cases/blocking-storm-head-blocker/blocking-chain.png',
       alt: 'Blocking Analysis showing one head blocker and dependent sessions',
       width: 1280,
       height: 760,
       caption: 'The blocking chain expanded from SPID 73.',
     },
   }
   ```

2. **Evidence gallery** — add a `screenshots` array to the case study (renders as a 2-column gallery under the Evidence callouts).

## Notes

- `width` / `height` are the image's real pixel dimensions; they keep layout stable and feed `next/image`.
- `alt` is required — it is used for accessibility and SEO.
- Images open in a click-to-enlarge lightbox automatically (same component as `/docs`).
- Prefer PNG for UI screenshots; keep them readable but reasonably sized.
