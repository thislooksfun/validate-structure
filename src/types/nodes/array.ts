import type { TypeValidators, ValidationError } from "../../validators";
import { validateArrayLength } from "../../validators";
import { ParseNode } from "./base";

export class ArrayNode<T> extends ParseNode<ParseNode<T>> {
  length: boolean | number;

  constructor(of: ParseNode<T>, length: boolean | number) {
    super(of);
    this.length = length;
  }

  validate(
    val: any,
    path: (string | number)[],
    types: TypeValidators,
    strict: boolean
  ): ValidationError[] {
    let errors = types.array(val, path, types, strict);
    if (errors.length > 0) return errors;
    errors = validateArrayLength(this.length, val, path);
    if (errors.length > 0) return errors;

    for (let i = 0; i < val.length; ++i) {
      const keypath = [...path, i];
      const errs = this.of.validate(val[i], keypath, types, strict);
      errors.push(...errs);
    }

    return errors;
  }

  stringify(): string {
    return this.of.stringify() + "[]";
  }
}
