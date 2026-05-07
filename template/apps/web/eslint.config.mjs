import nextConfig from "eslint-config-next";
import tsConfig from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
export default [...nextConfig, ...tsConfig];
