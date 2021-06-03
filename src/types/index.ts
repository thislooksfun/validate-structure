import type { Validator } from "../validators";
import { Parser, Grammar } from "nearley";
import grammar from "./grammar";

export function parseType(type: string): Validator {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  const parsed = parser.feed(type.replace(/\s/g, "")).finish();
  if (parsed.length === 0) throw new Error(`Incomplete type '${type}'`);
  /* istanbul ignore next -- this is a bounds check that should never fail */
  if (parsed.length > 1) {
    console.error(
      `Ambiguous parse of input '${type}'. This is a bug, please report it here: https://github.com/thislooksfun/validate-structure/issues`
    );
  }
  return parsed[0];
}
