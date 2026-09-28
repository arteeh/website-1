import { describe, expect, it } from 'vitest'
import { renderMarkdown, renderMarkdownInline, sanitizeHtml } from '../utils/markdown'

describe('utils/markdown', () => {
  it('renders markdown links and emphasis', () => {
    const html = renderMarkdown('Read the [docs](https://docs.projectbluefin.io) **now**')
    expect(html).toContain('<a href="https://docs.projectbluefin.io">docs</a>')
    expect(html).toContain('<strong>now</strong>')
  })

  it('keeps the raw HTML tags locale strings legitimately use', () => {
    const html = sanitizeHtml('line one<br>line two <b>bold</b> <a href="https://flathub.org" target="_blank">Flathub</a>')
    expect(html).toContain('<br />')
    expect(html).toContain('<b>bold</b>')
    expect(html).toContain('target="_blank"')
  })

  it('strips script tags from a locale string', () => {
    const html = renderMarkdown('hello <script>window.leak()</script> world')
    expect(html).not.toContain('<script')
    expect(html).toContain('hello')
    expect(html).toContain('world')
  })

  it('strips event handler attributes', () => {
    const html = renderMarkdown('<img src="x" onerror="window.leak()">')
    expect(html).not.toContain('onerror')
  })

  it('strips javascript: URLs from links', () => {
    const html = renderMarkdownInline('[click](javascript:window.leak())')
    expect(html).not.toContain('javascript:')
  })

  it('renders inline markdown without a wrapping paragraph', () => {
    const html = renderMarkdownInline('a [link](https://projectbluefin.io)')
    expect(html).not.toContain('<p>')
    expect(html).toContain('<a href="https://projectbluefin.io">link</a>')
  })
})
