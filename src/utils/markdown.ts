import { marked } from 'marked'
import sanitize from 'sanitize-html'

/**
 * Locale strings are community-contributed (see TRANSLATION-GUIDE.md) and are
 * rendered with `v-html`, so every string must pass through the sanitizer
 * before it reaches the DOM. sanitize-html parses with htmlparser2, so it
 * behaves identically in the browser bundle and in the happy-dom test
 * environment. `target` is allowed on links because locale strings
 * legitimately open external references in a new tab.
 */
const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: sanitize.defaults.allowedTags,
  allowedAttributes: {
    ...sanitize.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
  },
}

/** Render a markdown block to sanitized HTML for use with `v-html`. */
export function renderMarkdown(text: string): string {
  return sanitize(marked.parse(text, { async: false }), SANITIZE_OPTIONS)
}

/** Render inline markdown (no wrapping `<p>`) to sanitized HTML for use with `v-html`. */
export function renderMarkdownInline(text: string): string {
  return sanitize(marked.parseInline(text, { async: false }), SANITIZE_OPTIONS)
}

/** Sanitize a raw HTML locale string for use with `v-html`. */
export function sanitizeHtml(html: string): string {
  return sanitize(html, SANITIZE_OPTIONS)
}
