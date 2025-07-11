/** Copyright 2025 by Stijn de Witt, some rights reserved */
import { type Lte } from './util.js'
import { type prim, Prim } from './prim.js'

/**
 * The base prim type for text with a maximum length
 * of 262144 characters (256K).
 *
 * ```ts
 * import { type text, Text } from 'ts-prims'
 *
 * // narrow using cast
 * let x: text = 'Hello World!' as text
 * // or using runtime check by constructor
 * x = Text('Checked at runtime')
 * ```
 *
 * @see {@link Text}
 */
export type text =
  prim<string, {
    max: Lte<256> | 4096 | 262144,
    width: Lte<15>
  }>

/**
 * The prim type constructor function for `text`
 *
 * ```ts
 * import { type text, Text } from 'ts-prims'
 *
 * // narrow using cast
 * let x: text = 'Hello World!' as text
 * // or using runtime check by constructor
 * x = Text('Checked at runtime')
 * ```
 *
 * @see {@link text}
 */
export const Text =
  Prim<text>(`text`, String, {
    is: (v): v is text =>
      (typeof v == 'string') && v.length <= 262144
  })
