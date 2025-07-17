/** Copyright 2025 by Stijn de Witt, all rights reserved */
import type {
  prim, PRIM, Constraint, SuperConstructor, PrimConstructor
} from './prim.js'
import { Prim, display } from './prim.js'
import type { Width, width, LowWidth, HighWidth, NumberWidth, _8bit, _16bit,
  _24bit, _32bit, _40bit, _48bit, _54bit, _64bit, _96bit, _128bit, _160bit,
  _192bit, _256bit, _512bit, _4Kbit } from './width.js'
import { widthConstraint } from './width';

/**
 * The possible prim types for the `varint` type.
 */
export type VARINT = number | bigint

/**
 * Specifies the platform-specific underlying processing / storage format for
 * integers, based on the given int width `W`, in a cross-platform way.
 *
 * This abstraction allows ints to be highly flexible in their size, while
 * simultaneously rigidly specified. A 'fixed varint' if you will.
 *
 * In this Javascript implementation, low-width ints are mapped to type
 * `number` and high-width ints are mapped to type `bigint`. And yes, `64`-bit
 * is in the 'high' number range in this specification. But implementations are
 * allowed to redefine this `IntType` in a compatible manner to rigidly specify
 * the mapping of the different int sizes specified in this specification to
 * multiple sub-types of `IntType` that map better to whatever the underlying
 * platform of that implementation may be. Devs that are trying to avoid
 * interoperability issues (which should be all of you) are adviced to avoid
 * directly importing/using the various subtypes of `IntType`. Rely on
 * `IntType` itself, which is abstract, or on the finer-grained but still
 * cross-platform `IntWidth`.
 *
 * In general, all the widths in the `LowWidth` range are guaranteed to be
 * performant across the board, while the performance of the widths in the
 * `HighWidth` range will vary greater across platforms and implementations, be
 * more size-dependant, and will in general be significantly lower, with
 * `IntWidth` `8` (`64`-bits) being the big exception that will mostly do well
 * but might suffer a performance penalty on the Javascript platform,
 * especially when used with older/mobile hardware.
 *
 * @template W the int width (a `number` in the range `0 <= W <= 15`)
 *
 * @see {@link NativeIntWidth}
 * @see {@link Width}
 */
export type IntegerType<W extends Width = 7> =
  W extends NumberWidth ?
  number :
  bigint

/**
 * Returns the constructor for the `varint` with the given Width `W`.
 *
 * @param w The width of the integer type, in the range `0 <= w <= 15`
 * @returns `Number` or `BigInt`
 */
export const integerType = <W extends Width> (w:W) =>
  (w <= 7 ? Number : BigInt) as SuperConstructor<varint<W>>

/**
 * Runtime constraint that checks whether the given value `v` is an integer.
 *
 * @param pc The prim constructor for the type `P`
 * @param v The value to check
 * @returns `undefined` if `v` is an integer, otherwise a `string` error message
 */
export const isInteger: Constraint =
  <P extends PRIM> (pc: PrimConstructor<P>, v: PRIM) =>
  (typeof v == 'bigint') || Number.isInteger(v) ? undefined :
  `${display(v)} is not assignable to type '${pc.name}'.\n` +
  `  Not an integer.`

  /**
 * Low-level 'fixed variable-width' signed integer type.
 *
 * This integer type allows for a wide range of bit widths to be supported,
 * from `8` to `4096`. It is 'fixed' variable-width because this specification
 * has selected `16` different possible widths and those are the only options
 * available. Of course, lower bit-width numbers always 'fit' in the higher
 * bit-width numbers, but not vice versa.
 *
 * ```ts
 * type byte = varint<1>
 * // type byte = number & {
 * //   width?: Lte<1> | undefined;
 * // }
 *
 * type word = varint<2>
 * // type word = number & {
 * //    width?: Lte<2> | undefined;
 * // }
 *
 * let x: byte = 100; // ok
 * let y: word = 1000; // ok
 * y = x // ok
 * x = y // error
 * // Type 'word' is not assignable to type 'byte'.
 * ```
 *
 * The available widths have been split in two sub-ranges, `LowWidth` and
 * `HighWidth`. The low-width numbers are procesed and stored in the form
 * of platform-native types that are very performant. The high-width numbers
 * *might* be stored and processed efficiently, but might very well end up
 * being emulated by some 'big number' library, in case of the Javascript
 * platform, `bigint`, in case of the Java platform, `BigNumber` etc.
 *
 * For maximum performance stick to the `LowWidth` range. Prefer to use `int`
 * and `big` instead, which communicate the differences.
 *
 * @template W The int width
 * @returns The int type with the specified width
 *
 * @see {@link int} for the low-width (fast) int types
 * @see {@link big} for the high-width (slow) int types
 * @see {@link Width} for all int widths
 * @see {@link LowWidth} for the int widths in the low (fast) range
 * @see {@link HighWidth} for the int widths in the high (slow) range
 */
export type varint <W extends Width> =
  prim<IntegerType<W>, width<W>>

/**
 * Returns the prim constructor for the `varint` with the given Width `W`.
 *
 * This constructor function validates that the given value `v` is an
 * integer and that it is within the range of the width `w`.
 *
 * ```ts
 * type byte = varint<1>
 * const Byte = Varint(1)
 * let b: byte = Byte(250) // runtime error
 * // TypeError: 250 is not in range of 'varint<1>': -128 .. 127
 *
 * @template W The width (type), inferred from param `w`
 * @param w The width (value)
 * @returns The prim constructor function
 */
export const Varint = <W extends Width> (w:W) => Prim<varint<W>> (
  `varint<${w}>`, integerType(w), [ isInteger, widthConstraint(w) ]
)
