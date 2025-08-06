import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { dts } from "rollup-plugin-dts";
import { readFileSync } from "fs";
import shebang from "rollup-plugin-preserve-shebang";

const packageJson = JSON.parse(readFileSync("./package.json"));

const config = [
  // Main library build (CJS and ESM)
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/cjs/index.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/esm/index.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**"],
        declaration: false,
      }),
    ],
    external: ["react", "react-dom"],
  },
  // Type definitions for main entry
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
  // CLI build
  {
    input: "src/cli.ts",
    output: [
      {
        file: "dist/cli.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      shebang(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**"],
        declaration: false,
      }),
    ],
  },
  // Parse (Node-only) build
  {
    input: "src/parsers/index.ts",
    output: [
      {
        file: "dist/cjs/parse.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/esm/parse.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**"],
        declaration: false,
      }),
    ],
    external: ["react", "react-dom", "fs", "path", "os", "inspector"],
  },
  // Type-gen (Node-only) build
  {
    input: "src/typegen/index.ts",
    output: [
      {
        file: "dist/cjs/typegen.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/esm/typegen.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**"],
        declaration: false,
      }),
    ],
    external: ["react", "react-dom", "fs", "path", "os", "inspector"],
  },
  // Type definitions for parse entry
  {
    input: "src/parsers/index.ts",
    output: [{ file: "dist/parse.d.ts", format: "esm" }],
    plugins: [dts()],
  },
  // Type definitions for typegen entry
  {
    input: "src/typegen/index.ts",
    output: [{ file: "dist/typegen.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];

export default config;
