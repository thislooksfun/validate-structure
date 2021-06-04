import fc from "fast-check";

import { addPathToMsg } from "../src";

describe("addPathToMsg()", () => {
  it("should format a message and path into a ValidationError array", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (msg, path) => {
        expect(addPathToMsg(msg, path)).toStrictEqual([
          { msg, path, type: "val-start" },
        ]);
      })
    );
  });

  it("should use the given type", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (msg, path, type) => {
        expect(addPathToMsg(msg, path, type)).toStrictEqual([
          { msg, path, type },
        ]);
      })
    );
  });
});
