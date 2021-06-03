import fc from "fast-check";

import { matchesStructure } from "../src";

it("matchesStructure()", () => {
  const struct = "Person";

  const types = {
    Person: {
      name: "string",
      "parents[]?": "Person",
      "spouse?": "Person",
      "children[]?": "Person",
    },
  };

  expect(matchesStructure({ id: 14 }, struct, true, types)).toBe(false);
  // Should fail if it can't find 'Person'
  expect(matchesStructure({ name: "John Doe" }, struct)).toBe(false);

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
      expect(matchesStructure(person, struct, true, types)).toBe(true);
    })
  );
});
