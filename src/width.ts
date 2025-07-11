/** Copyright 2025 by Stijn de Witt, some rights reserved */
/**
 * The 16 fixed widths in this framework.
 *
 * Widths are further subdvided into 'low' widths (`0` through `7`) and 'high'
 * widths (`8` through `15`) for the purpose of selecting the most suitable
 * bit width for the application.
 *
 * Note that width `0` exists mostly for signaling purposes.
 *
 * @see {@link LowWidth}
 * @see {@link HighWidth}
 */
export type Width = LowWidth | HighWidth

/**
 * The low (fast!) {@link Width}s
 *
 * This type encapsulates the eight low widths that are guaranteed to be
 * both available and performant on all supported platforms.
 *
 * On the Javascript platform, selecting a low width will translate to `number`
 * in the underlying implementation. Sadly this list ends with `7` mapping to
 * `54`-bit integers, lacking the very common `64`-bit integers. We need
 * `bigint` for those. On native platforms implementations should easily be
 * able to offer very high performance for `64`-bit wide ints in addition to
 * the ones in this list, but to ensure optimal performance accross the board
 * you should limit yourself to the low int widths whenever possible.
 *
 * @see {@link HighWidth} for the widths that map to `bigint`
 * @see {@link Width} for the full list of widths
 */
export type LowWidth =   0 | 1 |  2 |  3 |  4 |  5 |  6 |  7

/**
 * The high (slow!) {@link Width}s
 *
 * This type encapsulates the eight high widths that are guaranteed to be
 * available on all supported platforms, but that might suffer performance loss
 * due to the operations having to be executed in software due to no or lacking
 * native hardware support.
 */
export type HighWidth =  8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

/** The widths in bits of the low widths */
export type LowWidthBits = readonly
  [  0,  8,  16,  24,  32,  40,  48,   54 ]

/** The widths in bits of the low widths */
export const lowWidthBits: LowWidthBits =
  [  0,  8,  16,  24,  32,  40,  48,   54 ]

/** The widths in bits of the high widths */
export type HighWidthBits = readonly
  [ 64, 96, 128, 160, 192, 256, 512, 4096 ]

/** The widths in bits of the high widths */
export const highWidthBits: HighWidthBits =
  [ 64, 96, 128, 160, 192, 256, 512, 4096 ]

export type WidthBitsArray = readonly
  [ ...LowWidthBits, ...HighWidthBits ]

/**
 * The number of bits corresponding to the abstract width `W`.
 *
 * ```ts
 * type X = WidthBits<2>
 * // type X = 16
 *
 * // or, use the named aliases:
 * type Y = WidthBits<_16bit>
 * // type Y = 16
 * ```
 *
 * @template W The abstract width of the number
 * @returns The actual width of the number in bits
 */
export type WidthBits<W extends Width> =
  WidthBitsArray[W]

export const widthBitsArray: WidthBitsArray =
  [ ...lowWidthBits, ...highWidthBits]

export const widthBits = <W extends Width> (w: W) =>
  widthBitsArray[w]

// aliases - low width
export type _0bit     =  0
export type _8bit     =  1
export type _16bit    =  2
export type _24bit    =  3
export type _32bit    =  4
export type _40bit    =  5
export type _48bit    =  6
export type _54bit    =  7
// aliases - high width
export type _64bit    =  8
export type _96bit    =  9
export type _128bit   = 10
export type _160bit   = 11
export type _192bit   = 12
export type _256bit   = 13
export type _512bit   = 14
export type _4Kbit    = 15

/**
 * Cross-platform way to specify the platform-native int widths
 *
 * This specification requires that implementors include *at least* the
 * `LowWidth` range in here as that represents the protocol-native common
 * denominator. Implementors are free to add additional widths from the
 * `HighWidth` here as well though, expanding the list of widths advertised as
 * natively supported.
 *
 * Implementors are encouraged to make this type the primary way to advertise
 * the various widths using the most efficient native underlying type at their
 * disposal. At the same time, the protocol will gossip statistics about the
 * capabilities of the hosting peers to help inform the evolution of the
 * protocol.
 *
 * **warning: platform-specific** Be advised that since this list of widths
 * will vary between platforms, making choices based on it will run the risk
 * of creating incompatibilities. Prefer `LowWidth` for decision-making.
 * That will always specify the same widths on all platforms. This type is
 * mostly intended to ease porting the interface to other platforms
 */
export type NativeWidth = LowWidth

// platform-specific types

/**
 * Platform-specific type that encapsulates the Javascript platform-specific
 * sub-range of `Width` that can be mapped directly to `number` in the
 * underlying implementation.
 *
 * This is actually just an alias for the cross-platform `NativeWidth`, but
 * with the intention to cover the range of widths that fit in a Javascript
 * `number`, which in this case is the only native type available so in this
 * case they are by definition the same. Now in the language sense, `bigint` is
 * 'native', but in the hardware/platform sense, `bigint` is a complicated,
 * variable size big number that is very unlike the traditional `byte`, `word`,
 * `int`, `long`, to name a few, 'hardware-native` sizes. C even re-maps the
 * size of its types based on the hardware target. In most languages big
 * numbers are either implemented in userland or only added somewhere late in
 * the evolution of the language. We turn this around, standardizing on a
 * logically defined varied set of sizes, split into the low half that we know
 * to be commonly available native in hardware and to the client code and the
 * high half where native support *might* be there, or is even likely to be
 * there, but is not *guaranteed* to be there.
 *
 * **warning: platform-dependant** To avoid making your code platform-
 * dependant, avoid importing and using this type. Use `LowWidth` or a
 * custom range of widths instead.
 *
 * @see {@link LowWidth} for the cross-platform low range
 * @see {@link BigIntWidth} for the platform-specific high range
 */
export type NumberWidth = LowWidth

/**
 * Platform-specific type that encapsulates the Javascript platform-specific
 * sub-range of `Width` that can be mapped directly to `bigint` in the
 * underlying implementation.
 *
 * This is actually just an alias for the cross-platform `HighWidth` range,
 * but with the intention to cover the range of widths that fit in a Javascript
 * `bigint`. We could have written a custom range as well. But this also allows
 * us to explain that `HighWidth` was chosen in such a way that the Javascript
 * platform would not be left behind by developers selecting `64`-bit widths
 * without understanding the possible consequences. Now you do!
 *
 * **warning: platform-dependant** To avoid making your code platform-
 * dependant, avoid importing and using this type. Use `HighWidth` or a custom
 * range of widths instead.
 *
 * @see {@link HighWidth} for the cross-platform high range
 * @see {@link NumberWidth} for the platform-specific low range
 */
export type BigIntWidth = HighWidth
