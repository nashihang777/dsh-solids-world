import { cifError, type CifError } from './errors'

export type TokenKind =
  | 'data-block-head'
  | 'save-frame-head'
  | 'save-frame-end'
  | 'loop-head'
  | 'stop'
  | 'global-block-head'
  | 'tag'
  | 'value'

export interface Token {
  kind: TokenKind
  text: string
  line: number
}

const STOP_WORDS = new Set(['.', '?'])

function isWhitespace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n'
}

function isBareWordTerminator(ch: string): boolean {
  return isWhitespace(ch) || ch === '#' || ch === '\'' || ch === '"' || ch === ';'
}

export function lex(source: string): Token[] {
  const tokens: Token[] = []
  const lines = source.split(/\r\n|\r|\n/)
  let inTextBlock = false
  let textBlockStartLine = 0
  let textBlockBody: string[] = []

  for (let index = 0; index < lines.length; index++) {
    const raw = lines[index]
    const lineNo = index + 1

    if (inTextBlock) {
      if (raw.trimStart().startsWith(';') && raw.trim() === ';') {
        tokens.push({ kind: 'value', text: textBlockBody.join('\n'), line: textBlockStartLine })
        inTextBlock = false
        textBlockBody = []
      } else {
        textBlockBody.push(raw)
      }
      continue
    }

    let pos = 0
    while (pos < raw.length) {
      const ch = raw[pos]
      if (isWhitespace(ch)) {
        pos++
        continue
      }
      if (ch === '#') break

      if (ch === ';') {
        const before = raw.slice(0, pos)
        if (before.trim() === '') {
          inTextBlock = true
          textBlockStartLine = lineNo
          textBlockBody = []
          pos = raw.length
          continue
        }
        throw syntaxError(lineNo, '分号出现在行中间', '分号起始的文本块必须从行首开始')
      }

      if (ch === '\'' || ch === '"') {
        const quote = ch
        let end = pos + 1
        while (end < raw.length) {
          if (raw[end] === quote && (end + 1 >= raw.length || isWhitespace(raw[end + 1]))) break
          end++
        }
        if (raw[end] !== quote) {
          throw syntaxError(lineNo, `${quote === "'" ? '单' : '双'}引号字符串未闭合`, '检查该行的引号配对')
        }
        const value = raw.slice(pos + 1, end)
        classifyValue(value, lineNo, tokens)
        pos = end + 1
        continue
      }

      let end = pos
      while (end < raw.length && !isBareWordTerminator(raw[end])) end++
      const word = raw.slice(pos, end)
      if (word.length > 0) classifyValue(word, lineNo, tokens)
      pos = end
    }
  }

  if (inTextBlock) {
    throw syntaxError(textBlockStartLine, '文本块未结束（缺少单独成行的分号）', '补上结束分号所在行')
  }
  return tokens
}

function classifyValue(word: string, lineNo: number, tokens: Token[]): void {
  if (STOP_WORDS.has(word)) {
    tokens.push({ kind: 'value', text: word, line: lineNo })
    return
  }
  if (word.startsWith('data_')) {
    tokens.push({ kind: 'data-block-head', text: word.slice(5), line: lineNo })
    return
  }
  if (word.startsWith('save_')) {
    if (word.length > 5) tokens.push({ kind: 'save-frame-head', text: word.slice(5), line: lineNo })
    else tokens.push({ kind: 'save-frame-end', text: '', line: lineNo })
    return
  }
  if (word === 'loop_') {
    tokens.push({ kind: 'loop-head', text: '', line: lineNo })
    return
  }
  if (word === 'stop_') {
    tokens.push({ kind: 'stop', text: '', line: lineNo })
    return
  }
  if (word === 'global_') {
    tokens.push({ kind: 'global-block-head', text: '', line: lineNo })
    return
  }
  if (word.startsWith('_')) {
    tokens.push({ kind: 'tag', text: word.toLowerCase(), line: lineNo })
    return
  }
  tokens.push({ kind: 'value', text: word, line: lineNo })
}

function syntaxError(line: number, reason: string, hint: string): CifError {
  return cifError('SYNTAX', line, reason, hint)
}
