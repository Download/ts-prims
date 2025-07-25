import type { width, Width, _54bit, _64bit, _96bit,
  _128bit, _160bit, _192bit, _256bit, _512bit, _4Kbit } from './width.js'
import { widthConstraint } from './width.js'
import { type prim, Prim } from './prim.js'
import { isInteger } from './varint.js'
// For linking from jsdoc comments
import type { int, int54 } from './int.js'
import type { varint } from './varint.js'

/**
 * Big int type with high int width `W`.
 *
 * ```ts
 * import type { big, _4Kbit } from 'ts-prims'
 *
 * type big4k = big<_4Kbit>
 * // type big4k = bigint & supertype<bigint> & width<15>
 * ```
 *
 * `big` numbers are always backed by `bigint` values, which is less performant
 * than `number`, so for small `W`, prefer `int` instead. If you need a type
 * that uses either `number` or `bigint` depending on the width, use `varint`.
 *
 * @template W The width
 * @returns The bigint type with the specified (high) width
 *
 * @see {@link big64} for the first big int in the high-width (slow) range
 * @see {@link int} for the ints in the low-width (fast) range
 * @see {@link varint} for the low-level type that accepts all widths
 * @see {@link Width} for all supported number widths
 */
export type big <W extends Width> =
  prim<bigint, width<W>>

/**
 * Returns a constructor for `big` integer numbers with the given Width `W`.
 *
 * `big` numbers are always backed by `bigint` values, which is less performant
 * than `number`, so for small `W`, prefer `int` instead. If you need a type
 * that uses either `number` or `bigint` depending on the width, use `varint`.
 *
 * @template W The `Width`, inferred from parameter `w`.
 *
 * @param w The width of this type
 * @returns The constructor for `big<W>`
 *
 * @see {@link big} For the prim type
 * @see {@link Width} The widths of the big int types
 * @see {@link isInteger} constraint that values must be integer
 * @see {@link widthConstraint} constraint that values must be within width `W`
 * @see {@link varint} for the low-level type that accepts all widths
 */
export const Big = <W extends Width> (w:W) => Prim<big<W>> (
  `big<${w}>`, BigInt, [ isInteger, widthConstraint(w) ]
)

/**
 * `64`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * The Javascript platform only supports up to `54`-bit integers with the
 * native `number` type. Therefore, values of type `big64` are unfortunately
 * stored as `bigint`, which is a variable-width format that supports ints
 * with hundreds or even thousands of bits, but is much slower than
 * native `number`. If it is possible to use `int54` instead, prefer that.
 * Most other platforms have native support for `64`-bit integers, but if
 * you want true cross-platform performance guarantees, stick to `int54`.
 *
 * @see {@link int54} for the last int in the low-width (fast) range
 * @see {@link big128} for the next int in the high-width (slow) range
 */
export type big64 = big<_64bit>

/** Constructor for {@link big64} */
export const Big64 = Big(8)

/**
 * `96`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `96`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big64} for the previous int in the high-width (slow) range
 * @see {@link big128} for the next int in the high-width (slow) range
 */
export type big96 = big<_96bit>

/** Constructor for {@link big96} */
export const Big96 = Big(9)

/**
 * `128`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `128`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big96} for the previous int in the high-width (slow) range
 * @see {@link big160} for the next int in the high-width (slow) range
 */
export type big128 = big<_128bit>

/** Constructor for {@link big128} */
export const Big128 = Big(10)

/**
 * `160`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `160`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big128} for the previous int in the high-width (slow) range
 * @see {@link big192} for the next int in the high-width (slow) range
 */
export type big160 = big<_160bit>

/** Constructor for {@link big160} */
export const Big160 = Big(11)

/**
 * `192`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `192`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big160} for the previous int in the high-width (slow) range
 * @see {@link big256} for the next int in the high-width (slow) range
 */
export type big192 = big<_192bit>

/** Constructor for {@link big192} */
export const Big192 = Big(12)

/**
 * `256`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `256`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big192} for the previous int in the high-width (slow) range
 * @see {@link big512} for the next int in the high-width (slow) range
 */
export type big256 = big<_256bit>

/** Constructor for {@link big256} */
export const Big256 = Big(13)

/**
 * `512`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `512`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big256} for the previous int in the high-width (slow) range
 * @see {@link big4K} for the next int in the high-width (slow) range
 */
export type big512 = big<_512bit>

/** Constructor for {@link big512} */
export const Big512 = Big(14)

/**
 * `4K`-bit integer in the `HighWidth` (slow) range.
 *
 * **warning: may degrade performance!**
 * Most platforms have no native support for `4K`-bit numbers. We emulate
 * them, in this case with `bigint` and on other platforms in similar ways.
 *
 * @see {@link big512} for the previous int in the high-width (slow) range
 */
export type big4K = big<_4Kbit>

/** Constructor for {@link big4K} */
export const Big4K = Big(15)
