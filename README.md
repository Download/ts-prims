# ts-prims
**Primitives in Typescript**

Offers tooling for
[creating primitive types](#creating-primitive-types)
in Typescript, as well as some
[primitive types included](#primitive-types-included)
to start with.

## Table of Contents

- [ts-prims](#ts-prims)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Install](#install)
    - [Import](#import)
    - [Use](#use)
  - [Creating primitive types](#creating-primitive-types)
    - [PRIM](#prim)
    - [prim type](#prim-type)
    - [Prim function](#prim-function)
    - [Helper types](#helper-types)
      - [Constructor](#constructor)
      - [PrimConstructor](#primconstructor)
      - [NativeConstructor](#nativeconstructor)
      - [SuperConstructor](#superconstructor)
      - [ToPrim](#toprim)
      - [IsPrim](#isprim)
      - [AsPrim](#asprim)
      - [PrimTypeOf](#primtypeof)
      - [Rtti](#rtti)
      - [HasSuper](#hassuper)
      - [GetSuper](#getsuper)
      - [PrimFactory](#primfactory)
  - [Primitive types included](#primitive-types-included)
    - [Type hierarchy](#type-hierarchy)
    - [text](#text)
      - [`text` type](#text-type)
      - [`Text` constructor](#text-constructor)
      - [Text example](#text-example)
    - [memo](#memo)
      - [`memo` type](#memo-type)
      - [`Memo` constructor](#memo-constructor)
      - [Memo example](#memo-example)
    - [varchar](#varchar)
      - [`varchar` type](#varchar-type)
      - [`Varchar` constructor](#varchar-constructor)
      - [Varchar example](#varchar-example)
    - [varint](#varint)
      - [`varint` type](#varint-type)
      - [`Varint` constructor](#varint-constructor)
      - [Varint example](#varint-example)
    - [int](#int)
      - [`int` type](#int-type)
      - [`Int` constructor](#int-constructor)
      - [Int example](#int-example)
      - [int8](#int8)
      - [int16](#int16)
      - [int24](#int24)
      - [int32](#int32)
      - [int40](#int40)
      - [int48](#int48)
      - [int54](#int54)
    - [big](#big)
      - [`big` type](#big-type)
      - [`Big` constructor](#big-constructor)
      - [Big example](#big-example)
      - [big64](#big64)
      - [big96](#big96)
      - [big128](#big128)
      - [big160](#big160)
      - [big192](#big192)
      - [big256](#big256)
      - [big512](#big512)
      - [big4K](#big4k)
    - [Utility types](#utility-types)
      - [\_Lt](#_lt)
      - [Lt](#lt)
      - [Lte](#lte)
  - [Issues](#issues)
  - [Copyright](#copyright)
  - [License](#license)


## Getting started

### Install

```console
npm install ts-prims
```

### Import

```ts
import { type prim, Prim } from 'ts-prims'
```

### Use

Use type [`prim`](#prim-type) to create subtypes of primitives such as `number`:

```ts
import { type prim } from 'ts-prims'

type int = prim<number>
```

or even subtypes of subtypes of primitives... etcetera

```ts
import { type prim } from 'ts-prims'

type int = prim<number>
type byte = prim<int>
```

Use function [`Prim`](#prim-function) to create run-time present versions of the types, just like Javascript gives us `String` and `Number`:

```ts
import { type prim, Prim } from 'ts-prims'

type int = prim<number>
const Int = Prim('int', Number)

type byte = prim<int>
const Byte = Prim('byte', Int)
```

Use the types that come with `ts-prims` when interfacing with e.g databases:

```ts
import { type int32, type memo, type varchar } from 'ts-prims'

type Article = {
  id: int32,
  title: varchar<40>,
  abstract: varchar<256>,
  body: memo
}
```

## Creating primitive types

Using `PRIM` we limit parameters to be of primitive types. With `prim` we can
create custom primitive types and with `Prim` we can give these custom types
runtime presence in the form of constructor functions that mimic the built-in
native constructors `Boolean`, `String`, `Number` and `BigInt`.

### PRIM

A primitive is either a `boolean`, a `string`, a `number` or a `bigint`

```ts
export type PRIM = boolean | string | number | bigint
```

We mainly use this type to limit the temlate parameters' types:

```ts
type MyType<P extends PRIM> = ...
```

### prim type

`prim<P,C>` defines a primitive type descending from `P`.

```ts
export type prim<P extends PRIM, C = {}> =
  P & { constructor: Constructor<P> } & C
```

`P` must extend `PRIM`, meaning it must extend one of the primitive
types `boolean`, `string`, `number` and `bigint`.

The returned type is a
[*tagged intersection*](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#type-aliases) type,
preventing direct assignment of other primitive values with the same
base type, but which are not actually of the same type:

```ts
import { type prim } from 'ts-prims'

// int 'extends' number
type int = prim<number>
let i: int = 100 as int
let n: number = 200
n = i // ok
i = n // error
// Type 'number' is not assignable to type 'int'.
```

This helps prevent bugs like this:

```ts
// `i` is supposed to be an integer
let i: number = 0.5 // wrong, but no error!
```

`prim` tags the returned type in a specific way. It sets the type of the tag to
the type of the constructor function used to 'construct' values of the type.

> The name 'constructor' for a function that returns a primitive may seem
> strange to programmers coming from other languages, but Javascript has had
> built-in 'constructor' functions for the primitives like 'Boolean' and
> 'String' from its inception and these can be used to construct/convert values
> to the type they correspond to:
>
> ```ts
> let x: boolean = Boolean(1)
> // x == true
> ```
>
> `ts-prims` allows you to adopt this pattern for your own types. See below for
> more information. For now, just know that a 'constructor' for a primitive
> type is just a function (conventionally with a name starting with an
> uppercase letter) that you can pass a value and when possible, it will
> convert that value to the corresponding primitive type.

Using the type of the constructor as the tag type naturally creates an
inheritance-like structure which we can use to our benefit:

```ts
import { type prim } from 'ts-prims'

// int 'extends' number
type int = prim<number>
// byte 'extends' int
type byte = prim<int>

let i: int = 200 as int
let b: byte = 100 as byte
i = b // ok
b = i // error
// Type 'int' is not assignable to type 'byte'.
```

Typescript understands that `byte` can be assigned to `int`, but not
vice-versa.

Typescript checks assignability based on the 'shape' of the type. `prim` uses
this to create a system that resembles a type hierarchy. But we can go further!
`prim` accepts a second parameter that we can use to refine the tagging with
extra information. Lets use it to create a simple [`varchar`](#varchar-type)
type:

```ts
import { type prim, type Lte } from 'ts-prims'

type varchar<N extends Lte<256>> =
  prim<string, { max: Lte<N> }>
```

> [`Lte`](#lte) is a utility type that can be read as
> **L**ess-**T**han-or-**E**qual

What does this achieve? Lets have a look:

```ts
type zipcode = varchar<5>
type title = varchar<32>
let zip: zipcode = '90210' as zipcode
let txt: title = 'Hello primitive types!' as title
txt = zip // ok
zip = txt // error
// Type 'title' is not assignable to type 'zipcode'.
```

Nice! Typescript now understands the difference between `varchar<5>` and
`varchar<32>` and it knows that we can safely assign one to the other, but
not the other way around. And we only needed a few lines of code to achieve it!

But lets have a closer look at this. Specifically lets discuss the casting that
is happening:

```ts
let zip: zipcode = '90210' as zipcode
```

By default, `'90210'` is typed as `string` and trying to assign it directly to
a variable of type `zipcode` will give a compile error. That is type-safety for
the win! Casting the literal to `zipcode` fixes that. But what if the value
was coming from some user input for example and was actually too long?

```ts
let zip: zipcode = 'Too long!' as zipcode
```

Yeah that's right. Typescript will happily accept it. For this scenario we
need some runtime checks. We will address this in the next section.

For now, a short recap:

> `prim` creates tagged types. Attempting to assign regular primitives to these
> types gives us a compiler error. That should trigger us to stop and think! We
> have three options here:
> 1. The error is correct, we are doing something wrong -> fix it
> 2. We can guarantee that the value is actually of the right type -> cast
> 3. We need to check at runtime whether the value is of the right type

When we find that we have situation 1 or 2, we either fix the code or add
a simple cast. But if we are in situation 3, we need to add some runtime
presence of our type with the `Prim` function.

### Prim function

Up till now we just worked with types and everything we did will be erased in
the build phase in a process called
[type erasure](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#erased-types).

But sometimes you want your types to have presence at runtime as well, so you
can for example perform validation and conversion on the values. The `Prim`
function helps us achieve just that in a consistent and convenient way.

```ts
export const Prim: PrimFactory = <P extends PRIM> (
  name: string,
  pc: SuperConstructor<P>,
  rtti: Partial<Rtti<P>> = {}
): PrimConstructor<P>
```

Lets see how it works:

```ts
import { type prim, type PRIM, Prim } from 'ts-prims'

type int = prim<number>

// creates the constructor function
const Int = Prim<int>('int', Number, {
  is: (v: PRIM): v is int => Number.isInteger(v)
})
```

The call to `Prim()` creates the function `Int`, that will call
`Number.isInteger` on any value given to it, to verify that it is indeed an
integer. Now, we can use `Int` to perform runtime validation:

```ts
let i: int = Int(100) // ok
i = Int(0.5) // runtime error
// TypeError: 0.5 is not of type 'int'
```

The third argument of `Prim` is an object of type [`Rtti`](#rtti). By default,
an empty object is used, but you can supply your own object as we did above and
provide custom functions for [`is`](#toprim), [`as`](#asprim) and
[`to`](#toprim).

This gives us a convenient and reusable pattern to work with primitive types,
control assignability between different subtypes of the same base type and
give them runtime presence.

And that should be about enough about `prim` and `Prim`. You can read further
about some of the helper types that are used under the hood, or you can skip
down to the [primitive types included](#primitive-types-included) in ts-prims.

### Helper types

#### Constructor

A `Constructor`, in the context of `ts-prims` is a function that validates/
converts a value to a primitive type.

```ts
export type Constructor<P extends PRIM> =
  PrimConstructor<P> | NativeConstructor<P>
```

We distinguish between user-defined [`PrimConstructor`](#primconstructor)s and
built-in [`NativeConstructor`](#nativeconstructor)s.

#### PrimConstructor

The user-defined constructor for the primitive type `P` is a
combination of a [`ToPrim`](#toprim) conversion function and `Rtti`.

```ts
export type PrimConstructor<P extends PRIM> =
  ToPrim<P> & Rtti<P>
```

#### NativeConstructor

The native (built-in) constructor for a given primitive type `P`.

```ts
export type NativeConstructor<P extends PRIM> =
  P extends boolean ? BooleanConstructor :
  P extends string ? StringConstructor :
  P extends number ? NumberConstructor :
  BigIntConstructor
```

#### SuperConstructor

The super constructor for a given prim type `P` is a
[`Constructor`](#constructor) for the [`PrimTypeOf<P>`](#primtypeof).

```ts
export type SuperConstructor<P extends PRIM> =
  Constructor<PrimTypeOf<P>>
```

#### ToPrim

A type conversion function that converts `v` to `P`.

```ts
export type ToPrim<P extends PRIM> = (v: PRIM) => P
```

#### IsPrim

A type guard function that checks whether `v is P`

```ts
export type IsPrim<P extends PRIM> = (v: PRIM) => v is P
```

#### AsPrim

A type assertion function that asserts that `v is P`.

```ts
export type AsPrim<P extends PRIM> = (v: PRIM) => asserts v is P
```

#### PrimTypeOf

```ts
```

#### Rtti

Run-Time Type Information for the primitive type `P`

```ts
export type Rtti<P extends PRIM> = {
  name: string
  super: SuperConstructor<P>
  to: ToPrim<P>
  is: IsPrim<P>
  as: AsPrim<P>
}
```

**Example:**

```ts
import { type prim, Prim } from 'ts-prims'
type int = prim<number>
const Int = Prim<int>('int', Number)
```

`Int` will have properties `name`, `super`, `is`, `as`, `to`, which are
inspectable and usable at runtime.

#### HasSuper

Checks whether the given prim constructor function `pc` has a `super`
constructor associated with it. This is true for all constructor functions
created by `Prim`, but not for the native constructor functions.

```ts
export type HasSuper =
  <P extends PRIM> (pc: Constructor<P>) =>
  pc is PrimConstructor<P>
```

There is a runtime function that implements it:

```ts
export const hasSuper: HasSuper =
  <P extends PRIM> (pc: Constructor<P>):
  pc is PrimConstructor<P>
```

#### GetSuper

Returns the associated `super` constructor function, if any.

```ts
export type GetSuper =
  <P extends PRIM> (pc: Constructor<P>) =>
  SuperConstructor<P> | undefined
```

There is a runtime function implementing it:

```ts
export const getSuper: GetSuper =
  <P extends PRIM> (pc: Constructor<P>):
  SuperConstructor<P> | undefined
```

#### PrimFactory

A prim factory creates user-defined constructor functions for
user-defined primitive types.

```ts
export type PrimFactory =
  <P extends PRIM> (
    name: string,
    pc: SuperConstructor<P>,
    rtti?: Partial<Rtti<P>
  >) => PrimConstructor<P>
```

It is implemented by the [`Prim`](#prim-function) function.

## Primitive types included

Below are the primitive types included in `ts-prims`. You can look at their
source code and play with them to learn from them, use them directly in your
code, or use them as the basis to create further refined types specific to
your domain. Enjoy!

### Type hierarchy

The types in this project are laid out in this hierarchy:

```
  +- [`prim`](#prim) (extends `boolean | string | number | bigint`)
      +- `boolean`
      +- `string`
      |   +- [`text<W>`](#text)
      |       +- [`memo`](#memo)
      |           +- [`varchar<L>`](#varchar)
      |
      +- [`varint<W>`](#varint) (`extends number | bigint`)
          +- `number`
          |   +- [`int<LW>`](#int)
          |       +- [`int8`](#int8)
          |       +- [`int16`](#int16)
          |       +- [`int24`](#int24)
          |       +- [`int32`](#int32)
          |       +- [`int40`](#int40)
          |       +- [`int48`](#int48)
          |       +- [`int54`](#int54)
          |
          +- `bigint`
              +- [`big<W>`](#big)
                  +- [`big64`](#big64)
                  +- [`big96`](#big96)
                  +- [`big128`](#big128)
                  +- [`big160`](#big160)
                  +- [`big192`](#big192)
                  +- [`big256`](#big256)
                  +- [`big512`](#big512)
                  +- [`big4K`](#big4k)
```

### text

#### `text` type

```ts
export type text =
  prim<string>
```

The base prim type for text with an unbounded length.

#### `Text` constructor

```ts
export const Text =
  Prim<text>(`text`, String)
```

#### Text example

```ts
import { type text, Text } from 'ts-prims'

// narrow using cast
let x: text = 'Hello World!' as text
// or using runtime check by constructor
x = Text('Checked at runtime')
```

### memo

#### `memo` type

The base prim type for text with a maximum length of 65535 chars (64KiB)

```ts
export type memo =
  prim<text>
```

#### `Memo` constructor

```ts
export const Memo =
  Prim<memo> ('memo', Text, {
    is: (v: PRIM): v is prim<memo> =>
      Text.is(v) && v.length <= 65535,
  })
```

#### Memo example

```ts
import {
  type text, Text,
  type memo, Memo
} from 'ts-prims'

let x: memo = Memo('Hello World!')
let y: text = Text('super')
y = x // ok
x = y // error
// Type 'text' is not assignable to type 'memo'.
```

See: [text](#text)

### varchar

#### `varchar` type

```ts
export type varchar<N extends Lte<256>> =
  prim<memo, { max: Lte<N> }>
```

A variable length string with a maximum length of `N`.

`N` must be a literal positive integer number in the range 0 .. 256.

This type is meant to model strings with a limited length like SQL's `varchar`. For longer strings, use `memo` if the string length remains below 64K, or `text` otherwise.

#### `Varchar` constructor

```ts
export const Varchar =
  <N extends Lte<256>> (n: N) =>
  Prim <varchar<N>> (`varchar<${n}>`, Memo, {
    is: (v: PRIM): v is varchar<N> =>
      Memo.is(v) && v.length <= n
  })
```

#### Varchar example

```ts
import {
  type text, Text,
  type varchar, Varchar
} from 'ts-prims'

// create custom type
type zipcode = varchar<5>
// create custom constructor function
const Zipcode = Varchar(5)
// use them
let zip: zipcode = Zipcode('90210') // ok
let oops: zipcode = Zipcode('Too long!') // runtime error
// TypeError: "Too long!" is not of type 'varchar<5>'
let txt = Text('base')
txt = zip // ok
zip = txt // error
// Type 'text' is not assignable to type 'zipcode'.
```

See: [text](#text), [memo](#memo)

### varint

#### `varint` type

Low-level 'fixed variable-width' signed integer type.

This integer type allows for a wide range of bit widths to be supported,
from `8` to `4096`. It is 'fixed' variable-width because this specification
has selected `16` different possible widths and those are the only options
available. Of course, lower width numbers always 'fit' in the higher
width numbers, but not vice versa.

```ts
export type varint <W extends Width> =
  prim<IntType<W>, { width: Lte<W> }>
```

`IntType` automatically selects the smallest underlying type that will fit:

```ts
type X = varint<4> // type X = number & ....
type Y = varint<8> // type Y = bigint & ...
```

This is a low-level type.
Prefer [`int`](#int) and [`big`](#big) in stead.

#### `Varint` constructor

```ts
export const Varint =
  <W extends Width> (w:W) =>
  Prim<varint<W>>(
    `varint<${w}>`, intType(w) as SuperConstructor<varint<W>>
  )
```

#### Varint example

```ts
type X = varint<4> // type X = number & ....
type Y = varint<7> // type Y = number & ...
type Z = varint<8> // type Z = bigint & ...
let x: X = 10 as X
let y: Y = 20 as Y
let z: Z = 30n as Z
y = x
x = y // Type 'Y' is not assignable to type 'X'.
y = x
y = z // Type 'Z' is not assignable to type 'Y'.
z = y // Type 'Y' is not assignable to type 'Z'.
```

### int

#### `int` type

Int type with low int width `W`.

```ts
export type int <W extends LowWidth> =
  prim<number, { width: Lte<W> }>
```


#### `Int` constructor

#### Int example

```ts
type byte = int<1>
// type byte = number & {
//     constructor: Constructor<number>;
// } & {
//     width: Lte<1>;
// }

type word = int<2>
// type word = number & {
//     constructor: Constructor<number>;
// } & {
//     width: Lte<2>;
// }

let x: byte = 100 as byte
let y: word = 1000 as word
y = x // ok
x = y // error
// Type 'word' is not assignable to type 'byte'.
```

#### int8
```ts
export type int8 = int<_8bit>
```

#### int16
```ts
export type int16 = int<_16bit>
```
#### int24
```ts
export type int24 = int<_24bit>
```
#### int32
```ts
export type int32 = int<_32bit>
```
#### int40
```ts
export type int40 = int<_40bit>
```
#### int48
```ts
export type int48 = int<_48bit>
```
#### int54
```ts
export type int54 = int<_54bit>
```

### big

#### `big` type

Big int type with high int width `W`.

```ts
export type big <W extends Width> =
  prim<bigint, { width: Lte<W> }>
```

#### `Big` constructor

Returns a constructor for `big` numbers with the given Width `W`.

```ts
export const Big =
  <W extends Width> (w:W) =>
  Prim<big<W>>(
    `big<${w}>`, BigInt
  )
```

#### Big example

```ts
import type { big, _4Kbit } from 'ts-prims'

type big4k = big<_4Kbit>
// type big4k = bigint & {
//     constructor: Constructor<bigint>;
// } & {
//     width: Lte<15>;
// }
```

#### big64

`64`-bit integer in the `HighWidth` (slow) range.

```ts
export type big64 = big<_64bit>
```

> **warning: may degrade performance!**
>
> The Javascript platform only supports up to `54`-bit integers with the
> native `number` type. Therefore, values of type `big64` are unfortunately
> stored as `bigint`, which is a variable-width format that supports ints
> with hundreds or even thousands of bits, but is much slower than
> native `number`. If it is possible to use `int54` instead, prefer that.
> Most other platforms have native support for `64`-bit integers, but if
> you want true cross-platform performance guarantees, stick to `int54`.

#### big96

`96`-bit integer in the `HighWidth` (slow) range.

```ts
export type big96 = big<_96bit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `96`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.

#### big128

`128`-bit integer in the `HighWidth` (slow) range.

```ts
export type big128 = big<_128bit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `128`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.

#### big160

`160`-bit integer in the `HighWidth` (slow) range.

```ts
export type big160 = big<_160bit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `160`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.

#### big192

`192`-bit integer in the `HighWidth` (slow) range.

```ts
export type big192 = big<_192bit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `192`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.

#### big256

`256`-bit integer in the `HighWidth` (slow) range.

```ts
export type big256 = big<_256bit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `256`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.

#### big512

`512`-bit integer in the `HighWidth` (slow) range.

```ts
export type big512 = big<_512bit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `512`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.

#### big4K

`4096`-bit integer in the `HighWidth` (slow) range.

```ts
export type big4K = big<_4Kbit>
```

> **warning: may degrade performance!**
>
> Most platforms have no native support for `4096`-bit numbers. We emulate
> them, in this case with `bigint` and on other platforms in similar ways.


### Utility types

#### _Lt

The union of all positive numbers from `0` up to,
but not including, `N`.

```ts
export type _Lt <N extends number, A extends number[] = []> =
    N extends A['length'] ? A[number] :
    _Lt<N, [A['length'], ...A]>
```

`N` must be small since this type uses recursion to
generate a union type.

You should use type [`Lt`](#lt) in place of this one, which forces
a safe limit on type parameter `N`.


#### Lt

The union of all positive integers **L**ess **T**han `N`.

```ts
export type Lt <N extends _Lt<256> | 256> = _Lt<N>
```

Returns the union of all positive integers from `0` up to, but not
including, `N`. Safe version.

```ts
type lt8 = Lt<8>
// type lt8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
```

This type is limited to only accept small numbers for its `N` parameter.
This makes this type safe to use. Below the surface it is delegating to
[`_Lt`](#_lt), the unrestricted (and therefore 'unsafe') version of this type
that actually performs recursion to determine the range of values.

See [Lte](#lte) if you need an end-inclusive range.


#### Lte

The union of all positive integers **L**ess **T**han or
**E**qual to `N`.

```ts
export type Lte<N extends _Lt<256> | 256> = Lt<N> | N
```

Returns the union of all positive integers from `0` up to and
including, `N`.

```ts
type Lte7 = Lte<7>
// type Lte7 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
```

See [Lt](#lt) if you need an end-exclusive range.


## Issues
Please report issues to this projects Git repository on Github:
[https://github.com/download/ts-prims](https://github.com/download/ts-prims)

## Copyright
Copyright 2025 by Stijn de Witt. Some rights reserved.

## License
Open source under the permissive [MIT](/LICENSE)

