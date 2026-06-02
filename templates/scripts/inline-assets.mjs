import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

const distDir = resolve('dist')
const htmlPath = resolve(distDir, 'index.html')

if (!existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run slidev build first.')
  process.exit(1)
}

let html = readFileSync(htmlPath, 'utf-8')

// Resolve a path relative to dist/
function resolveDist(p) {
  return resolve(distDir, p)
}

// Inline <link rel="stylesheet" href="...">
html = html.replace(/<link\s+([^>]*\s+)?rel=["']stylesheet["'](\s+[^>]*)?\s+href=["']([^"']+)["'][^>]*>/gi, (match) => {
  const hrefMatch = match.match(/href=["']([^"']+)["']/)
  if (!hrefMatch) return match
  let href = hrefMatch[1]
  // Skip external URLs
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return match
  // Remove leading slash
  if (href.startsWith('/')) href = href.slice(1)
  const cssPath = resolveDist(href)
  if (!existsSync(cssPath)) {
    console.warn(`  skip missing: ${href}`)
    return match
  }
  const css = readFileSync(cssPath, 'utf-8')
  return `<style>${css}</style>`
})

// Inline <script src="...">
html = html.replace(/<script\s+([^>]*\s+)?src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (match) => {
  const srcMatch = match.match(/src=["']([^"']+)["']/)
  if (!srcMatch) return match
  let src = srcMatch[1]
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) return match
  if (src.startsWith('/')) src = src.slice(1)
  const jsPath = resolveDist(src)
  if (!existsSync(jsPath)) {
    console.warn(`  skip missing: ${src}`)
    return match
  }
  const js = readFileSync(jsPath, 'utf-8')
  const typeMatch = match.match(/type=["']([^"']+)["']/)
  const type = typeMatch ? ` type="${typeMatch[1]}"` : ''
  return `<script${type}>${js}</script>`
})

// Remove modulepreload links
html = html.replace(/<link\s+rel=["']modulepreload["'][^>]*>/gi, '')

const outPath = resolve(distDir, 'index.html')
writeFileSync(outPath, html, 'utf-8')

console.log('Single HTML file built: dist/index.html')
console.log(`  Size: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`)
