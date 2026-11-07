export type CifErrorCode =
  | 'FILE_TOO_LARGE'
  | 'SYNTAX'
  | 'MISSING_CELL'
  | 'MISSING_ATOMS'
  | 'UNKNOWN_SPACEGROUP'
  | 'NONSTANDARD_SETTING'
  | 'NO_COORDINATE_BLOCK'

export interface CifError {
  line: number
  reason: string
  hint: string
  code: CifErrorCode
}

export function cifError(code: CifErrorCode, line: number, reason: string, hint: string): CifError {
  return { code, line, reason, hint }
}

export function formatCifError(error: CifError, sizeBytes?: number): string {
  switch (error.code) {
    case 'FILE_TOO_LARGE':
      return `文件 ${sizeBytes !== undefined ? `${(sizeBytes / 1024 / 1024).toFixed(1)} MB` : ''} 超过 5 MB 上限。本软件面向教学级结构。`
    case 'SYNTAX':
      return `第 ${error.line} 行：${error.reason}。${error.hint}`
    case 'MISSING_CELL':
      return '缺少晶胞参数（_cell_length_a 等）。CIF 必须声明 a/b/c 与三个角。'
    case 'MISSING_ATOMS':
      return '找不到原子坐标表（_atom_site_fract_*）。'
    case 'UNKNOWN_SPACEGROUP':
      return `空间群记号 '${error.reason}' 无法识别（可能是非标准缩写）。${error.hint}`
    case 'NONSTANDARD_SETTING':
      return '空间群使用了非惯用原点设定，暂不支持。请用标准设定导出。'
    case 'NO_COORDINATE_BLOCK':
      return '文件中没有包含原子坐标的数据块。'
  }
}
