import fc from "fast-check";

import {
  ArrayNode,
  OptionalNode,
  TupleNode,
  TypeNode,
  UnionNode,
} from "../src/types/nodes";
import { parseType } from "../src/types";

const alphaNumChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const aNumChar = fc.constantFrom(...alphaNumChars);
const aNumStr = fc.stringOf(aNumChar, { minLength: 1 });

describe("parseType()", () => {
  it("single type", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(s)).toStrictEqual(new TypeNode(s));
      })
    );
  });

  it("optional", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}?`)).toStrictEqual(
          new OptionalNode(new TypeNode(s))
        );
      })
    );
  });

  it("array", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}[]`)).toStrictEqual(
          new ArrayNode(new TypeNode(s), {})
        );
      })
    );
  });

  it("optional array", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}[]?`)).toStrictEqual(
          new OptionalNode(new ArrayNode(new TypeNode(s), {}))
        );
      })
    );
  });

  it("array of optionals", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}?[]`)).toStrictEqual(
          new ArrayNode(new OptionalNode(new TypeNode(s)), {})
        );
      })
    );
  });

  it("optional array of optionals", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}?[]?`)).toStrictEqual(
          new OptionalNode(new ArrayNode(new OptionalNode(new TypeNode(s)), {}))
        );
      })
    );
  });

  it("non-empty array", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}[.]`)).toStrictEqual(
          new ArrayNode(new TypeNode(s), { min: 1 })
        );
      })
    );
  });

  it("fixed-length array", () => {
    fc.assert(
      fc.property(aNumStr, fc.integer(), (s, i) => {
        expect(parseType(`${s}[${i}]`)).toStrictEqual(
          new ArrayNode(new TypeNode(s), { min: i, max: i })
        );
      })
    );
  });

  it("min-length array", () => {
    fc.assert(
      fc.property(aNumStr, fc.integer(), (s, i) => {
        expect(parseType(`${s}[${i}...]`)).toStrictEqual(
          new ArrayNode(new TypeNode(s), { min: i })
        );
      })
    );
  });

  it("max-length array", () => {
    fc.assert(
      fc.property(aNumStr, fc.integer(), (s, i) => {
        expect(parseType(`${s}[...${i}]`)).toStrictEqual(
          new ArrayNode(new TypeNode(s), { max: i })
        );
      })
    );
  });

  it("variable-length array", () => {
    fc.assert(
      fc.property(aNumStr, fc.integer(), fc.integer(), (s, min, max) => {
        expect(parseType(`${s}[${min}...${max}]`)).toStrictEqual(
          new ArrayNode(new TypeNode(s), { min, max })
        );
      })
    );
  });

  it("tuple", () => {
    fc.assert(
      fc.property(aNumStr, aNumStr, (s1, s2) => {
        expect(parseType(`[${s1}, ${s2}]`)).toStrictEqual(
          new TupleNode([new TypeNode(s1), new TypeNode(s2)])
        );
      })
    );
  });

  it("array of arrays", () => {
    fc.assert(
      fc.property(aNumStr, s => {
        expect(parseType(`${s}[][]`)).toStrictEqual(
          new ArrayNode(new ArrayNode(new TypeNode(s), {}), {})
        );
      })
    );
  });

  it("compound types", () => {
    fc.assert(
      fc.property(aNumStr, aNumStr, aNumStr, aNumStr, (s1, s2, s3, s4) => {
        const type = `(${s1} | ${s2}?)[] | (${s3}[] | ${s4}?)[]`;
        expect(parseType(type)).toStrictEqual(
          new UnionNode([
            new ArrayNode(
              new UnionNode([
                new TypeNode(s1),
                new OptionalNode(new TypeNode(s2)),
              ]),
              {}
            ),
            new ArrayNode(
              new UnionNode([
                new ArrayNode(new TypeNode(s3), {}),
                new OptionalNode(new TypeNode(s4)),
              ]),
              {}
            ),
          ])
        );
      })
    );
  });

  it("should throw when given an invalid input", () => {
    expect(() => parseType("invalid??")).toThrow();
    expect(() => parseType("(invalid")).toThrow();
  });
});
