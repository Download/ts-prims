import type { PRIM, prim, PrimType } from './prim.js'
import { Prim } from './prim.js'

/**
 * The base prim type for text with an unbounded length
 */
export type text = prim<string>

/**
 * The prim type constructor function for `text`
 */
export const Text: PrimType<text> = Prim<text>({
  prim: 'string',
  as: (v: PRIM): asserts v is prim<text> => {
    if (! Text.is(v)) throw new TypeError(`${v} is not text`)
  }
})
