import type {
  Validator,
  TypeValidators,
  ValidationError,
} from "../../validators";

export abstract class ParseNode<T> implements Validator {
  of: T;

  constructor(of: T) {
    this.of = of;
  }

  abstract validate(
    val: any,
    path: string,
    types: TypeValidators,
    strict: boolean
  ): ValidationError[];

  abstract stringify(): string;
}
