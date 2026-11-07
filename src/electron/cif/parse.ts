/**
 * CIF entry point.
 *
 * The desktop build read the file from disk here. The Harness plugin receives
 * the text from the browser File API instead, so `parseCifSource` (the shared
 * syntax + symmetry path) is unchanged and only the file-reading wrapper moved
 * to the page-side bridge in `../client/bridge.ts`.
 */

import { cifError } from './errors'
import { parse } from './parser'
import { extractStructure, type StructureData } from './structure'

export const MAX_CIF_BYTES = 5 * 1024 * 1024

function stripExtension(fileName: string): string {
  const slash = Math.max(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'))
  const base = slash >= 0 ? fileName.slice(slash + 1) : fileName
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(0, dot) : base
}

export function parseCifSource(source: string, fileName: string): StructureData {
  const blocks = parse(source)
  if (blocks.length === 0) {
    throw cifError('NO_COORDINATE_BLOCK', 1, '', '')
  }
  return extractStructure(blocks, fileName, stripExtension(fileName))
}

/** Parse CIF text that already arrived from the page, enforcing the size cap. */
export function parseCifText(source: string, fileName: string): StructureData {
  const sizeBytes = new TextEncoder().encode(source).length
  if (sizeBytes > MAX_CIF_BYTES) {
    throw cifError('FILE_TOO_LARGE', 0, `${sizeBytes}`, '')
  }
  return parseCifSource(source, fileName)
}
