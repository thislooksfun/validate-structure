import type { TypeValidators, ValidationError } from "../../validators";
import { ParseNode } from "./base";

export class OptionalNode<T> extends ParseNode<ParseNode<T>> {
  constructor(of: ParseNode<T>) {
    super(of);
  }

  validate(
    val: any,
    path: string,
    types: TypeValidators,
    strict: boolean
  ): ValidationError[] {
    return val == null ? [] : this.of.validate(val, path, types, strict);
  }

  stringify(): string {
    return this.of.stringify() + "?";
  }
}
