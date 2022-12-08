import type { PRIM, prim, PrimType } from './prim.js'
import type { LessThanEqual } from './range.js'
import { Prim } from './prim.js'

export type Family = 'real' | 'integer'
export type Signed = 'signed' | 'unsigned'

/**
 * The base prim type for all numeric types, extending `number`
 */
export type numeric<BITS extends LessThanEqual<64> = 64, F extends Family = Family, S extends Signed = Signed> = prim<number> & {
    bits: LessThanEqual<BITS>,
    family: F,
    signed: S,
}

 /**
 * The prim type constructor function for `numeric`
 */
 export const Numeric = <BITS extends LessThanEqual<64> = 64, F extends Family = Family, S extends Signed = Signed> (
    bits: BITS = 64 as BITS,
    family: F = 'real' as F,
    signed: S = 'signed' as S,
): PrimType<numeric<BITS,F,S>> => Prim<numeric<BITS,F,S>>({
    prim: 'number',
    options: { family, bits, signed },
    is: (v: PRIM): v is prim<numeric<BITS,F,S>> => {
        return (
            (family == 'real' || Number.isInteger(v)) &&
            (signed == 'signed' || v >= 0)
        )
    },
    as: (v: PRIM): asserts v is prim<numeric<BITS,F,S>> => {
        if (! Numeric(bits,family,signed).is(v)) throw new TypeError(`${v} is not numeric<${bits},${family},${signed}>`)
    }
}) as PrimType<numeric<BITS,F,S>>
