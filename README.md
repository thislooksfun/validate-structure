# validate-structure

<p align="center">
  <a href="https://github.com/semantic-release/semantic-release"
    ><img
      alt="semantic release"
      src="https://flat.badgen.net/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80/semantic%20release/e10079"
    /></a
  >
  <a href="https://github.com/thislooksfun/validate-structure/releases/latest"
    ><img
      alt="latest release"
      src="https://flat.badgen.net/github/release/thislooksfun/validate-structure"
    /></a
  >
  <a href="https://github.com/thislooksfun/validate-structure/releases"
    ><img
      alt="latest stable release"
      src="https://flat.badgen.net/github/release/thislooksfun/validate-structure/stable"
    /></a
  >
  <a href="#"
    ><img
      alt="checks status"
      src="https://flat.badgen.net/github/checks/thislooksfun/validate-structure"
    /></a
  >
  <a href="https://app.codecov.io/gh/thislooksfun/validate-structure"
    ><img
      alt="coverage"
      src="https://flat.badgen.net/codecov/c/github/thislooksfun/validate-structure"
    /></a
  >
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/validate-structure?activeTab=versions"
    ><img
      alt="npm version"
      src="https://flat.badgen.net/npm/v/validate-structure"
    /></a
  >
  <a href="https://github.com/thislooksfun/validate-structure/tree/master/types"
    ><img
      alt="npm types"
      src="https://flat.badgen.net/npm/types/validate-structure"
    /></a
  >
  <a href="https://www.npmjs.com/package/validate-structure"
    ><img
      alt="weekly npm downloads"
      src="https://flat.badgen.net/npm/dw/validate-structure"
    /></a
  >
  <a href="https://www.npmjs.com/package/validate-structure?activeTab=dependents"
    ><img
      alt="npm dependents"
      src="https://flat.badgen.net/npm/dependents/validate-structure"
    /></a
  >
  <a href="https://github.com/thislooksfun/validate-structure/blob/master/LICENSE"
    ><img
      alt="license"
      src="https://flat.badgen.net/github/license/thislooksfun/validate-structure"
    /></a
  >
</p>

Check that an object matches the expected structure.

## Installation

```sh
npm i validate-structure
```

Note: Node 14+ is required.

## Usage

### Functions

#### validateStructure()

Signature: `validateStructure(obj: any, structure: Structure, strict?: boolean, customTypes?: TypeDefs): ValidationError[]`

Arguments:

1. `obj` The object to validate.
2. `structure` The expected structure of `obj`. This must be a
   [Structure](#structure).
3. (optional) `strict` Whether or not extra keys should be treated as
   a failure (defaults to `true`)
4. (optional) `customTypes` Any custom types that you want to refer to
   multiple times can be placed here for convenience. This should be an object
   where each key is the name of the type and the value is a
   [Structure](#structure).

#### matchesStructure()

Signature: `matchesStructure(obj: any, structure: Structure, strict?: boolean, customTypes?: TypeDefs): boolean`

This is a simple wrapper around `validateStructure()` that returns `true` if and
only if there were no errors returned by `validateStructure()`. It can be used
if you only care _that_ it doesn't match, but if you need to know _what_ didn't
match you should use `validateStructure()` directly.

### Structure

`validate-structure` is built around a robust type system, which means it can
handle any data structure you throw at it.

#### Basic Structure

The most basic Structure is a single string representing a native type. The
following `typeof`s are supported out-of-the-box:

1. `"boolean"`
1. `"number"`
1. `"bigint"`
1. `"string"`
1. `"symbol"`
1. `"function"`

There are also some non-`typeof` checks provided as well:

1. `"int"` Matches any integer
1. `"array"` Matches any array
1. `"object"` Matches any object that is not an array or `null`

#### Operators

Sometimes you might find that just the basic types aren't enough. That's why
`validate-structure` has a range of operators you can use to form complex
Structures.

1. `"<type>?"` Optional: matches `"<type>"` or `null` or `undefined`.
1. `"<type>[]"` Array: matches an array of `"<type>"`. If you array has a fixed
   length `N`, use `<type>[N]`. If the array can't be empty, but you don't care
   how long it actually is use `<type>[.]`. If null values are allowed inside
   the array, put a `?` between the `<type>` and the `[` (like so: `int?[]`).
1. `"[<type 1>, ..., <type n>]"` Tuple: matches an array of `"<type>"`s with
   strict length. For example, if you have an image size stored as a pair of
   integers you can validate that with `"[int, int]"`.
1. `<type 1> | ... | <type n>` Union: matches at least one of the `"<type>"`s.
1. `(<type>)` Group: used to group types together. For instance the structure
   `(string | int)[]` will match an array where each item is either a string or
   an integer.

#### Objects

If your data can't be represented by one of the basic types you can use an
object structure. It should exactly match the expected structure with a few
exceptions:

1. If a value is optional you can append a `'?'` to the key. For example:
   `{ 'optional?': 'string' }`.
1. If a value should be an array you can use the array syntax above (`[]`, `[.]`,
   and `[N]`). For example: `{ 'arr[]': 'string' }`.
1. If a value should be a tuple, you can use an array of values. For example:
   `{ size: ["int", "int"] }`.

#### Custom types

If you have a complex type that you would like to reuse in multiple places you
can specify it as a custom type. It also allows for recursion.

```ts
const types = {
  Person: {
    name: "Name",
    "parents[]?": "Person",
    "spouse?": "Person",
    "children[]?": "Person",
  },

  Name: { first: "string", last: "string" },
};

validateStructure(person, "Person", true, types);
```

#### Functions

If you have a use case that is not satisfied by the aforementioned methods, you
can write a custom validator function. These come in two flavors and can be used
anywhere a Structure can.

1. Matcher (`type MatcherFn = (val: any) => boolean`).
   This is the simpler of the two. It takes in a value and should return `true`
   if the value matches and `false` if it doesn't.
1. Validator (`type ValidatorFn = (val: any, path: string, types: TypeValidators, strict: boolean) => ValidationError[]`).
   This is more complicated, but gives much more control. The arguments are as follows:

   1. `val` The value to validate.
   1. `path` The keypath of the value in dot notation, used for error messages.
   1. `types` A key:value map of other `ValidatorFn`s. For example, `types.array`
      is the `ValidatorFn` that matches any array. This includes matchers for any
      [custom types](#custom-types) you have defined.
   1. `strict` Whether or not the validation is running in strict mode. See
      [`validateStructure()`](#validatestructure) for details.

   The return type is an array of `ValidationError` objects. Each
   `ValidationError` is an object consisting of two keys: `msg` and `path`.
   `msg` is a string explaining what the error is, and `path` is the path to the
   invalid item. For example: `{ msg: 'array must not be empty', path: 'arr' }`.

   Here is an example to check if a value is a string that starts with a `$`:

   ```ts
   import type { ValidatorFn } from "validate-structure";
   import { validateStructure, addPathToMsg } from "validate-structure";

   const dollarString: ValidatorFn = (val, path, types, strict) => {
     // Check if the value is a string
     const errors = types.string(val, path, types, strict);
     if (errors.length > 0) return errors;

     // The value is fine, return no errors.
     if (val.startsWith("$")) return [];

     // The value is invalid, return an error
     return addPathToMsg(`'${val}' does not start with a '$'`, path);
   };

   validateStructure("$12", dollarString); // -> []
   validateStructure("12", dollarString); // -> [{msg: "'12' does not start with a '$'", path: ""}]
   validateStructure({ price: "12" }, { price: dollarString }); // -> [{msg: "'12' does not start with a '$'", path: "price"}]
   ```

### Examples

```ts
import { matchesStructure } from "validate-structure";

// A single string
matchesStructure("hello world", "string"); // -> true

// A single integer
matchesStructure(14, "int"); // -> true
matchesStructure(14.2, "int"); // -> false

// An array of numbers
matchesStructure([], "number[]"); // -> true
matchesStructure([14], "number[]"); // -> true
matchesStructure([1, 2, 3, 4, 5], "number[]"); // -> true

// A tuple of 2 numbers
const sizeTuple = "[number, number]"; // This could also be written "number[2]"
matchesStructure([1, 2], sizeTuple); // -> true
matchesStructure([1], sizeTuple); // -> false
matchesStructure([1, 2, 3], sizeTuple); // -> false

// A tuple of a string and an int
const ruleTuple = "[string, int]";
matchesStructure(["tabLength", 2], sizeTuple); // -> true
matchesStructure([14, 2], sizeTuple); // -> false

// A custom object structure
const structure = { id: "int", name: "string" };
matchesStructure({ id: 14, name: "John" }, structure); // -> true

// Strict mode is on by default
matchesStructure({ id: 14, name: "John" }, { id: "int" }); // -> false
matchesStructure({ id: 14, name: "John" }, { id: "int" }, false); // -> true

// Complex structures
const structure = {
  name: "string",
  tabs: {
    name: "string",
    "color?": "string",
    "contents[.]": {
      "title?": "string",
      body: "string",
    },
  },
};

matchesStructure(
  {
    name: "Home",
    tabs: {
      name: "About",
      contents: [
        { title: "About Us", body: "Lorem ipsum dolor sit amet" },
        { body: "consectetur adipiscing elit" },
      ],
    },
  },
  structure
); // -> true

matchesStructure(
  {
    name: "Home",
    tabs: {
      name: "About",
      contents: [],
    },
  },
  structure
); // -> false (tabs.contents must be non-empty)
```

## Contributing

If you want to help out, please read the [CONTRIBUTING.md][c.md].

<!-- Links -->

[c.md]: https://github.com/thislooksfun/validate-structure/blob/master/CONTRIBUTING.md
