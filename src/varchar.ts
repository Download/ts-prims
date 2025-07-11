/** Copyright 2025 by Stijn de Witt, some rights reserved */
import { type PRIM, type prim, Prim } from './prim.js'
import { type memo, Memo } from './memo.js'
import { type Lte } from './util.js'
import { Text } from './text.js'

/**
 * A variable length string with a maximum length of `N`
 *
 * `N` must be a literal positive integer number in the range 0 .. 256.
 *
 * This type is meant to model strings with a limited length, such as
 * SQL's `varchar`. For longer strings, use `memo` if the string length
 * remains below 64K, or `text` otherwise.
 *
 * @see {@link Memo}
 * @see {@link Text}
 * @see {@link Lte}
 */
export type varchar<N extends Lte<256>> =
  prim<memo, { max: Lte<N>, width: Lte<1> }>

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
  <N extends Lte<256>> (n: N) =>
  Prim <varchar<N>> (`varchar<${n}>`, Memo, {
    is: (v: PRIM): v is varchar<N> =>
      Memo.is(v) && v.length <= n
  })
