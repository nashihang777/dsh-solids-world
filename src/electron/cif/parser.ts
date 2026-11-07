import { cifError, type CifError } from './errors'
import { lex, type Token } from './lexer'

export interface Loop {
  columns: string[]
  rows: Array<{ line: number; values: string[] }>
}

export interface DataBlock {
  name: string
  line: number
  pairs: Map<string, { line: number; value: string }>
  loops: Loop[]
}

export function parse(source: string): DataBlock[] {
  const tokens = lex(source)
  const blocks: DataBlock[] = []
  let current: DataBlock | null = null
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]
    switch (token.kind) {
      case 'data-block-head':
      case 'global-block-head': {
        current = {
          name: token.kind === 'data-block-head' ? token.text : 'global',
          line: token.line,
          pairs: new Map(),
          loops: [],
        }
        blocks.push(current)
        i++
        break
      }
      case 'save-frame-head': {
        const depth = 1
        i = skipSaveFrame(tokens, i + 1, depth, token.line)
        break
      }
      case 'save-frame-end':
      case 'stop': {
        i++
        break
      }
      case 'loop-head': {
        if (!current) {
          throw syntaxError(token.line, 'loop_ 出现在任何 data_ 块之外', '在 loop_ 前声明 data_ 块')
        }
        i = parseLoop(tokens, i + 1, current)
        break
      }
      case 'tag': {
        if (!current) {
          throw syntaxError(token.line, `标签 ${token.text} 出现在任何 data_ 块之外`, '在标签前声明 data_ 块')
        }
        const valueToken = tokens[i + 1]
        if (!valueToken || valueToken.kind !== 'value') {
          throw syntaxError(token.line, `标签 ${token.text} 缺少取值`, '检查该标签后是否紧跟一个值')
        }
        current.pairs.set(token.text, { line: valueToken.line, value: valueToken.text })
        i += 2
        break
      }
      case 'value': {
        throw syntaxError(token.line, `多余的值 "${token.text}"`, '该值之前没有标签或 loop_ 声明')
      }
    }
  }
  return blocks
}

function parseLoop(tokens: Token[], start: number, block: DataBlock): number {
  const columns: string[] = []
  let i = start
  while (i < tokens.length && tokens[i].kind === 'tag') {
    columns.push(tokens[i].text)
    i++
  }
  if (columns.length === 0) {
    throw syntaxError(tokens[start - 1].line, 'loop_ 之后没有任何标签列', 'loop_ 后应先列出标签再跟数据行')
  }
  const rows: Array<{ line: number; values: string[] }> = []
  while (i < tokens.length && tokens[i].kind === 'value') {
    const rowLine = tokens[i].line
    const values: string[] = []
    for (let c = 0; c < columns.length; c++) {
      const valueToken = tokens[i]
      if (!valueToken || valueToken.kind !== 'value') {
        throw syntaxError(rowLine, `数据行只有 ${values.length} 列，但循环声明了 ${columns.length} 列`, '检查该行是否有缺失的列值')
      }
      values.push(valueToken.text)
      i++
    }
    rows.push({ line: rowLine, values })
  }
  block.loops.push({ columns, rows })
  return i
}

function skipSaveFrame(tokens: Token[], start: number, depth: number, frameLine: number): number {
  let i = start
  while (i < tokens.length) {
    const token = tokens[i]
    if (token.kind === 'save-frame-head') {
      i = skipSaveFrame(tokens, i + 1, depth + 1, token.line)
      continue
    }
    if (token.kind === 'save-frame-end') return i + 1
    if (token.kind === 'data-block-head' || token.kind === 'global-block-head') {
      throw syntaxError(frameLine, 'save_ 帧未关闭就遇到新的 data_ 块', '补上 save_ 结束行')
    }
    i++
  }
  throw syntaxError(frameLine, 'save_ 帧未关闭（缺少结束的 save_ 行）', '补上结束的 save_ 行')
}

function syntaxError(line: number, reason: string, hint: string): CifError {
  return cifError('SYNTAX', line, reason, hint)
}
