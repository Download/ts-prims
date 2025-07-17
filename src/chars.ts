import type { PRIM, Constraint, PrimConstructor } from './prim.js'
import { type ShortLength, type ShortLengthChars, shortLengthChars } from './length.js'
import { display } from './prim.js'
import { type Lte } from './util.js'

/**
 * Constrains a type to the given length in chars `L`.
 *
 * This type allows you to express the length constraint on a short string
 * with very high precision:
 *
 * ```ts
 * import type { prim, chars } from 'ts-prims'
 *
 * type article_tite = prim<string, chars<64>>
 * type zipcode = prim<string, chars<5>>
 * let zip: zipcode = '90210' as zipcode // ok
 * let title = 'Hello World!' as article_tite // ok
 * title = zip // ok
 * zip = title // error
 * // Type 'article_tite' is not assignable to type 'zipcode'.
 * ```
 *
 * Use this type in combination with `charsConstraint` for runtime presence:
 *
 * ```ts
 * import type { prim, chars, Chars } from 'ts-prims'
 * import { Prim, charsConstraint } from 'ts-prims'
 *
 * // a varchar with a length in chars `L`
 * type varchar<L extends Chars> = prim<string, chars<L>>
 * // the prim type constructor function for `varchar<L>`
 * const Varchar = <L extends Chars>(l: L) => Prim<varchar<L>>(
 *   `varchar<${l}>`, String, charsConstraint(l)
 * )
 *
 * // you can now define varchars with length <= 256 chars:
 * type zipcode = varchar<5>
 * const Zipcode = Varchar(5)
 * let zip: zipcode = Zipcode('90210') // ok
 * let oops: zipcode = Zipcode('Too long!') // runtime error
 * // TypeError: "Too long!" is not assignable to 'varchar<5>'.
 * //   Length exceeds 5.
 * ```
 */
export type chars<L extends Chars> = {
  length: Lte<LengthOf<L>>,
  chars: L extends Lte<ShortLengthChars[1]> ? Lte<L> : Lte<ShortLengthChars[1]>
}

/**
 * The available `LowLength`s expressed in chars, plus the first low length
 * subdivided into `65` individual char lengths (`0`..`64`).
 *
 * This type allows you to express the maximum length of a low-length string
 * with very high precision:
 *
 * ```ts
 * import type { prim, chars, Chars } from 'ts-prims'
 * import { Prim, charsConstraint } from 'ts-prims'
 *
 * // a varchar with a length in chars `L`
 * type varchar<L extends Chars> = prim<string, chars<L>>
 * // the prim type constructor function for `varchar<L>`
 * const Varchar = <L extends Chars>(l: L) => Prim<varchar<L>>(
 *   `varchar<${l}>`, String, charsConstraint(l)
 * )
 *
 * // you can now define varchars with length <= 256 chars:
 * type zipcode = varchar<5>
 * const Zipcode = Varchar(5)
 * let zip: zipcode = Zipcode('90210') // ok
 * let oops: zipcode = Zipcode('Too long!') // runtime error
 * // TypeError: "Too long!" is not assignable to 'varchar<5>'.
 * //   Length exceeds 5.
 * ```
 *
 * @see {@link chars} constraint of maximum length in `L` chars
 * @see {@link ShortLength} for the low lengths
 * @see {@link ShortLengthChars} for the low lengths in chars
 */
export type Chars = Lte<ShortLengthChars[1]> | ShortLengthChars[ShortLength]

/** Utility type to convert a low length `L` in chars back to a `LowLength`. */
export type LengthOf<L extends Chars> =
  L extends 0 ? 0 :
  L extends Lte<ShortLengthChars[1]> ? 1 :
  L extends ShortLengthChars[2] ? 2 :
  L extends ShortLengthChars[3] ? 3 :
  L extends ShortLengthChars[4] ? 4 :
  L extends ShortLengthChars[5] ? 5 :
  L extends ShortLengthChars[6] ? 6 :
  7

/** Utility function to convert a low length `l` in chars back to a `LowLength`. */
export const lengthOf = <L extends Chars> (l: L) =>
  l == 0 ? 0 :
  l <= shortLengthChars[1] ? 1 :
  l == shortLengthChars[2] ? 2 :
  l == shortLengthChars[3] ? 3 :
  l == shortLengthChars[4] ? 4 :
  l == shortLengthChars[5] ? 5 :
  l == shortLengthChars[6] ? 6 :
  7

/** Utility type to constrain a type to the given length in chars `L`. */
export type CharsConstraint =
  <L extends Chars> (l: L) =>
  Constraint

/** Constrains a type to the given length in chars `L`. */
export const charsConstraint: CharsConstraint =
  <L extends Chars> (l: L) => {
    console.info(`charsConstraint(${l})`)
    return <P extends PRIM> (pc: PrimConstructor<P>, v: PRIM) => {
      console.info(`charsConstraint(${l}):`, v)
      return (typeof v == 'string') && (v.length <= l) ? undefined :
        `${display(v)} is not assignable to '${pc.name}'.\n` +
        `  Length exceeds ${l}.`
    }
  }
