/** Copyright 2025 by Stijn de Witt, some rights reserved */
import { type prim, Prim } from './prim.js'
import { type Chars, type chars, charsConstraint } from './chars.js'
// For linking from jsdoc comments:
import type { memo } from './memo.js'
import type { text } from './text.js'

/**
 * A variable length string with a maximum length of `N`
 *
 * `N` must be a literal positive integer number in the range 0 .. 256.
 *
 * This type is meant to model strings with a limited length, such as
 * SQL's `varchar`. For longer strings, use `memo` if the string length
 * remains below 64K, or `text` otherwise.
 *
 * @see {@link memo} For medium length strings with a maximum of 4K chars
 * @see {@link Text} For long strings with a maximum of 16M chars
 * @see {@link clob} For very long strings with a maximum of 4G chars
 * @see {@link chars} Constraint for short lengths expressed in chars
 */
export type varchar<N extends Chars> =
  prim<string, chars<N>>

/**
 * The prim factory function for `varchar`.
 *
 * Returns the prim constructor for `varchar<N>`, based on the given `n`.
 *
 * ```ts
 * type zipcode = varchar<5>
 * const Zipcode = Varchar(5)
 * let zip: zipcode = Zipcode('90210') // ok
 * let oops: zipcode = Zipcode('Too long!') // runtime error
 * // TypeError: "Too long!" is not of type 'varchar<5>'
 * ```
 *
 * @param n The max length for the varchar type.
 *    Must be a positive integer number in the range `0` .. `256`.
 *
 * @returns The prim type constructor function for `varchar<N>`
 */
export const Varchar =
  <N extends Chars> (n: N) => Prim <varchar<N>> (
    `varchar<${n}>`, String, [ charsConstraint(n) ]
  )
