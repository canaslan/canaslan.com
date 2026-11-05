# Website layout contract: Figma and code

Approved design direction: 17 October 2026. **Figma styles now use a full-page desktop grid. Website CSS has not yet been migrated.** This replaces the earlier sidebar-offset and nested inner-grid recommendation.

## Apply the guide to the whole page frame

No nested frame is required to apply these guides.

### Desktop: 1024 px and above

Select the page frame and apply **Layout/Desktop/Page**:

- Columns: 12, alignment: Stretch.
- Outer margin: 0; gutter: 0.
- The grid spans the entire page, including the area behind navigation.
- Main content occupies columns 4–9: 50% of the viewport width, centered on the whole page.
- Navigation sits independently at the top left with its existing 16 px inset. Its intrinsic width does not shift or shrink the page grid.
- Navigation must not cover main content. The first three columns provide its surrounding space, but do not prescribe a fixed navigation width.

For viewport width V: each column is V/12, main starts at V/4 and has width V/2. In a future 12-track CSS implementation, columns 4–9 correspond to grid lines 4 / 10. The three equal groups are 3 / 6 / 3 columns, or proportions 1 / 2 / 1, across the full viewport.

The 1024, 1440 and 1768 styles under **Layout/Desktop/Page presets** have the same stretch settings. They are retained with their existing style IDs so linked frames receive the update. Use the single Layout/Desktop/Page style for new desktop frames; width-specific calculations are unnecessary.

Do not subtract sidebar width, use a left-offset guide, or add the previous fluid horizontal padding to this grid. Zero grid margin does not remove the navigation's own padding or component spacing.

### Mobile and tablet: below 1024 px

Select the page frame and apply **Layout/Mobile/Page**:

- Columns: 1, alignment: Stretch.
- Outer margin: 16 px; gutter: 0.
- Hide desktop navigation; use the existing overlay navigation pattern.
- Main content fills the available width, V − 32 px.

The 768 px reference still uses the mobile shell. The former zero-margin inner mobile guide is retained under **Legacy/Layout/Mobile/Inner tracks** for existing consumers; do not apply it to a new full-page mobile frame.

## Reference sizes

- 320 / xxs: mobile, 16 px margins, 288 px available content.
- 480 / xs: mobile, 16 px margins, 448 px available content.
- 768 / s: mobile, 16 px margins, 736 px available content.
- 1024 / m: desktop, zero margins; main x = 256 px, width = 512 px.
- 1440 / l: desktop, zero margins; main x = 360 px, width = 720 px.
- 1768 / xl: desktop, zero margins; main x = 442 px, width = 884 px.

These are reference frames, not six different shell layouts. Check 1023 and 1024 px together at implementation time, including enlarged text and long navigation labels.

## Page structure and remaining design decisions

The default desktop content placement, including the approved Contact example, is columns 4–9. Navigation and content share the full-page coordinate system. Layout guides are alignment aids; they do not move content or implement responsive behavior themselves.

Home can retain vertical centering. Other pages retain their appropriate vertical rhythm; this agreement changes horizontal placement, not typography, component spacing or theme behavior.

Wider templates require a separately agreed column span and safe clearance from navigation. Do not transfer the old all-tracks wide rule onto the new full-page grid: that could place content underneath navigation. Existing 960/1024 px content caps and the InfoTable 600 px cap are current implementation details, not blanket approval to widen all content to the six-column boundary. Component width changes and any ultra-wide cap should be decided during the code migration.

## Current implementation: migration pending

[src/styles/layout.css](../../src/styles/layout.css) still defines:

- An intrinsic-width sidebar plus the remaining content area.
- A 1fr / 2fr / 1fr grid inside that remaining area.
- Horizontal padding clamp(32px, 4vw, 64px).
- Home/About in the middle track; wide pages spanning those tracks with a 1024 px cap.
- One mobile track with 16 px padding.

These are historical implementation facts, not the approved desktop specification above. No application CSS, page templates, token sources or generated files were changed in this documentation/style update.

The existing mobile Home minimum-height region is 100vh plus 32 px of outer vertical padding. Its resulting overflow remains an implementation detail to review separately.

## Tokens and implementation handoff

Reuse spacing-0 = 0, spacing-3 = 16 and the existing desktop columns/m = 12 variable. The Figma guide margin/gutter/count bindings use those existing variables. Preserve the existing semantic colors, typography and icon variables in both themes.

The exported grid token counts 2 / 6 / 6 / 12 / 12 / 12 do not currently construct the CSS shell. The new mobile page guide has one column; reconcile that distinction explicitly during a future token export. The viewport ratio variables are currently generated with px units; do not use them as fractional CSS ratios without correcting the generator.

During implementation, preserve semantic aside/nav/main landmarks, keyboard navigation, overlay focus management and theme behavior. Figma's single-frame workflow does not require flattening semantic HTML. Verify navigation clearance near the breakpoint, text resizing, narrow-screen reflow and any wide-content spans. Update source tokens where required, regenerate with npm run tokens, and run npm run build after application changes. Never hand-edit generated CSS.

## Verification and resources

This update verifies saved Figma guide counts, alignment, offsets and bindings, and checks documentation references. Application build and browser parity testing are not required for documentation-only changes; visual parity with the website is pending the code migration.

- [Figma Layout page](https://www.figma.com/design/E0Vs82Vdrm0nCysrrSbw7U?node-id=7542-6383)
- [Shared Layout](../../src/layouts/Layout.astro)
- [Navigation](../../src/components/SiteNav.astro)
- [Mobile navigation](../../src/components/MobileNav.astro)
- [Component widths](../../src/styles/info-table.css)
- [Viewport tokens](../../src/tokens/viewport/value.tokens.json)
- [Grid metadata](../../src/tokens/grid/value.tokens.json)
- [Spacing tokens](../../src/tokens/spacing/mode-1.tokens.json)
- [Token generator](../../scripts/generate-tokens.mjs)

**Historical asset:** layout-contract.svg depicts the previous sidebar-offset implementation and is retained only as a labeled historical reference. It must not be used as the new design specification.
