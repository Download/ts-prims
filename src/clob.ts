import { type length, lengthConstraint } from './length.js'
import { type prim, Prim } from './prim.js'

/**
 * **C**haracter **L**arge **Ob**ject.
 *
 * The base prim type for strings with a very high maximum length of
 * 4294967296 characters (4G).
 *
 * ```ts
 * import { type clob, Clob } from 'ts-prims'
 *
 * // narrow using cast
 * let x: clob = 'Hello World!' as clob
 * // or using runtime check by constructor
 * x = Clob('Checked at runtime')
 * ```
 *
 * This type is meant to model very long strings, with lengths
 * up to 4294967296 (4G) characters, length `15`. For shorter
 * strings, prefer `text`, `memo` or `varchar`.
 *
 * @see {@link Clob} The constructor
 * @see {@link text} For high length strings with a maximum of 16777216 (16M) chars
 * @see {@link memo} For medium length strings with a maximum of 4096 (4K) chars
 * @see {@link varchar} For short strings with a maximum of 256 chars
 */
export type clob =
  prim<string, length<15>>

/**
 * The prim type constructor function for `clob`
 *
 * ```ts
 * import { type clob, Clob } from 'ts-prims'
 *
 * // narrow using cast
 * let x: clob = 'Hello World!' as clob
 * // or using runtime check by constructor
 * x = Clob('Checked at runtime')
 * ```
 *
 * @see {@link clob}
 */
export const Clob = Prim<clob>(
  `clob`, String, lengthConstraint(15)
)
