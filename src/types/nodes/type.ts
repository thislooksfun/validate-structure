import {
  addPathToMsg,
  TypeValidators,
  ValidationError,
} from "../../validators";
import { ParseNode } from "./base";

export class TypeNode extends ParseNode<string> {
  constructor(of: string) {
    super(of);
  }

  validate(
    val: any,
    path: (string | number)[],
    types: TypeValidators,
    strict: boolean
  ): ValidationError[] {
    if (!(this.of in types)) {
      return addPathToMsg(`unknown type '${this.of}'`, path);
    }
    return types[this.of](val, path, types, strict);
  }

  stringify(): string {
    return this.of;
  }
}
