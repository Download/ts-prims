import type { PRIM, prim, PrimType } from './prim.js'
import type { memo } from './memo.js'
import type { range, _1K } from './range.js'

import { Prim } from './prim.js'
import { Memo } from './memo.js'

/**
 * A variable length string with a maximum length of `N`
 *
 * `N` must be a literal positive integer number in the range 0 .. 1023.
 *
 * This type is meant to model strings with a limited length, such as
 * SQL's `varchar`. It models types with `max length < 480` exactly
 * and approximates types with `max length >= 480` and `max length < 1023`,
 * using helper type `range`.
 *
 * It is recommended to use this type for short strings that map to database
 * table columns. For longer strings, use `memo` if the string length
 * remains below 64K, or `text` otherwise.
 */
export type varchar<N extends _1K = 255> = prim<memo> & {
  max: range<N>
}

/**
 * A sparse array containing all the varchar type constructors in use in the application,
 * each stored at the index matching the max length of that varchar type
 */
export const varchars: PrimType<varchar>[] = [] // cache

/**
 * The type constructor function for `varchar`.
 *
 * Returns the prim type constructor function for `varchar<N>`, based on the parameter `n`.
 *
 * @param n The max length for the varchar type.
 *    Must be a positive integer number in the range 0 .. 256.
 *
 * @returns The prim type constructor function for `varchar<N>`
 */
export const Varchar = <N extends _1K = 255>(n: N = 255 as N): PrimType<varchar<N>> => {
  if (! varchars[n]) { // not in cache? create
    varchars[n] = Prim<varchar<N>>({
      parent: Memo,
      prim: 'string',
      options: { max: n },
      is: (v: PRIM): v is prim<varchar<N>> => Memo.is(v) && v.length <= n,
      as: (v: PRIM): asserts v is prim<varchar<N>> => {
        if (! Varchar(n).is(v)) {
            throw new TypeError(`"${v}" is not varchar<${n}>`)
        }
      },
    }) as PrimType<varchar>
  }
  // return from cache
  return varchars[n] as PrimType<varchar<N>>
}
