import { type length, lengthConstraint } from './length.js'
import { type prim, Prim } from './prim.js'
// for linking from jsdoc comments:
import type { clob } from './clob.js'
import type { memo } from './memo.js'
import type { varchar } from './varchar.js'

/**
 * The base prim type for text with a maximum length
 * of 16777216 characters (16M), length `14`.
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
 * @see {@link Text} The constructor
 * @see {@link clob} For very long strings with a maximum length of 16M chars
 * @see {@link memo} For medium length strings with a maximum of 4K chars
 * @see {@link varchar} For short strings with a maximum of 256 chars
 */
export type text =
  prim<string, length<14>>

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
export const Text = Prim<text>(
  `text`, String, [ lengthConstraint(14) ]
)
