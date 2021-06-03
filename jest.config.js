module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.ts$": "ts-jest" },
  moduleFileExtensions: ["js", "mjs", "ts"],
  transformIgnorePatterns: [],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/types/grammar.ts"],
  coverageDirectory: "./coverage",
};
