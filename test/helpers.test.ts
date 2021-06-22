import fc from "fast-check";

import { buildError } from "../src";

describe("buildError()", () => {
  it("should format a message and path into a ValidationError array", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.oneof(fc.string(), fc.integer())),
        (msg, path) => {
          expect(buildError(msg, path)).toStrictEqual([
            { msg, path, type: "val-start" },
          ]);
        }
      )
    );
  });

  it("should use the given type", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.oneof(fc.string(), fc.integer())),
        fc.string(),
        (msg, path, type) => {
          expect(buildError(msg, path, type)).toStrictEqual([
            { msg, path, type },
          ]);
        }
      )
    );
  });
});
