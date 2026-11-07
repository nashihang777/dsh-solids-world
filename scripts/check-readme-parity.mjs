import { readFileSync } from 'node:fs'

const zh = readFileSync('README.md', 'utf8')
const en = readFileSync('README.en.md', 'utf8')

const headings = (text) => text.split(/\r?\n/).filter((line) => /^#{1,3} /.test(line))
const fences = (text) => (text.match(/^```/gm) ?? []).length
const badges = (text) => (text.match(/^\[!\[/gm) ?? []).length

const zhH = headings(zh)
const enH = headings(en)

console.log(`headings: zh=${zhH.length} en=${enH.length}`)
console.log(`code fences: zh=${fences(zh)} en=${fences(en)}`)
console.log(`badges: zh=${badges(zh)} en=${badges(en)}`)

let mismatch = zhH.length !== enH.length
for (let i = 0; i < Math.max(zhH.length, enH.length); i++) {
  const a = (zhH[i] ?? '').replace(/^#+\s*/, '')
  const b = (enH[i] ?? '').replace(/^#+\s*/, '')
  const levelA = (zhH[i] ?? '').match(/^#+/)?.[0]
  const levelB = (enH[i] ?? '').match(/^#+/)?.[0]
  if (levelA !== levelB) mismatch = true
  console.log(`  ${String(i).padStart(2)} ${levelA} | ${a}  <->  ${levelB} | ${b}`)
}

if (fences(zh) !== fences(en) || badges(zh) !== badges(en)) mismatch = true
console.log(mismatch ? '\nSTRUCTURE MISMATCH' : '\nstructure matches')
process.exit(mismatch ? 1 : 0)
