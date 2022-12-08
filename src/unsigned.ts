import type { PrimType } from './prim.js'
import type { LessThanEqual } from './range.js'
import type { integer } from './integer.js'
import { Integer } from './integer.js'

/**
 * The base type for unsigned integer numbers
 */
 export type unsigned <N extends LessThanEqual<52> = 52> = integer<N, 'unsigned'>

 /**
 * The prim type constructor function for `uint`
 */
export const Unsigned = <BITS extends LessThanEqual<52> = 52> (
    bits: BITS = 52 as BITS,
): PrimType<unsigned<BITS>> => Integer(bits, 'unsigned') as PrimType<unsigned<BITS>>

export type uint52 = unsigned<52>
export const Uint52 = Unsigned(52)

export type uint32 = unsigned<32>
export const Uint32 = Unsigned(32)

export type uint16 = unsigned<16>
export const Uint16 = Unsigned(16)

export type uint8 = unsigned<8>
export const Uint8 = Unsigned(8)

export type ulong = uint52
export const Ulong = Uint52

export type uint = uint32
export const Uint = Uint32

export type byte = uint8
export const Byte = Uint8

