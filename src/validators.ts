import { parseType } from "./types";

export interface ValidationError {
  msg: string;
  path: string;

  /**
   * Will be one of: `"key"`, `"val-start"`, or `"val-end"`
   *
   * @note This will be required in v2.0.0
   */
  type?: string;
}

export type MatcherFn = (val: any) => boolean;
export type ValidatorFn = (
  val: any,
  path: string,
  types: TypeValidators,
  strict: boolean
) => ValidationError[];

export type TypeDefs = { [key: string]: Structure | Structure[] };
export type Structure = string | TypeDefs | MatcherFn | ValidatorFn;

export type TypeValidators = { [key: string]: ValidatorFn };

export interface Validator {
  validate: ValidatorFn;
}

export function addPathToMsg(
  msg: string,
  path: string,
  type: string = "val-start"
): ValidationError[] {
  return [{ msg, path, type }];
}

export function validateArrayLength(
  length: boolean | number,
  arr: any[],
  path: string
): ValidationError[] {
  if (length === false) return [];
  if (length === true) {
    return arr.length > 0 ? [] : addPathToMsg("array must not be empty", path);
  }

  if (length !== arr.length) {
    const msg = `array must have length ${length}`;
    return addPathToMsg(msg, path, "val-end");
  }

  return [];
}

function typeError(
  b: boolean,
  v: any,
  t: string,
  p: string
): ValidationError[] {
  if (b) return [];

  const det = /^[aeiou]/.test(t) ? "an" : "a";
  return addPathToMsg(`'${v}' is not ${det} ${t}`, p);
}

function isType(t: string): ValidatorFn {
  return (v, p) => typeError(typeof v === t, v, t, p);
}

const isInt: ValidatorFn = (v, p) =>
  typeError(typeof v === "number" && Math.round(v) === v, v, "integer", p);

const isObj = (v: any) =>
  typeof v === "object" && !Array.isArray(v) && v != null;

const defaultValidators: TypeValidators = {
  any: () => [],
  boolean: isType("boolean"),
  number: isType("number"),
  int: isInt,
  bigint: isType("bigint"),
  string: isType("string"),
  symbol: isType("symbol"),
  function: isType("function"),
  array: (v, p) => typeError(Array.isArray(v), v, "array", p),
  object: (v, p) => typeError(isObj(v), v, "object", p),
};

export function validatorFor(type: Structure | Structure[]): ValidatorFn {
  if (Array.isArray(type)) {
    // Tuple of Structures
    return (val, path, types, strict) => {
      let errors = types.array(val, path, types, strict);
      if (errors.length > 0) return errors;
      if (val.length !== type.length) {
        const msg = `array must have length ${type.length}`;
        return addPathToMsg(msg, path, "val-end");
      }

      for (let i = 0; i < val.length; ++i) {
        const keypath = `${path}[${i}]`;
        const validator = validatorFor(type[i]);
        const errs = validator(val[i], keypath, types, strict);
        errors.push(...errs);
      }

      return errors;
    };
  } else if (typeof type === "string") {
    const typeMatch = parseType(type);
    return (v, p, t, s) => typeMatch.validate(v, p, t, s);
  } else if (typeof type === "object") {
    return validateObject(type);
  } else {
    return (v, p, t, s) => {
      let res = type(v, p, t, s);
      if (typeof res === "boolean") {
        res = res ? [] : addPathToMsg(`'${v}' does not match`, p);
      }
      return res;
    };
  }
}

interface ParsedKey {
  key: string;
  optional: boolean;
  array: boolean;
  arrLen: boolean | number;
  optContents: boolean;
}

function parseKey(key: string): ParsedKey {
  let optional = false;
  let array = false;
  let arrLen: boolean | number = false;
  let optContents = false;
  if (key.endsWith("?")) {
    key = key.slice(0, -1);
    optional = true;
  }
  if (key.endsWith("]")) {
    const li = key.lastIndexOf("[");
    const mid = key.slice(li + 1, -1);
    if (mid !== "") {
      arrLen = mid === "." ? true : parseInt(mid);
    }
    key = key.slice(0, li);
    array = true;
  }
  if (array && key.endsWith("?")) {
    key = key.slice(0, -1);
    optContents = true;
  }

  return { key, optional, array, arrLen, optContents };
}

function validateObject(obj: TypeDefs): ValidatorFn {
  return (val, path, types, strict) => {
    let errors = types.object(val, path, types, strict);
    if (errors.length > 0) return errors;

    let valKeys = Object.keys(val);
    for (const rawKey in obj) {
      const { key, optional, array, arrLen, optContents } = parseKey(rawKey);
      valKeys = valKeys.filter(k => k !== key);

      if (!(key in val) || val[key] === null) {
        if (!optional)
          errors.push({ msg: `missing key '${key}'`, path, type: "val-end" });
        continue;
      }

      const entry = val[key];
      const validator = validatorFor(obj[rawKey]);

      let keypath = path ? `${path}.${key}` : key;
      if (array) {
        let errs = types.array(entry, keypath, types, strict);
        if (errs.length > 0) {
          errors.push(...errs);
          continue;
        }

        errs = validateArrayLength(arrLen, entry, keypath);
        if (errs.length > 0) {
          errors.push(...errs);
          continue;
        }

        for (let i = 0; i < entry.length; ++i) {
          const item = entry[i];
          if (item == null && optContents) continue;
          keypath = `${keypath}[${i}]`;
          errs = validator(item, keypath, types, strict);
          errors.push(...errs);
        }
      } else {
        const errs = validator(entry, keypath, types, strict);
        errors.push(...errs);
      }
    }

    // In strict mode, make sure that there are no extra keys.
    if (strict) {
      for (const key of valKeys) {
        const keypath = path ? `${path}.${key}` : key;
        errors.push({ msg: "extra key", path: keypath, type: "key" });
      }
    }

    return errors;
  };
}

export function typeValidators(custom: TypeDefs): TypeValidators {
  let customValidators: TypeValidators = {};

  for (const key in custom) {
    customValidators[key] = validatorFor(custom[key]);
  }

  return { ...defaultValidators, ...customValidators };
}
