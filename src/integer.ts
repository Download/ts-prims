import type { prim, PRIM, PrimType } from './prim.js'
import type { LessThanEqual } from './range.js'
import type { numeric, Signed } from './numeric.js'
import { Prim } from './prim.js'
import { Numeric } from './numeric.js'

/**
 * The base prim type for integer numbers
 */
export type integer <BITS extends LessThanEqual<53> = 53, S extends Signed = Signed> = prim<numeric<BITS,'integer',S>>

/**
 * The prim type constructor function for `integer`
  */
export const Integer = <BITS extends LessThanEqual<53> = 53, S extends Signed = Signed> (
    bits: BITS = 64 as BITS,
    s: S = 'signed' as S,
): PrimType<integer<BITS,S>> => {
    const max = Math.pow(2, bits - (s == 'signed' ? 1 : 0))
    const min = s == 'signed' ? 0 - Math.pow(2, bits - 1) : 0
    return Prim<integer<BITS,S>>({
        prim: 'number',
        parent: Numeric(bits, 'integer', s),
        options: { bits, family: 'integer', signed: s, min, max },
        is: (v: PRIM): v is prim<integer<BITS,S>> => (v >= min) && (v < max),
        as: (v: PRIM): asserts v is prim<integer<BITS,S>> => {
            if (! Integer(bits,s).is(v))
                throw new TypeError(`${v} is not integer<${bits}${s == 'unsigned' ? `,${s}` : ''}>`)
    }
    }) as PrimType<integer<BITS,S>>
}

/**
 * 53 bits signed integer
 */
export type int53 = integer<53>
export const Int53 = Integer(53)

/**
 * 32 bits signed integer
 */
export type int32 = integer<32>
export const Int32 = Integer(32)

/**
 * 16 bits signed integer
 */
export type int16 = integer<16>
export const Int16 = Integer(16)

/**
 * 8 bits signed integer
 */
export type int8 = integer<8>
export const Int8 = Integer(8)

/**
 * 53 bits signed integer
 */
export type long = int53
export const Long = Int53

/**
 * 32 bits signed integer
 */
export type int = int32
export const Int = Int32
