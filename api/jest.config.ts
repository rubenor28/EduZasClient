/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */

import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const preset = createDefaultEsmPreset();

const config: Config = {
  ...preset,
  verbose: true,
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^server$": "<rootDir>/src/server.ts",
    "^config$": "<rootDir>/src/config.ts",
    "^persistence/(.*)$": "<rootDir>/src/persistence/$1",
    "^business/(.*)$": "<rootDir>/src/business/$1",
    "^presentation/(.*)$": "<rootDir>/src/presentation/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
