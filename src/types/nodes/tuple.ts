import {
  addPathToMsg,
  TypeValidators,
  ValidationError,
} from "../../validators";
import { ParseNode } from "./base";

export class TupleNode extends ParseNode<ParseNode<any>[]> {
  constructor(of: ParseNode<any>[]) {
    super(of);
  }

  validate(
    val: any,
    path: string,
    types: TypeValidators,
    strict: boolean
  ): ValidationError[] {
    let errors = types.array(val, path, types, strict);
    if (errors.length) return errors;
    if (val.length !== this.of.length) {
      const msg = `array must have length ${this.of.length}`;
      return addPathToMsg(msg, path, "val-end");
    }

    for (let i = 0; i < val.length; ++i) {
      const keypath = `${path}[${i}]`;
      const errs = this.of[i].validate(val[i], keypath, types, strict);
      errors.push(...errs);
    }

    return errors;
  }

  stringify(): string {
    return "[" + this.of.map(n => n.stringify()).join(", ") + "]";
  }
}
