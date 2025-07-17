import { type length, lengthConstraint } from './length.js'
import { type prim, Prim } from './prim.js'
// for linking from jsdoc comments:
import type { clob } from './clob.js'
import type { varchar } from './varchar.js'
import type { text } from './text.js'

/**
 * The base prim type for text with a maximum length of
 * 4096 chars (4K), length `11`
 *
 * Extends {@link text}.
 *
 * ```ts
 * import {
 *   type text, Text,
 *   type memo, Memo
 * } from 'ts-prims'
 *
 * let x: memo = Memo('Hello World!')
 * let y: text = Text('super')
 * y = x // ok
 * x = y // error
 * // Type 'text' is not assignable to type 'memo'.
 * ```
 *
 * @see {@link Memo} The constructor
 * @see {@link clob} For very long strings with a maximum length of 16M chars
 * @see {@link text} For long strings with a maximum length of 256K chars
 * @see {@link varchar} For short strings with a maximum length of 256 chars
 */
export type memo =
  prim<string, length<11>>

/**
 * The prim type constructor function for `memo`.
 *
 * Extends {@link Text}.
 *
 * ```ts
 * import { type memo, Memo } from 'ts-prims'
 *
 * // narrow using cast
 * let x: memo = 'Hello World!' as memo
 * // or using runtime check by constructor
 * x = Memo('Hello World!')
 * ```
 *
 * @see {@link memo}
 */
export const Memo = Prim<memo> (
  'memo', String, [ lengthConstraint(11) ]
)
