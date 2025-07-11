/** Copyright 2025 by Stijn de Witt, some rights reserved */

/**
 * A primitive is either a `boolean`, a `string`, a `number` or a `bigint`
 */
export type PRIM = boolean | string | number | bigint

/**
 * Defines a primitive type descending from `P`.
 *
 * Generic type `prim` accepts a primitive type `P` and returns a tagged
 * intersection type with a tag `constructor`:
 *
 * ```ts
 * import { type prim } from 'ts-prims'
 *
 * // int 'extends' number
 * type int = prim<number>
 * // type int = number & {
 * //     constructor: Constructor<number>;
 * // }
 * ```
 *
 * @template P The parent type, e.g. `string`
 * @template C Constraints for this type
 *
 * `P` must extend `PRIM` (boolean, string, number or bigint)
 */
export type prim<P extends PRIM, C = {}> =
  P & { constructor: Constructor<P> } & C

/**
 * A type guard function that checks whether `v is P`
 *
 * @template P The primitive type to check against
 *
 * @param v The primitive value to check against `P`
 * @returns `true` if `v is P`, `false` otherwise
 */
export type IsPrim<P extends PRIM> = (v: PRIM) => v is P

/**
 * A type assertion function that asserts that `v is P`.
 *
 * @template P The primitive type to check against
 * @param v The primitive value to check against `P`
 * @throws `TypeError` if `v is P` is not `true`.
 */
export type AsPrim<P extends PRIM> = (v: PRIM) => asserts v is P

/**
 * A type conversion function that converts `v` to `P`.
 *
 * @template P The primitive type to convert to
 * @param v The primitive value to convert
 * @returns `v`, converted to `P`
 * @throws `TypeError` if `v is P` is not `true`.
 */
export type ToPrim<P extends PRIM> = (v: PRIM) => P

/**
 * Run-Time Type Information for the primitive type `P`
 *
 * ```ts
 * import { type prim, Prim } from 'ts-prims'
 *
 * type int = prim<number>
 * const Int = Prim<int>('int', Number)
 * ```
 *
 * `Int` will have properties `name`, `super`, `is`, `as`, `to`, which are
 * inspectable and usable at runtime.
 *
 * @template P The primitive type
 *
 * @field name The name of the primitive type, e.g. `'int'`
 * @field super The super constructor, e.g. `Number`
 * @field to The `ToPrim` converter function
 * @field is The `IsPrim` guard function
 * @field as The `AsPrim` assertion function
 *
 * @see {@link SuperConstructor}
 * @see {@link ToPrim}
 * @see {@link IsPrim}
 * @see {@link AsPrim}
 */
export type Rtti<P extends PRIM> = {
  name: string
  super: SuperConstructor<P>
  to: ToPrim<P>
  is: IsPrim<P>
  as: AsPrim<P>
}

/**
 * A `Constructor`, in the context of `ts-prims` is a function that validates/
 * converts a value to a primitive type. We distinguish between user-defined
 * `PrimConstructor`s and built-in `NativeConstructor`s.
 *
 * @template P The primitive type
 *
 * @see {@link PrimConstructor}
 * @see {@link NativeConstructor}
 */
export type Constructor<P extends PRIM> =
  PrimConstructor<P> | NativeConstructor<P>

/**
 * The user-defined constructor for the primitive type `P` is a
 * combination of a `ToPrim` conversion function and `Rtti`.
 *
 * @template P The primitive type
 *
 * @see {@link ToPrim}
 * @see {@link Rtti}
 */
export type PrimConstructor<P extends PRIM> =
  ToPrim<P> & Rtti<P>

/**
 * The super constructor for a given prim type `P` is a `Constructor`
 * for the `PrimTypeOf<P>`.
 *
 * @template P The primitive type
 *
 * @see {@link Constructor}
 * @see {@link PrimTypeOf}
 */
export type SuperConstructor<P extends PRIM> =
  Constructor<PrimTypeOf<P>>


/**
 * The native (built-in) constructor for a given primitive type `P`.
 *
 * @template P The prim type
 * @returns `BooleanConstructor | StringConstructor
 *           | NumberConstructor | BigIntConstructor`
 */
export type NativeConstructor<P extends PRIM> =
  P extends boolean ? BooleanConstructor :
  P extends string ? StringConstructor :
  P extends number ? NumberConstructor :
  BigIntConstructor


/**
 * A prim factory creates user-defined constructor functions for
 * user-defined primitive types.
 *
 * @template P The primitive type
 *
 * @see {@link Prim}
 */
export type PrimFactory =
  <P extends PRIM> (
    name: string,
    pc: SuperConstructor<P>,
    rtti?: Partial<Rtti<P>
  >) => PrimConstructor<P>

/**
 * Checks whether the given prim constructor function `pc` has a `super`
 * constructor associated with it. This is true for all constructor functions
 * created by `Prim`, but not for the native constructor functions.
 *
 * @template P The primitive type
 * @param pc The prim constructor to check
 * @returns `true` if `pc is PrimConstructor<P>`, `false` otherwise
 */
export type HasSuper =
  <P extends PRIM> (pc: Constructor<P>) =>
  pc is PrimConstructor<P>

/**
 * Returns the associated `super` constructor function, if any.
 *
 * @template P The primitive type
 * @param pc The prim constructor
 * @returns The `super` constructor, or `undefined`
 */
export type GetSuper =
  <P extends PRIM> (pc: Constructor<P>) =>
  SuperConstructor<P> | undefined

/**
 * Checks whether the given prim constructor function `pc` has a `super`
 * constructor associated with it. This is true for all constructor functions
 * created by `Prim`, but not for the native constructor functions.
 *
 * @template P The primitive type
 * @param pc The prim constructor to check
 * @returns `true` if `pc is PrimConstructor<P>`, `false` otherwise
 */
export const hasSuper: HasSuper =
  <P extends PRIM> (pc: Constructor<P>):
  pc is PrimConstructor<P> =>
  'super' in pc ? true : false

/**
 * Returns the associated `super` constructor function, if any.
 *
 * @template P The primitive type
 * @param pc The prim constructor
 * @returns The `super` constructor, or `undefined`
 */
export const getSuper: GetSuper =
  <P extends PRIM> (pc: Constructor<P>):
  SuperConstructor<P> | undefined =>
  hasSuper(pc) ? pc.super : undefined

/**
 * The prim type of a given prim `P` is the underlying primitive type,
 * e.g. `number` for `int32`, `bigint` for `big64`, `string`
 * for `memo` etc.
 */
export type PrimTypeOf<P extends PRIM> =
  P extends boolean ? boolean :
  P extends string ? string :
  P extends number ? number :
  bigint

/**
 * Returns the underlying type of the given constructor function `pc`.
 *
 * This is basically a version of `typeof` that operates, not directly on the
 * values, but on the constructor function itself.
 *
 * @template P The primitive type
 * @param pc The prim constructor
 * @returns The underlying type of `pc`: `'boolean'`, `'string'`,
 *          `'number'` or `'bigint'`.
 */
export const primTypeOf =
  <P extends PRIM> (pc: Constructor<P>): string =>
  hasSuper(pc) ? primTypeOf(pc.super) :
  pc === Boolean ? 'boolean' :
  pc === String ? 'string' :
  pc === Number ? 'number' :
  'bigint'

/**
 * Creates a constructor function for a primitive type extending `P`.
 *
 * ```ts
 * import { type prim } from 'ts-prims'
 *
 * // create a type `int` that 'extends' `number`
 * type int = prim<number>
 * // type int = number & {
 * //     constructor: Constructor<number>;
 * // }
 * ```
 *
 * @template P The primitive type
 *
 * @param name The name for the type, e.g. `int`
 * @param pc The parent constructor function, e.g. `Int` or `Number`
 * @param rtti Run-time type information
 *
 * @see {@link PrimFactory}
 * @see {@link PrimConstructor}
 * @see {@link NativeConstructor}
 * @see {@link Rtti}
 */
export const Prim: PrimFactory = <P extends PRIM> (
  name: string,
  pc: SuperConstructor<P>,
  rtti: Partial<Rtti<P>> = {}
): PrimConstructor<P> => {
  const parent = getSuper(pc)
  const val = (v: PRIM) => typeof v == 'string' ? `"${v}"` : `${v}`
  const err = (v: PRIM) => `${val(v)} is not of type '${name}'`
  const is = rtti.is || (parent && hasSuper(parent) && parent.is)  ||
    ((v: PRIM): v is P => typeof v == primTypeOf(pc))
  const as: (v: PRIM) => asserts v is P = rtti.as || ((v): asserts v is P => {
    if (! is(v)) throw new TypeError(err(v))
  })
  const to = rtti.to || ((v) => { as(v); return v })
  const result = ({ [name]: (v: PRIM) => to(v) })[name] as PrimConstructor<P>
  result.super = pc
  result.is = is as IsPrim<P>
  result.as = as
  result.to = to
  return result
}
