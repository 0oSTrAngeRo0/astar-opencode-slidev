# Slidev Presentation

This is a Slidev project. Slide content is in `slides.md`.

## Commands

- `npm run dev` — Dev server at http://localhost:3030
- `npm run build` — Single HTML output to `dist/`
- `npm run export` — Export to PDF

## Working with Slides

- Edit `slides.md` to add/modify slides
- Slides are separated by `---`
- First frontmatter block is the deck-level headmatter (theme, title, etc.)
- Use `layout: cover` for title slide, `layout: two-cols` for side-by-side
- Presenter notes use HTML comments: `<!-- notes -->`
- Custom styles via `<style>` blocks inside slides

## Adding Content

When the user asks to add slides, write them directly into `slides.md` using Slidev markdown syntax. Common layouts:

| Layout | Use for |
|--------|---------|
| `cover` | Title slide |
| `default` | Content slides |
| `two-cols` | Two columns (use `::right::`) |
| `center` | Centered content |
| `section` | Section divider |
| `quote` | Quotations |
| `image` / `image-right` | Image layouts |

For code examples, use fenced code blocks with language. Enable line highlighting with `{2,3}` or step highlighting with `{1|2-3|all}`.
