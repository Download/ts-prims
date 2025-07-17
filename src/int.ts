import type { width, LowWidth, _8bit, _16bit, _24bit,
  _32bit, _40bit, _48bit, _54bit, _64bit } from './width.js'
import { widthConstraint } from './width.js'
import type { big, big64 } from './big.js'
import { type prim, Prim } from './prim.js'
import { type varint, isInteger } from './varint.js'

/**
 * Int type with low int width `W`.
 *
 * ```ts
 * type byte = int<1>
 * // type byte = number & supertype<number> & width<1>
 *
 * type word = int<2>
 * // type word = number & supertype<number> & width<2>
 *
 * let x: byte = 100 as byte
 * let y: word = 1000 as word
 * y = x // ok
 * x = y // error
 * // Type 'word' is not assignable to type 'byte'.
 * ```
 *
 * @template W The width
 * @returns The int type with the specified (low) width
 *
 * @see {@link int8} for the first int in the low-width (fast) range
 * @see {@link int54} for the last int in the low-width (fast) range
 * @see {@link big} for the ints in the high-width (slow) range
 * @see {@link varint} for the low-level type that accepts all widths
 * @see {@link LowWidth} for the supported low number widths
 */
export type int <W extends LowWidth = 7> =
  prim<number, width<W>>

/**
 * @template W The `Width`, inferred from parameter `w`.
 *
 * @param w The width of this type
 * @returns The constructor for `int<W>`
 *
 * @see {@link int}
 * @see {@link LowWidth}
 */
export const Int = <W extends LowWidth = 7> (w:W = 7 as W) => Prim<int<W>> (
  `int<${w}>`, Number, [ isInteger, widthConstraint(w) ]
)

/**
 * `8`-bit integer in the `LowWidth` (fast) range.
 *
 * @see {@link int16} for the next int in the low-width (fast) range
 */
export type int8 = int<_8bit>

/** Constructor for {@link int8} */
export const Int8 = Int(1)

/**
 * `16`-bit integer in the `LowWidth` (fast) range.
 *
 * @see {@link int8} for the previous int in the low-width (fast) range
 * @see {@link int24} for the next int in the low-width (fast) range
 */
export type int16 = int<_16bit>

/** Constructor for {@link int16} */
export const Int16 = Int(2)

/**
 * `24`-bit integer in the `LowWidth` (fast) range.
 *
 * @see {@link int16} for the previous int in the low-width (fast) range
 * @see {@link int32} for the next int in the low-width (fast) range
 */
export type int24 = int<_24bit>

/** Constructor for {@link int24} */
export const Int24 = Int(3)

/**
 * `32`-bit integer in the `LowWidth` (fast) range.
 *
 * @see {@link int24} for the previous int in the low-width (fast) range
 * @see {@link int40} for the next int in the low-width (fast) range
 */
export type int32 = int<_32bit>

/** Constructor for {@link int32} */
export const Int32 = Int(4)

/**
 * `40`-bit integer in the `LowWidth` (fast) range.
 *
 * @see {@link int32} for the previous int in the low-width (fast) range
 * @see {@link int48} for the next int in the low-width (fast) range
 */
export type int40 = int<_40bit>

/** Constructor for {@link int40} */
export const Int40 = Int(5)

/**
 * `48`-bit integer in the `LowWidth` (fast) range.
 *
 * @see {@link int40} for the previous int in the low-width (fast) range
 * @see {@link int54} for the next int in the low-width (fast) range
 */
export type int48 = int<_48bit>

/** Constructor for {@link int48} */
export const Int48 = Int(6)

/**
 * `54`-bit integer in the `LowWidth` (fast) range.
 *
 * The widest 'low width' (fast) integer number type.
 *
 * Please do consider using this type over `big64` if at all possible, since it
 * will most likely lead to significantly better performance on the Javascript
 * platform.
 *
 * @see {@link int48} for the previous int in the low-width (fast) range
 * @see {@link big64} for the first int in the high-width (slow) range
 */
export type int54 = int<_54bit>

/** Constructor for {@link int54} */
export const Int54 = Int(7)
