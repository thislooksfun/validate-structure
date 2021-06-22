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

/**
 * Validate that an object meets the requirements of a structure.
 *
 * @param val The value to validate.
 * @param structure The expected structure of `val`.
 * @param strict Whether or not extra keys should be treated as a failure.
 * @param customTypes Any custom types you want to refer to in `structure`.
 *
 * @returns An array of all the validation errors found.
 */
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

/**
 * Check that an object meets the requirements of a structure.
 *
 * @param val The value to validate.
 * @param structure The expected structure of `val`.
 * @param strict Whether or not extra keys should be treated as a failure.
 * @param customTypes Any custom types you want to refer to in `structure`.
 *
 * @returns `true` if `val` adheres to `structure`, and `false` if it does not.
 */
export function matchesStructure(
  val: any,
  structure: Structure,
  strict: boolean = true,
  customTypes: TypeDefs = {}
): boolean {
  const errors = validateStructure(val, structure, strict, customTypes);
  return errors.length === 0;
}
