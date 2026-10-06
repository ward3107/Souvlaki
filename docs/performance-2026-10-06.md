# VASIA signature and adaptive rendering audit — 6 October 2026

## Result

Replaced the wwwebsie/waseemp.vercel.app credit with the existing VASIA V mark,
vasia.dev and eight verified contact/social destinations. Kept the restaurant's
own social links separate. Signature icons use 44px targets, keyboard focus
styles and a balanced two-row layout on narrow screens.

The homepage now adapts rendering costs to device capability. Its text, dishes,
story, contact information and ordering flows remain available in both modes.

## Rendering policy

`src/renderingPolicy.ts` enables lite effects for coarse pointers, reduced
motion, data saver, 1–4 CPU cores, 1–4 GB reported memory, or slow-2g/2g/3g
connections. Unknown hardware hints alone do not imply a weak device. Media and
connection changes update a shared store; legacy MediaQueryList listeners are
supported. These are conservative heuristics, not hardware benchmarks.

Lite mode uses static photographs, a four-panel fire-to-plate story, immediate
content reveals, native scrolling, and simple surfaces without backdrop blur or
continuous ambient animations. Capable desktops retain the cinematic story.

Decorative videos have no source before entering the viewport, pause offscreen
and when the document is hidden, and release the source on unmount. The hero
scrolls out of view instead of remaining pinned behind later content. The grill
video is removed when its story beat is covered by the next beat. Autoplay
failure retains the poster. Lite mode never mounts decorative video elements.

The hero poster drops from 288 KB to the existing 68 KB WebP. Its preload matches
the rendered source. The map iframe loads lazily. Normal-flow lower sections
use content-visibility; sticky story sections are explicitly excluded. Browsers
without content-visibility retain normal rendering.

Lenis loads only for capable desktops, pauses its frame loop in background tabs,
and is destroyed when the policy becomes lite. Lightbox code loads only when
opened. React vendor chunk matching uses exact package boundaries, so
react-markdown and its parser dependencies remain with the legal-document
chunk. Owner tools, Supabase's chunk, the lightbox, legal viewer and Lenis are
excluded from first-install precaching and cached on demand. Menu and public
shell assets remain precached. Optional tools require a prior online visit for
offline availability. Build syntax targets ES2018, Chrome 80, Firefox 78 and
Safari 14; this is syntax transformation, not universal API/browser support.

## Controlled comparison

Baseline: production branch commit `d0779388fb88a09f579c3f89bb593ac98b346709`.
Three cold-cache runs per version, Chromium 153, 390×844 touch viewport, reported
2 cores/2 GB, 6× CPU slowdown, 150 ms network latency, 200,000 bytes/s down and
100,000 bytes/s up. Both builds were served by the same Python static HTTP
server without compression. External origins and service workers were blocked
to isolate application costs. Measurements were collected at initial network
idle, before scrolling. The older-device condition is emulation, not a physical
phone.

| Median metric                               |       Before |      After |                  Change |
| ------------------------------------------- | -----------: | ---------: | ----------------------: |
| Largest Contentful Paint                    |     6,688 ms |   4,576 ms |             31.6% lower |
| Sum of long-task time above 50 ms           |       666 ms |     399 ms |             40.1% lower |
| Same-origin resource body bytes             |    2,205,087 |  1,031,424 |             53.2% lower |
| Decorative video requests                   |            3 |          0 | Eliminated in lite mode |
| Service-worker precache size (build output) | 1,158.72 KiB | 696.48 KiB |             39.9% lower |

Raw observations: [performance-2026-10-06.json](performance-2026-10-06.json).
The resource-body metric comes from Resource Timing and excludes the main HTML
navigation. The long-task sum is not Lighthouse TBT: its collection window is
initial network idle, rather than Lighthouse's FCP-to-interactive window.
Vercel compression, real fonts, third-party services, device GPUs, caching and
network conditions can produce different results. The 4.58s LCP in this severe,
uncompressed test still exceeds the 2.5s goal. No blanket speed or Lighthouse
score guarantee is claimed.

## Verification

- TypeScript, ESLint, Prettier and production build passed; all ten localized
  homepage/menu outputs passed SEO verification.
- 55 unit/component tests passed, including video visibility, autoplay failure,
  hidden-tab handling, runtime motion changes and rendering-policy boundaries.
- 27 Playwright checks passed across Chromium desktop and Mobile Chrome
  emulation. One desktop-only cinematic check was intentionally skipped for
  the mobile project. Checks include all five languages at 320px, RTL, ordering
  handoff/cart retention, navigation, theme changes, contact alignment, full
  story captions, signature links and no video downloads with 6× CPU slowdown.
- Desktop hero and mobile hero/footer screenshots were visually inspected.
  After deployment, the public Hebrew page and all eight signature links were
  verified in the live browser. A desktop RTL overlap with the floating
  WhatsApp and Back to Top controls was then corrected and two focused layout checks passed.
- Firefox/WebKit and actual older devices were not run locally: their browser
  downloads were unavailable in this environment. The subsequent CI run passed
  all five configured browser projects, including Firefox and WebKit. No complete accessibility or
  legal-compliance certification is implied by this performance audit.
