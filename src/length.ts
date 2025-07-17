import type { Lte } from './util.js'
import type { PRIM, Constraint, PrimConstructor } from './prim.js'
import { display } from './prim.js'
// For linking from jsdoc comments:
import type { chars, Chars } from './chars.js'

/**
 * Constrains a type to the given length `L`.
 *
 * Use this type in combination with `lengthConstraint` for runtime presence:
 *
 * ```ts
 * import { type prim, type length, Prim, lengthConstraint } from 'ts-prims'
 *
 * type text = prim<string, length<14>>
 * // type text = string & supertype<string> & length<14>
 *
 * const Text = Prim<text> (`text`, String, lengthConstraint(14))
 * ```
 *
 * This type is using a two-step approach to modeling string lengths that
 * allows for a wide range of lengths, while still being able to specify short
 * lengths with a high degree of precision. The `length` type is used when
 * coarse-grained control with a wide range of lengths is needed. For fine-
 * grained control with short strings only, use the derivative `chars` type.
 *
 * In the broad sense, the `Length` type contains 15 different lengths,
 * which are further subdivided into short, medium and long lengths.
 * The property `length` on the returned type is a union of the maximum
 * length `L` and all lengths less than `L`. The property `chars` is
 * always set to `Lte<64>` for forward compatibility with the `chars` type.
 *
 * @template L The length (`0` through `15`) to constrain the type to
 * @returns `{ length: Lte<L>, chars: Lte<64> }`
 *
 * @see {@link chars} For short lengths expressed in chars
 * @see {@link Length} The 16 fixed lengths in this framework
 * @see {@link Lte} For the `Lte` (less than or equal) type
 */
export type length<L extends Length> =
  { length: Lte<L>, chars: Lte<64> }

/**
 * The 16 fixed lengths in this framework.
 *
 * Lengths are further subdvided into 'short' lengths (`0` through `7`),
 * 'medium' lengths (`8` through `11`) and 'long' lengths (`12` through `15`)
 * for the purpose of selecting the most suitable string length for the
 * application.
 *
 * The `Chars` type allows for a more precise definition of string lengths
 * in chars, which is useful for short strings.
 *
 * Note that length `0` exists mostly for signaling purposes.
 *
 * @see {@link length} for the type constraining a string to a length
 * @see {@link lengthConstraint} for the runtime constraint
 * @see {@link chars} Constraint for short lengths expressed in chars
 * @see {@link Chars} For the short lengths expressed in chars
 * @see {@link ShortLength}
 * @see {@link MediumLength}
 * @see {@link LongLength}
 */
export type Length = ShortLength | MediumLength | LongLength

/**
 * The short string {@link Length}s
 *
 * This type encapsulates the eight short string lengths.
 * The `chars` type further subdivides short length `0` .. `1`
 * into `65` individual char lengths (`0` .. `64`).
 *
 * @see {@link chars} Constraint for the short lengths expressed in chars
 */
export type ShortLength =   0 | 1 |  2 |  3 |  4 |  5 |  6 |  7

/**
 * The medium string {@link Length}s
 *
 * This type encapsulates the four medium lengths.
 */
export type MediumLength = 8 | 9 | 10 | 11

/**
 * The long string {@link Length}s
 *
 * This type encapsulates the four long lengths.
 */
export type LongLength =  12 | 13 | 14 | 15

/** The lengths in chars of the short lengths */
export type ShortLengthChars = readonly
  [  0, 64, 96, 128, 160, 192, 224, 256 ]

/** The lengths in chars of the short lengths */
export const shortLengthChars: ShortLengthChars =
  [  0, 64, 96, 128, 160, 192, 224, 256 ]

/** The lengths in chars of the medium lengths */
export type MediumLengthChars = readonly
  [ 512, 1024, 2048, 4096 ]

/** The lengths in chars of the medium lengths */
export const mediumLengthChars: MediumLengthChars =
  [ 512, 1024, 2048, 4096 ]

/** The lengths in chars of the long lengths */
export type LongLengthChars = readonly
  [ 16384, 262144, 16777216, 4294967296 ]

/** The lengths in chars of the high lengths */
export const longLengthChars: LongLengthChars =
  [ 16384, 262144, 16777216, 4294967296 ]

/** The lengths in chars of all `Length`s */
export type LengthChars = readonly
  [ ...ShortLengthChars, ...MediumLengthChars, ...LongLengthChars ]

/** The lengths in chars of all `Length`s */
export const lengthChars: LengthChars =
  [ ...shortLengthChars, ...mediumLengthChars, ...longLengthChars]

/** Expresses a length constraint as a function of `L` */
export type LengthConstraint =
  <L extends Length> (l: L) => Constraint

/** Generates a runtime constraint for length `l` */
export const lengthConstraint: LengthConstraint =
  <L extends Length> (l: L) => {
    const max = lengthChars[l]
    return <P extends PRIM> (pc: PrimConstructor<P>, v: PRIM) =>
      (typeof v == 'string') && (v.length <= max) ? undefined :
      `${display(v)} is not assignable to '${pc.name}'.\n` +
      `  Length exceeds ${max}.`
  }
