# Phase 1 — Frontend Review Notes

## What I did
Reconstructed the Next.js App Router project from the source you provided and fixed
the following issues. The UI/UX itself was **not changed** — only bugs and corrupted
text were fixed.

## Issues found & fixed

1. **Corrupted ligatures (from PDF text-extraction), affecting many files**
   - `ﬂex` → `flex`, `ﬁxed` → `fixed`, `auto-ﬁt` → `auto-fit`, `Conﬂicts` → `Conflicts`,
     `di erent` → `different`, etc. These were CSS property values and JSX text that
     would have rendered as garbled/broken layout (e.g. `display: ﬂex` is not valid CSS).

2. **Broken hex colors**
   - `--card: #      ;` → `--card: #ffffff;` (the `ff` characters were dropped by the
     extractor — this variable would have been invalid CSS otherwise)
   - `.badge-orange { background: # edd5; }` → `#ffedd5`
   - Dashboard "Students" stat `bg: "#f3e8 "` → `"#f3e8ff"`
   - Dashboard "Departments" stat `bg: "# edd5"` → `"#ffedd5"`

3. **Unused import** in `conflicts/page.tsx` — `AlertTriangle` was imported but never
   rendered anywhere in that file. Removed it (no visual change, just avoids an
   ESLint/`no-unused-vars` warning).

4. **Missing `src/app/settings/page.tsx`** — the source document you gave me ends
   right after the Conflicts page; the Settings page content wasn't included at all.
   I built one from scratch, matching the existing design system exactly
   (`.card`, `.label`, `.input`, `.select`, `.btn`, `.row` classes, same spacing/typography).
   **Please review this page specifically** — it's the one page I had to invent rather
   than reconstruct, so treat its exact fields as a starting draft, not gospel.

5. Added the standard supporting project files that weren't in your export but are
   required for the project to run: `package.json`, `tsconfig.json`, `next.config.mjs`,
   `next-env.d.ts`, `.eslintrc.json`.

## A limitation I want to flag

This sandbox doesn't have internet access, so I could not run `npm install` or
`next build` to fully compile-check the project. What I *did* do instead:
- Ran every `.ts`/`.tsx` file through the TypeScript parser directly (syntax-level
  check) — all 13 files parse cleanly with no syntax errors.
- Manually traced every import, every `href`, and every component prop against how
  it's used.

I'm confident in the fixes above, but I'd recommend you run `npm install && npm run dev`
locally as a first step once you have this — if anything doesn't compile, send me the
error and I'll fix it immediately before we move to Phase 2.

## Not yet done (waiting for your go-ahead)
- Database schema design (Phase 2)
- Spring Boot backend (Phase 3)
- Wiring the frontend up to real API calls (currently all pages use static dummy data,
  as in your original)
