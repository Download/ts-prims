import type { PRIM, prim, PrimType } from './prim.js'
import type { text } from './text.js'

import { Prim } from './prim.js'
import { Text } from './text.js'

/**
 * The base prim type for text with a maximum length of 65535 chars (64KiB)
 */
export type memo = prim<text>

/**
 * The prim type constructor function for `memo`
 */
export const Memo: PrimType<memo> = Prim<memo>({
  prim: 'string',
  parent: Text,
  options: { max: 65535 },
  is: (v: PRIM): v is prim<memo> => Text.is(v) && v.length <= 65535,
  as: (v: PRIM): asserts v is prim<memo> => {
    if (! Memo.is(v)) throw new TypeError(`${v} is not memo, length exceeds 65535`)
  },
})
