import type { prim, PRIM, PrimType } from './prim.js'
import type { LessThanEqual } from './range.js'
import type { numeric, Signed } from './numeric.js'
import { Prim } from './prim.js'
import { Numeric } from './numeric.js'

/**
 * The base type for floating point real numbers
 */
export type real <BITS extends LessThanEqual<64> = 64, SIGNED extends Signed = Signed> = prim<numeric<BITS, 'real', SIGNED>>

/**
 * The prim type constructor function for `integer`
  */
export const Real = <BITS extends LessThanEqual<64> = 64, S extends Signed = Signed> (
    bits: BITS = 64 as BITS,
    signed: S = 'signed' as S,
): PrimType<real<BITS,S>> => Prim<real<BITS,S>>({
    prim: 'number',
    parent: Numeric(bits, 'real', signed),
    options: { bits, family: 'real', signed },
    as: (v: PRIM): asserts v is prim<real<BITS,S>> => {
        if (! Real(bits,signed).is(v)) throw new TypeError(`${v} is not real<${bits}${signed == 'unsigned' ? `,unsigned` : ''}>`)
    }
}) as PrimType<real<BITS,S>>

export type float64 = real<64>
export const Float64 = Real(64)

export type float32 = real<32>
export const Float32 = Real(32)

export type double = float64
export const Double = Float64

export type float = float32
export const Float = Float32
