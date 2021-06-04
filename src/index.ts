export type {
  MatcherFn,
  ValidatorFn,
  Structure,
  TypeDefs,
  TypeValidators,
  ValidationError,
} from "./validators";
export { addPathToMsg } from "./validators";

import type { Structure, TypeDefs, ValidationError } from "./validators";
import { typeValidators, validatorFor } from "./validators";

export function validateStructure(
  val: any,
  structure: Structure,
  strict: boolean = true,
  customTypes: TypeDefs = {}
): ValidationError[] {
  const types = typeValidators(customTypes);
  const validator = validatorFor(structure);
  return validator(val, "", types, strict);
}

export function matchesStructure(
  val: any,
  structure: Structure,
  strict: boolean = true,
  customTypes: TypeDefs = {}
): boolean {
  const errors = validateStructure(val, structure, strict, customTypes);
  return errors.length === 0;
}
