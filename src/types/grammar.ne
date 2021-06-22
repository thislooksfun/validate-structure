@preprocessor typescript
@builtin "number.ne"
@{%
import {
  ArrayNode,
  OptionalNode,
  TupleNode,
  TypeNode,
  UnionNode,
} from "./nodes";
%}

char[X] -> $X {% () => null %}
charSepItems[X] -> item (char[$X] item):* {% d => [d[0], ...d[1].map((e: any) => e[1])] %}

union -> charSepItems["|"] {% d => d[0].length === 1 ? d[0][0] : new UnionNode(d[0]) %}

item ->
    optional {% id %}
  | nonOptional {% id %}

nonOptional ->
    group {% id %}
  | array {% id %}
  | tuple {% id %}
  | type {% id %}

optional -> nonOptional char["?"] {% d => new OptionalNode(d[0]) %}

group -> char["("] union char[")"] {% d => d[1] %}

array -> item char["["] lengthRange char["]"] {% d => new ArrayNode(d[0], d[2]) %} #"

tuple -> char["["] charSepItems[","] char["]"] {% d => new TupleNode(d[1]) %} #"

lengthRange -> (minMaxRange | minRange | maxRange | length):? {% d => d[0] === null ? {} : d[0][0] %}
length ->
    "." {% () => ({min: 1}) %}
  | int {% d => ({ min: d[0], max: d[0] }) %}
minRange -> int "..." {% d => ({ min: d[0] }) %}
maxRange -> "..." int {% d => ({ max: d[1] }) %}
minMaxRange -> int "..." int {% d => ({ min: d[0], max: d[2] }) %}

type -> asciiStr {% d => new TypeNode(d[0]) %}
asciiStr -> ascii:* {% d => d[0].join("") %}

ascii -> [a-zA-Z0-9] {% id %}
