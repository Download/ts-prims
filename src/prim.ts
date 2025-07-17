/**
 * A primitive is either a `boolean`, a `string`, a `number` or a `bigint`
 */
export type PRIM = boolean | string | number | bigint

/**
 * Defines a primitive type extending `P`.
 *
 * Generic type `prim` accepts a primitive type `P` and returns a tagged
 * intersection with a tag `supertype` that encapsulates the type hierarchy:
 *
 * ```ts
 * import { type prim } from 'ts-prims'
 *
 * // int 'extends' number
 * type int = prim<number>
 * // type int = number & supertype<number>
 *
 * // `byte` 'extends' `int`
 * type byte = prim<int>
 * // type byte = number & supertype<number> & supertype<int>
 * ```
 *
 * Because of the `supertype` tag, the compiler understands that `byte` is a
 * subtype of `int` and can be safely assigned to `int`, but that the reverse
 * is not true:
 *
 * ```ts
 * let i: int = 1000 as int
 * let b: byte = 100 as byte
 * i = b // ok
 * b = i // error
 * // Type 'int' is not assignable to type 'byte'.
 * ```
 *
 * `prim` accepts a second type parameter `C` that can be used to add other
 * constraints to the primitive type. For example, we can add a constraint
 * on the width of the number:
 *
 * ```ts
 * import { type prim, width } from 'ts-prims'
 *
 * type byte = prim<number, width<1>>
 * type int = prim<number, width<4>>
 * let i: int = 1000 as int
 * let b: byte = 100 as byte
 * i = b // ok
 * b = i // error
 * // Type 'int' is not assignable to type 'byte'.
 * ```
 *
 * Note that in the above code, both `byte` and `int` 'extend' `number` and
 * without any further constraints, they would be assignable to one another.
 * The `width` constraint we added effectively makes `byte` a subtype of `int`
 * even though they are both extensions of `number`.
 *
 * These checks are performed at compile time, but can also be enforced
 * at runtime using the `Prim` constructor function.
 *
 * > In this library, I have attempted to include constraints that have both
 * > a compile-time and a runtime component. For `width` (compile-time) there
 * > is `widthConstraint` (runtime), for `length` (compile-time) there is
 * > `lengthConstraint` (runtime), for `chars` (compile-time) there is
 * > `charsConstraint` (runtime) etc. However, not all constraints are
 * > expressable in a form that TypeScript can understand, so some constraints
 * > will only have runtime components, like `isInteger` (runtime) or something
 * > like `isEmail` for example.
 *
 * @template P The parent type, e.g. `string`
 * @template C Constraints for this type
 *
 * @see {@link Prim} for the constructor function
 * @see {@link width} for the width constraint
 * @see {@link int} for the low-width (fast) integer types
 * @see {@link Constraint} for the constraint type
 */
export type prim<P extends PRIM, C = {}> = P & supertype<P> & C

/**
 * Supertype constraint for a primitive type `P`
 *
 * Factoring out the constraint into its own type makes the resulting
 * type more readable:
 *
 * ```ts
 * type int = number & {
 *   supertype: Constructor<number>;
 * }
 * ```
 * vs
 *
 * ```ts
 * type int = number & supertype<number>
 * ```
 */
export type supertype<P extends PRIM> =
  { supertype: Constructor<P> }

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
 * A constraint on a type differentiates the subtype from the supertype.
 *
 * For example, an `isInteger` constraint differentiates integer numbers from
 * real numbers.
 *
 * A constraint is expressed as a function that accepts a prim constructor and
 * a value and returns `undefined` if the value satisfies the constraint, or
 * a `string` with an error message otherwise.
 *
 * For example, `isInteger` might look like this:
 *
 * ```ts
 * export const isInteger: Constraint =
 *   <P extends PRIM> (pc: PrimConstructor<P>, v: PRIM) =>
 *   (typeof v == 'number') && Number.isInteger(v) ? undefined :
 *   `${display(v)} is not assignable to type '${pc.name}'.\n` +
 *   `  Not an integer.`
 * ```
 *
 * Being able to define constraints separately from the constructor, and making
 * them first class citizens in the runtime type implementation makes it easier
 * to reuse implementations like `isInteger` throughout the codebase.
 *
 * @see {@link}
 */
export type Constraint =
  <P extends PRIM> (pc: PrimConstructor<P>, v: PRIM) =>
  string | undefined


/**
 * Returns a 'display value' string for `v`.
 *
 * In case `v` is of type `string`, the returned string will be `v` within
 * double quotes. Otherwise it will return the result of the built-in to-string
 * happening naturally when appending primitives to strings in Javascript.
 *
 * ```ts
 * display('Hello, World!') // '"Hello, World"'
 * display(2 + 5) // '7'
 * ```
 *
 * @param v The primitive-typed value
 * @returns The display value string of `v`
 */
export const display =
  (v: PRIM) =>
  typeof v == 'string' ?
  `"${v}"` :
  `${v}`

/**
 * Constraint that the primitive type of two types must be equal for them to be
 * assignable to one another. This constraint is implied in the type system and
 * made explicit in the runtime implementation through this object.
 */
export const superConstraint: Constraint =
  <P extends PRIM> (pc: PrimConstructor<P>, v: PRIM) =>
  typeof v == primTypeOf(pc) ? undefined :
  `${display(v)} is not assignable to type '${pc.name}'.\n` +
  `  Supertypes do not match: ${typeof v}, ${primTypeOf(pc)}.`

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
  constraints: Constraint[]
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
 * @param name The name of the primitive type, e.g. `'int'`
 * @param pc The super constructor function, e.g. `Number`
 * @param constraints Optional constraints for the primitive type. Any
 *        constraints from the super constructor will be used
 *        automatrically and should not be passed in here again.
 * @see {@link Prim}
 */
export type PrimFactory =
  <P extends PRIM> (
    name: string,
    pc: SuperConstructor<P>,
    constraints: Constraint | Constraint[]
  ) => PrimConstructor<P>

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
  'super' in pc ? primTypeOf(pc.super) :
  pc === Boolean ? 'boolean' :
  pc === String ? 'string' :
  pc === Number ? 'number' :
  'bigint'

/** Gets the constraints associated with the constructor `pc` */
export const constraintsOf =
  <P extends PRIM> (pc: Constructor<P>): Constraint[] =>
    'super' in pc ? pc.constraints : [ superConstraint ]

/**
 * Creates a constructor function for a primitive type extending `P`.
 *
 * Whenever your type requires runtime presence, the `Prim` function can be
 * used to create a constructor function for your primitive type, following
 * the same pattern:
 *
 * ```ts
 * import { type prim, type width, Prim, widthConstraint } from 'ts-prims'
 * // use the `width` type to constrain the width of `byte`
 * type byte = prim<number, width<1>>
 * // use the `widthConstraint` to constrain the width at runtime
 * const Byte = Prim<byte>('byte', Number, widthConstraint(1))
 * let x: byte = Byte(100) // ok
 * let y: byte = Byte(1000) // runtime error
 * // TypeError: 1000 is not assignable to 'byte': -128 .. 127
 * ```
 *
 * @template P The primitive type
 *
 * @param name The name for the type, e.g. `int`
 * @param pc The parent constructor function, e.g. `Int` or `Number`
 * @param constraints Optional constraints for the primitive type. Any
 *   constraints from the super constructor will be used automatically
 *   and should not be passed in here again.
 *
 * @see {@link PrimFactory}
 * @see {@link PrimConstructor}
 * @see {@link NativeConstructor}
 * @see {@link Constraint}
 */
export const Prim: PrimFactory = <P extends PRIM> (
  name: string,
  pc: SuperConstructor<P>,
  constraints: Constraint | Constraint[] = []
): PrimConstructor<P> => {
  const result: PrimConstructor<P> =
    ({ [name]: (v: PRIM) => result.to(v) })[name] as PrimConstructor<P>
  result.super = pc
  constraints =
    Array.isArray(constraints) ? constraints :
    constraints ? [constraints] : []
  result.constraints = [ ...constraintsOf(pc), ...constraints ]
  result.is = (v: PRIM): v is P => {
    for (let constraint of result.constraints) {
      const err = constraint(result, v)
      if (err) return false
    }
    return true
  }
  result.as = (v: PRIM): asserts v is P => {
    for (let constraint of result.constraints) {
      const err = constraint(result, v)
      if (err) throw new TypeError(err)
    }
  }
  result.to = (v) => { result.as(v); return v }
  return result
}
