/** Copyright 2025 by Stijn de Witt, some rights reserved */

/**
 * The union of all positive numbers from `0` up to,
 * but not including, `N`.
 *
 * `N` must be small since this type uses recursion to
 * generate a union type.
 *
 * You should use type `Lt` in place of this one, which forces
 * a safe limit on type parameter `N`.
 *
 * ```ts
 * type lt8 = Lt<8>
 * // type lt8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
 * ```
 *
 * @param N The (small) positive integer number literal
 * @returns All positive integer numbers less than `N`
 *
 * @see {@link Lt} for the recommended, safe version
 */
export type _Lt <N extends number, A extends number[] = []> =
    N extends A['length'] ? A[number] :
    _Lt<N, [A['length'], ...A]>

/**
 * The union of all positive integers **L**ess **T**han `N`.
 *
 * Returns the union of all positive integers from `0` up to, but not
 * including, `N`. Safe version.
 *
 * ```ts
 * type lt8 = Lt<8>
 * // type lt8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
 * ```
 *
 * This type is limited to only accept small numbers for its `N` parameter.
 * This makes this type safe to use. Below the surface it is delegating to
 * `_Lt`, the unrestricted (and therefore 'unsafe') version of this type
 * that actually performs recursion to determine the range of values.
 *
 * @param N The positive integer literal
 * @returns All positive integers less than `N`
 *
 * @see {@link Lte} if you need an end-inclusive range
 * @see {@link _Lt} for the unsafe version
 */
export type Lt <N extends _Lt<256> | 256> = _Lt<N>

/**
 * The union of all positive integers **L**ess **T**han or
 * **E**qual to `N`.
 *
 * Returns the union of all positive integers from `0` up to and
 * including, `N`.
 *
 * ```ts
 * type Lte7 = Lte<7>
 * // type Lte7 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
 * ```
 *
 * @param N The positive number literal
 * @returns All positive numbers less than or equal to `N`
 *
 * @see {@link Lt} if you need an end-exclusive range
 */
export type Lte<N extends _Lt<256> | 256> = Lt<N> | N
