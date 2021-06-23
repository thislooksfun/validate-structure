## [2.0.0](https://github.com/thislooksfun/validate-structure/compare/v1.3.0...v2.0.0) (2021-06-23)


### ⚠ BREAKING CHANGES

* The 'any' matcher no longer matches `null` or
`undefined`. To get the old behavior back, use 'any?' instead.
* The function addPathToMsg() has been renamed to
buildError() to better reflect what it actually does.
* ValidationError.type was optional for backwards
compatibility. It is now required.
* ValidationError.path has been changed from a string
to an array. This fixes the issue of having keys with dots in them
and also allows for easier machine processing of the path for a given
error message.

### Features

* add 'null' and 'undefined' validators ([#8](https://github.com/thislooksfun/validate-structure/issues/8)) ([fb0ff14](https://github.com/thislooksfun/validate-structure/commit/fb0ff14491e114da941d129499655122ed2704f3))
* allow more control over array lengths ([#9](https://github.com/thislooksfun/validate-structure/issues/9)) ([2dd5fd5](https://github.com/thislooksfun/validate-structure/commit/2dd5fd5562b4dd174439d4fbb51d107a527a883e))
* make 'any' only match non-nully values ([1525a32](https://github.com/thislooksfun/validate-structure/commit/1525a32762197dfc08a8341874ec03aed499d67b))
* make ValidationError.path an array ([#7](https://github.com/thislooksfun/validate-structure/issues/7)) ([b98f30a](https://github.com/thislooksfun/validate-structure/commit/b98f30af7fe0a82c9d97d518d843d97d87651c99))
* make ValidationError.type required ([#6](https://github.com/thislooksfun/validate-structure/issues/6)) ([bb840f5](https://github.com/thislooksfun/validate-structure/commit/bb840f5afb9a955025cba376b4ba9784992a7010))
* rename addPathToMsg() to buildError() ([#5](https://github.com/thislooksfun/validate-structure/issues/5)) ([7ba2c54](https://github.com/thislooksfun/validate-structure/commit/7ba2c545ecd83999fd825319c4d9ee40ea85c094))

## [1.3.0](https://github.com/thislooksfun/validate-structure/compare/v1.2.0...v1.3.0) (2021-06-22)


### Features

* add a validator that matches any type ([d1289e1](https://github.com/thislooksfun/validate-structure/commit/d1289e1d9585057ba52454ef6c94c40204cc5ea4))


### Bug Fixes

* point array length errors to the end ([71b8def](https://github.com/thislooksfun/validate-structure/commit/71b8def700a7c5d755d2633fd35cf8a2b2fe8e8d))

## [1.2.0](https://github.com/thislooksfun/validate-structure/compare/v1.1.1...v1.2.0) (2021-06-04)


### Features

* add a type to validation errors ([b678f92](https://github.com/thislooksfun/validate-structure/commit/b678f920dbd9c93e4ea68d191e8e699785012467))

### [1.1.1](https://github.com/thislooksfun/validate-structure/compare/v1.1.0...v1.1.1) (2021-06-04)


### Bug Fixes

* use correct keywords ([a78cfa8](https://github.com/thislooksfun/validate-structure/commit/a78cfa8f0d5bc8f31aa379acb80dd8875e1c3f1c))

## [1.1.0](https://github.com/thislooksfun/validate-structure/compare/v1.0.0...v1.1.0) (2021-06-03)


### Features

* export type `ValidationError` ([80c63b7](https://github.com/thislooksfun/validate-structure/commit/80c63b7f79cf33bb43575728161971b31c660dab))

## 1.0.0 (2021-06-03)


### Features

* create an object structure validator ([68ada39](https://github.com/thislooksfun/validate-structure/commit/68ada392c8ac448d92401d03df058cfa95fda2e2))
