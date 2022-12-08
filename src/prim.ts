// PRIM - primitive types extending boolean, number or string

/**
 * A primitive that is either a `boolean`, a `number` or a `string`
 */
export type PRIM = boolean | number | string

/**
 * A primitive type descending from `P`
 *
 * `P` must descend from `PRIM` (boolean, number or string)
 */
export type prim<P extends PRIM> = P & { parent: P }

// the prim of a prim is the base type: 'boolean', 'number' or 'string'
export type PrimOf<P extends PRIM> = P extends boolean ? 'boolean' : P extends number ? 'number' : 'string'
// the current prim type's `parent` property, or null
export type PrimParent<P extends PRIM> = P extends prim<PRIM> ? P['parent'] : null

// runtime code guards, assertions and conversions from the base type
export type PrimGuard<P extends PRIM> = (v: PRIM) => v is prim<P>
export type PrimAssertion<P extends PRIM> = (v: PRIM) => asserts v is prim<P>
export type PrimConversion<P extends PRIM> = (v: PRIM) => prim<P>

/**
 * RunTime Type Information for the prim type
 */
export type Rtti<P extends PRIM> = {
    prim: PrimOf<P>
    parent?: ParentType<P>
    options?: object
    is?: PrimGuard<P>
    as?: (v: PRIM) => void // PrimAssertion<P>
    to?: PrimConversion<P>
}

/**
 * The runtime type for a prim type is a conversion function with runtime type
 * info and guards and assertions for runtime type checking.
 */
export type PrimType<P extends PRIM> = PrimConversion<P> & Rtti<P> & {
    is: PrimGuard<P>
    as: PrimAssertion<P>
    to: PrimConversion<P>
}

// the parent runtime type for a prim
export type ParentType<P extends PRIM> =
    PrimParent<P> extends PRIM ? PrimType<PrimParent<P>> : null

// tests whether `v is Prim<P>` by comparing `v` to the base type `boolean`, `number` or 'string'
export const isPrimOf = <P extends PRIM> (rtti: Rtti<P>): PrimGuard<P> =>
    (v: PRIM): v is prim<P> => typeof v === rtti.prim

// asserts that `v is Prim<P>` using `isPrimOf`, throwing a `TypeError` otherwise
export const asPrimOf = <P extends PRIM> (rtti: Rtti<P>): PrimAssertion<P> => {
    const ok = isPrimOf(rtti)
    return (v: PRIM): asserts v is prim<P> => {
      if (!ok(v)) throw new TypeError (
        `${typeof v === rtti.prim ? `"${v}"` : v} is not a ${rtti.prim}`
      )
    }
}

// accepts runtime type info and returns a guard function that tests whether
// `v is Prim<P>` using `isPrimOf` and any custom type guard given in `rtti.is`
export const isPrim = <P extends PRIM> (rtti: Rtti<P>): PrimGuard<P> => {
    const ok = rtti.parent ? rtti.parent.is : isPrimOf(rtti)
    return (v: PRIM): v is prim<P> => ok(v) && (!rtti.is || rtti.is(v))
}

// accepts runtime type info and returns an assertion function that test the
// given `v` using `isPrimOf` and any custom assertion given in `rtti.as`
export const asPrim = <P extends PRIM> (rtti: Rtti<P>): PrimAssertion<P> => {
    const check: PrimAssertion<P> = rtti.parent ? rtti.parent.as : asPrimOf(rtti)
    return (v: PRIM): asserts v is prim<P> => {
        check(v)
        rtti.as && rtti.as(v)
    }
}

// accepts runtime type info and returns a conversion function that
// checks that `v is Prim<P>` using `asPrim` and then returns the
// converted value or throws a `TypeError`.
export const toPrim = <P extends PRIM> (rtti: Rtti<P>): PrimConversion<P> => {
    const checkPrim: PrimAssertion<P> = asPrim(rtti)
    return (v: PRIM): prim<P> => {
        checkPrim(v)
        return v
    }
}

/**
 * Constructs the runtime type for a prim type
 *
 * Use the typescript type as the parameter to this function when calling it
 * and pass the runtime type info needed to implement your primitive type.
 *
 * @param rtti RunTime Type Information
 * @returns A prim type constructor function
 */
export const Prim = <P extends PRIM> (rtti: Rtti<P>): PrimType<P> => {
    const result = toPrim(rtti) as PrimType<P>
    result.prim = rtti.prim as PrimOf<P>
    result.parent = rtti.parent
    result.is = isPrim(rtti)
    result.as = asPrim(rtti)
    result.to = toPrim(rtti)
    result.options = rtti.options
    return result
}
