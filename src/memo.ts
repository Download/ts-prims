/** Copyright 2025 by Stijn de Witt, some rights reserved */
import { type Lte } from './util.js'
import { type PRIM, type prim, Prim } from './prim.js'
import { type text, Text } from './text.js'

/**
 * The base prim type for text with a maximum length of
 * 4096 chars (4K)
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
 * @see {@link Memo}
 * @see {@link text}
 */
export type memo =
  prim<text, { max: Lte<256> | 4096, width: Lte<4> }>

/**
 * The prim type constructor function for `memo`.
 *
 * Extends {@link Text}.
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
 * @see {@link memo}
 * @see {@link Text}
 * @see {@link text}
 */
export const Memo =
  Prim<memo> ('memo', Text, {
    is: (v: PRIM): v is prim<memo> =>
      Text.is(v) && v.length <= 4096,
  })
