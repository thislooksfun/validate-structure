import fc from "fast-check";

import { validateStructure } from "../src";

describe("validateStructure()", () => {
  describe("single types", () => {
    it("any", () => {
      const type = "any";
      fc.assert(
        fc.property(fc.anything(), a => {
          if (a == null) {
            expect(validateStructure(a, type)).toStrictEqual([
              { msg: "must be non-null", path: [], type: "val-start" },
            ]);
          } else {
            expect(validateStructure(a, type)).toStrictEqual([]);
          }
        })
      );

      fc.assert(
        fc.property(fc.anything(), a => {
          if (a == null) {
            expect(validateStructure(a, type)).toStrictEqual([
              { msg: "must be non-null", path: [], type: "val-start" },
            ]);
          } else {
            expect(validateStructure(a, type)).toStrictEqual([]);
          }
        })
      );
    });

    it("any?", () => {
      const type = "any?";
      fc.assert(
        fc.property(fc.anything(), a => {
          expect(validateStructure(a, type)).toStrictEqual([]);
        })
      );
    });

    it("null", () => {
      const type = "null";
      expect(validateStructure(null, type)).toStrictEqual([]);
      expect(validateStructure(undefined, type)).toStrictEqual([
        { msg: "'undefined' is not null", path: [], type: "val-start" },
      ]);
    });

    it("undefined", () => {
      const type = "undefined";
      expect(validateStructure(undefined, type)).toStrictEqual([]);
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not undefined", path: [], type: "val-start" },
      ]);
    });

    it("boolean", () => {
      const type = "boolean";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not a boolean", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.boolean(), b => {
          expect(validateStructure(b, type)).toStrictEqual([]);
        })
      );
    });

    it("number", () => {
      const type = "number";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not a number", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.oneof(fc.integer(), fc.double()), n => {
          expect(validateStructure(n, type)).toStrictEqual([]);
        })
      );
    });

    it("int", () => {
      const type = "int";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an integer", path: [], type: "val-start" },
      ]);
      expect(validateStructure(0.5, type)).toStrictEqual([
        { msg: "'0.5' is not an integer", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.integer(), i => {
          expect(validateStructure(i, type)).toStrictEqual([]);
        })
      );
    });

    it("bigint", () => {
      const type = "bigint";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not a bigint", path: [], type: "val-start" },
      ]);
      expect(validateStructure(0.5, type)).toStrictEqual([
        { msg: "'0.5' is not a bigint", path: [], type: "val-start" },
      ]);
      expect(validateStructure(10, type)).toStrictEqual([
        { msg: "'10' is not a bigint", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.bigInt(), bi => {
          expect(validateStructure(bi, type)).toStrictEqual([]);
        })
      );
    });

    it("string", () => {
      const type = "string";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not a string", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.string(), s => {
          expect(validateStructure(s, type)).toStrictEqual([]);
        })
      );
    });

    it("symbol", () => {
      const type = "symbol";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not a symbol", path: [], type: "val-start" },
      ]);
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not a symbol", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.string(), s => {
          expect(validateStructure(Symbol(s), type)).toStrictEqual([]);
        })
      );
    });

    it("function", () => {
      const type = "function";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not a function", path: [], type: "val-start" },
      ]);
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not a function", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.func(fc.integer()), f => {
          expect(validateStructure(f, type)).toStrictEqual([]);
        })
      );
    });

    it("array", () => {
      const type = "array";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure({}, type)).toStrictEqual([
        {
          msg: "'[object Object]' is not an array",
          path: [],
          type: "val-start",
        },
      ]);

      fc.assert(
        fc.property(fc.array(fc.anything()), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("object", () => {
      const type = "object";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an object", path: [], type: "val-start" },
      ]);
      expect(validateStructure([], type)).toStrictEqual([
        { msg: "'' is not an object", path: [], type: "val-start" },
      ]);
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not an object", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.object(), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });
  });

  describe("arrays", () => {
    it("simple", () => {
      const type = "string[]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([14], type)).toStrictEqual([
        { msg: "'14' is not a string", path: [0], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.array(fc.string()), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("non-empty", () => {
      const type = "string[.]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([], type)).toStrictEqual([
        {
          msg: "array must have at least length 1",
          path: [],
          type: "val-end",
        },
      ]);

      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 1 }), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("fixed-length", () => {
      const type = "string[2]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      const wrongLen = {
        msg: "array must have length 2",
        path: [],
        type: "val-end",
      };
      expect(validateStructure([], type)).toStrictEqual([wrongLen]);
      expect(validateStructure([""], type)).toStrictEqual([wrongLen]);
      expect(validateStructure(["", "", ""], type)).toStrictEqual([wrongLen]);

      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 2, maxLength: 2 }),
          arr => {
            expect(validateStructure(arr, type)).toStrictEqual([]);
          }
        )
      );
    });

    it("minimum length", () => {
      const type = "string[2...]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      const wrongLen = {
        msg: "array must have at least length 2",
        path: [],
        type: "val-end",
      };
      expect(validateStructure([], type)).toStrictEqual([wrongLen]);
      expect(validateStructure([""], type)).toStrictEqual([wrongLen]);

      fc.assert(
        fc.property(fc.array(fc.string(), { minLength: 2 }), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("maximum length", () => {
      const type = "string[...2]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      const wrongLen = {
        msg: "array must have no more than length 2",
        path: [],
        type: "val-end",
      };
      expect(validateStructure(["", "", ""], type)).toStrictEqual([wrongLen]);

      fc.assert(
        fc.property(fc.array(fc.string(), { maxLength: 2 }), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("length range", () => {
      const type = "string[2...3]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      const tooShort = {
        msg: "array must have at least length 2",
        path: [],
        type: "val-end",
      };
      const tooLong = {
        msg: "array must have no more than length 3",
        path: [],
        type: "val-end",
      };

      expect(validateStructure([], type)).toStrictEqual([tooShort]);
      expect(validateStructure([""], type)).toStrictEqual([tooShort]);
      expect(validateStructure(["", "", "", ""], type)).toStrictEqual([
        tooLong,
      ]);

      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 2, maxLength: 3 }),
          arr => {
            expect(validateStructure(arr, type)).toStrictEqual([]);
          }
        )
      );
    });

    it("tuple", () => {
      const type = "[string, boolean, int]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([], type)).toStrictEqual([
        { msg: "array must have length 3", path: [], type: "val-end" },
      ]);
      expect(validateStructure(["a"], type)).toStrictEqual([
        { msg: "array must have length 3", path: [], type: "val-end" },
      ]);
      expect(validateStructure(["a", "b"], type)).toStrictEqual([
        { msg: "array must have length 3", path: [], type: "val-end" },
      ]);
      expect(validateStructure(["a", "b", "c"], type)).toStrictEqual([
        { msg: "'b' is not a boolean", path: [1], type: "val-start" },
        { msg: "'c' is not an integer", path: [2], type: "val-start" },
      ]);
      expect(validateStructure(["a", true, 0.5], type)).toStrictEqual([
        { msg: "'0.5' is not an integer", path: [2], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.string(), fc.boolean(), fc.integer(), (s, b, i) => {
          expect(validateStructure([s, b, i], type)).toStrictEqual([]);
        })
      );
    });
  });

  describe("complex types", () => {
    it("optional", () => {
      const type = "string?";
      expect(validateStructure(2, type)).toStrictEqual([
        { msg: "'2' is not a string", path: [], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.option(fc.string()), s => {
          expect(validateStructure(s, type)).toStrictEqual([]);
        })
      );
    });

    it("optional array", () => {
      const type = "string[]?";
      expect(validateStructure([null], type)).toStrictEqual([
        { msg: "'null' is not a string", path: [0], type: "val-start" },
      ]);
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([4], type)).toStrictEqual([
        { msg: "'4' is not a string", path: [0], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.option(fc.array(fc.string())), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("array of optionals", () => {
      const type = "string?[]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([4], type)).toStrictEqual([
        { msg: "'4' is not a string", path: [0], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.array(fc.option(fc.string())), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("optional array of optionals", () => {
      const type = "string?[]?";
      expect(validateStructure("", type)).toStrictEqual([
        { msg: "'' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([4], type)).toStrictEqual([
        { msg: "'4' is not a string", path: [0], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.option(fc.array(fc.option(fc.string()))), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("array of arrays", () => {
      const type = "string[][]";
      expect(validateStructure(null, type)).toStrictEqual([
        { msg: "'null' is not an array", path: [], type: "val-start" },
      ]);
      expect(validateStructure([[""], [1]], type)).toStrictEqual([
        { msg: "'1' is not a string", path: [1, 0], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.array(fc.array(fc.string())), arr => {
          expect(validateStructure(arr, type)).toStrictEqual([]);
        })
      );
    });

    it("compound types", () => {
      const type = "string? | int | boolean[] | [int, int]";
      expect(validateStructure(0.5, type)).toStrictEqual([
        {
          msg: `'0.5' does not match pattern '${type}'`,
          path: [],
          type: "val-start",
        },
      ]);
      expect(validateStructure(true, type)).toStrictEqual([
        {
          msg: `'true' does not match pattern '${type}'`,
          path: [],
          type: "val-start",
        },
      ]);

      fc.assert(
        fc.property(
          fc.oneof(
            fc.option(fc.string()),
            fc.integer(),
            fc.array(fc.boolean()),
            fc.array(fc.integer(), { minLength: 2, maxLength: 2 })
          ),
          itm => {
            expect(validateStructure(itm, type)).toStrictEqual([]);
          }
        )
      );
    });
  });

  describe("object structure", () => {
    it("simple", () => {
      const struct = { id: "string", timestamp: "int" };

      expect(validateStructure(null, struct)).toStrictEqual([
        { msg: "'null' is not an object", path: [], type: "val-start" },
      ]);

      expect(validateStructure({ id: "abc" }, struct)).toStrictEqual([
        { msg: "missing key 'timestamp'", path: [], type: "val-end" },
      ]);

      fc.assert(
        fc.property(fc.string(), fc.string(), (s1, s2) => {
          const obj = { id: s1, timestamp: s2 };
          expect(validateStructure(obj, struct)).toStrictEqual([
            {
              msg: `'${s2}' is not an integer`,
              path: ["timestamp"],
              type: "val-start",
            },
          ]);
        })
      );

      fc.assert(
        fc.property(fc.integer(), fc.integer(), (i1, i2) => {
          const obj = { id: i1, timestamp: i2 };
          expect(validateStructure(obj, struct)).toStrictEqual([
            { msg: `'${i1}' is not a string`, path: ["id"], type: "val-start" },
          ]);
        })
      );

      fc.assert(
        fc.property(fc.string(), fc.integer(), (s, i) => {
          const obj1 = { id: s, timestamp: i };
          expect(validateStructure(obj1, struct)).toStrictEqual([]);
          const obj2 = { id: s, timestamp: i, extra: true };
          expect(validateStructure(obj2, struct, false)).toStrictEqual([]);
          expect(validateStructure(obj2, struct, true)).toStrictEqual([
            { msg: "extra key", path: ["extra"], type: "key" },
          ]);
        })
      );
    });

    it("nested", () => {
      const struct = { id: "string", meta: { timestamp: "int" } };

      expect(validateStructure(null, struct)).toStrictEqual([
        { msg: "'null' is not an object", path: [], type: "val-start" },
      ]);

      expect(validateStructure({ id: "abc" }, struct)).toStrictEqual([
        { msg: "missing key 'meta'", path: [], type: "val-end" },
      ]);
      expect(validateStructure({ id: "abc", meta: {} }, struct)).toStrictEqual([
        { msg: "missing key 'timestamp'", path: ["meta"], type: "val-end" },
      ]);
      expect(
        validateStructure({ id: "abc", meta: { extra: true } }, struct)
      ).toStrictEqual([
        { msg: "missing key 'timestamp'", path: ["meta"], type: "val-end" },
        { msg: "extra key", path: ["meta", "extra"], type: "key" },
      ]);

      fc.assert(
        fc.property(fc.string(), fc.string(), (s1, s2) => {
          const obj = { id: s1, meta: { timestamp: s2 } };
          expect(validateStructure(obj, struct)).toStrictEqual([
            {
              msg: `'${s2}' is not an integer`,
              path: ["meta", "timestamp"],
              type: "val-start",
            },
          ]);
        })
      );

      fc.assert(
        fc.property(fc.integer(), fc.integer(), (i1, i2) => {
          const obj = { id: i1, meta: { timestamp: i2 } };
          expect(validateStructure(obj, struct)).toStrictEqual([
            { msg: `'${i1}' is not a string`, path: ["id"], type: "val-start" },
          ]);
        })
      );

      fc.assert(
        fc.property(fc.string(), fc.integer(), (s, i) => {
          const obj1 = { id: s, meta: { timestamp: i } };
          expect(validateStructure(obj1, struct)).toStrictEqual([]);
        })
      );
    });

    it("arrays", () => {
      const struct = {
        "arr1[]": "string",
        "arr2[.]": "string",
        "arr3[2]": "string",
        "arr4[2...4]": "string",
        "arr5[2...]": "string",
        "arr6[...4]": "string",
      };

      expect(
        validateStructure(
          { arr1: [], arr2: [], arr3: [], arr4: [], arr5: [], arr6: [] },
          struct
        )
      ).toStrictEqual([
        {
          msg: "array must have at least length 1",
          path: ["arr2"],
          type: "val-end",
        },
        { msg: "array must have length 2", path: ["arr3"], type: "val-end" },
        {
          msg: "array must have at least length 2",
          path: ["arr4"],
          type: "val-end",
        },
        {
          msg: "array must have at least length 2",
          path: ["arr5"],
          type: "val-end",
        },
      ]);

      fc.assert(
        fc.property(
          fc.array(fc.string()),
          fc.array(fc.string(), { minLength: 1 }),
          fc.array(fc.string(), { minLength: 2, maxLength: 2 }),
          fc.array(fc.string(), { minLength: 2, maxLength: 4 }),
          fc.array(fc.string(), { minLength: 2 }),
          fc.array(fc.string(), { maxLength: 4 }),
          (arr1, arr2, arr3, arr4, arr5, arr6) => {
            const obj = { arr1, arr2, arr3, arr4, arr5, arr6 };
            expect(validateStructure(obj, struct)).toStrictEqual([]);
          }
        )
      );
    });

    it("tuples", () => {
      const struct = { rule: ["string", "int"] };

      expect(validateStructure({ rule: "hmm" }, struct)).toStrictEqual([
        { msg: "'hmm' is not an array", path: ["rule"], type: "val-start" },
      ]);

      expect(validateStructure({ rule: [] }, struct)).toStrictEqual([
        { msg: "array must have length 2", path: ["rule"], type: "val-end" },
      ]);

      fc.assert(
        fc.property(fc.string(), fc.string(), (s1, s2) => {
          const obj = { rule: [s1, s2] };
          expect(validateStructure(obj, struct)).toStrictEqual([
            {
              msg: `'${s2}' is not an integer`,
              path: ["rule", 1],
              type: "val-start",
            },
          ]);
        })
      );

      fc.assert(
        fc.property(fc.integer(), fc.integer(), (i1, i2) => {
          const obj = { rule: [i1, i2] };
          expect(validateStructure(obj, struct)).toStrictEqual([
            {
              msg: `'${i1}' is not a string`,
              path: ["rule", 0],
              type: "val-start",
            },
          ]);
        })
      );

      fc.assert(
        fc.property(fc.string(), fc.integer(), (s, i) => {
          const obj = { rule: [s, i] };
          expect(validateStructure(obj, struct)).toStrictEqual([]);
        })
      );
    });

    it("complex", () => {
      const struct = {
        id: "string",
        names: "string[.]",
        "children?[]?": {
          name: "string",
          age: "int",
          "pet?": {
            name: "string",
            species: "string",
            age: "int",
          },
        },
      };

      const invalid = { id: 14, names: [], children: "incorrect" };
      expect(validateStructure(invalid, struct)).toStrictEqual([
        { msg: "'14' is not a string", path: ["id"], type: "val-start" },
        {
          msg: "array must have at least length 1",
          path: ["names"],
          type: "val-end",
        },
        {
          msg: "'incorrect' is not an array",
          path: ["children"],
          type: "val-start",
        },
      ]);

      fc.assert(
        fc.property(
          fc.record(
            {
              id: fc.string(),
              names: fc.array(fc.string(), { minLength: 1 }),
              children: fc.option(
                fc.array(
                  fc.option(
                    fc.record(
                      {
                        name: fc.string(),
                        age: fc.integer(),
                        pet: fc.option(
                          fc.record({
                            name: fc.string(),
                            species: fc.string(),
                            age: fc.integer(),
                          })
                        ),
                      },
                      { requiredKeys: ["name", "age"] }
                    )
                  )
                )
              ),
            },
            { requiredKeys: ["id", "names"] }
          ),
          fc.string(),
          fc.array(fc.string()),
          obj => {
            expect(validateStructure(obj, struct)).toStrictEqual([]);
          }
        )
      );
    });
  });

  describe("custom types", () => {
    it("basic", () => {
      const type = "Size";
      const types = { Size: "[int, int]" };

      expect(validateStructure([], type, true, types)).toStrictEqual([
        { msg: "array must have length 2", path: [], type: "val-end" },
      ]);

      fc.assert(
        fc.property(fc.string(), fc.string(), (s1, s2) => {
          expect(validateStructure([s1, s2], type, true, types)).toStrictEqual([
            {
              msg: `'${s1}' is not an integer`,
              path: [0],
              type: "val-start",
            },
            {
              msg: `'${s2}' is not an integer`,
              path: [1],
              type: "val-start",
            },
          ]);
        })
      );

      // Should fail if it can't find the custom type
      expect(validateStructure([], type)).toStrictEqual([
        { msg: "unknown type 'Size'", path: [], type: "val-start" },
      ]);

      // Should fail even if the custom type is nested
      expect(validateStructure({ p: "" }, { p: type })).toStrictEqual([
        { msg: "unknown type 'Size'", path: ["p"], type: "val-start" },
      ]);

      fc.assert(
        fc.property(fc.integer(), fc.integer(), (i1, i2) => {
          expect(validateStructure([i1, i2], type, true, types)).toStrictEqual(
            []
          );
        })
      );
    });

    it("recursive", () => {
      const struct = "Person";

      const types = {
        Person: {
          name: "string",
          "parents[]?": "Person",
          "spouse?": "Person",
          "children[]?": "Person",
        },
      };

      const depthFactor = 100;
      const { person: genPerson } = fc.letrec(tie => ({
        person: fc.record({
          name: fc.string(),
          parents: fc.option(fc.array(tie("person")), { depthFactor }),
          spouse: fc.option(tie("person"), { depthFactor }),
          children: fc.option(fc.array(tie("person")), { depthFactor }),
        }),
      }));

      fc.assert(
        fc.property(genPerson, person => {
          expect(validateStructure(person, struct, true, types)).toStrictEqual(
            []
          );
        })
      );
    });
  });

  describe("custom matchers", () => {
    it("in structure", () => {
      fc.assert(
        fc.property(fc.string(), str => {
          const match = (v: any) => v === str;
          expect(validateStructure(str, match)).toStrictEqual([]);
          expect(validateStructure(str + "x", match)).toStrictEqual([
            { msg: `'${str}x' does not match`, path: [], type: "val-start" },
          ]);
        })
      );
    });

    it("in types", () => {
      fc.assert(
        fc.property(fc.string(), str => {
          const type = "Custom";
          const types = { Custom: (v: any) => v === str };
          expect(validateStructure(str, type, true, types)).toStrictEqual([]);
          expect(validateStructure(str + "x", type, true, types)).toStrictEqual(
            [{ msg: `'${str}x' does not match`, path: [], type: "val-start" }]
          );
        })
      );
    });
  });

  describe("custom validators", () => {
    it("in structure", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), fc.string(), (str, msg, type) => {
          const match = (val: any, path: (string | number)[]) =>
            val === str ? [] : [{ msg, path, type }];
          expect(validateStructure(str, match)).toStrictEqual([]);
          expect(validateStructure(str + "x", match)).toStrictEqual([
            { msg, path: [], type },
          ]);
        })
      );
    });

    it("in types", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), fc.string(), (str, msg, type) => {
          const struct = "Custom";
          const types = {
            Custom: (val: any, path: (string | number)[]) =>
              val === str ? [] : [{ msg, path, type }],
          };
          expect(validateStructure(str, struct, true, types)).toStrictEqual([]);
          expect(
            validateStructure(str + "x", struct, true, types)
          ).toStrictEqual([{ msg, path: [], type }]);
        })
      );
    });
  });
});
