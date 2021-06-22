import type { TypeValidators, ValidationError } from "../../validators";
import { buildError } from "../../validators";
import { ParseNode } from "./base";

export class UnionNode extends ParseNode<ParseNode<any>[]> {
  constructor(of: ParseNode<any>[]) {
    super(of);
  }

  validate(
    val: any,
    path: (string | number)[],
    types: TypeValidators,
    strict: boolean
  ): ValidationError[] {
    for (const node of this.of) {
      const errors = node.validate(val, path, types, strict);
      if (errors.length === 0) return [];
    }

    const msg = `'${val}' does not match pattern '${this.stringify()}'`;
    return buildError(msg, path);
  }

  stringify(): string {
    return this.of.map(n => n.stringify()).join(" | ");
  }
}
