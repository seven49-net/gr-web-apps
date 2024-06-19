import terser from "@rollup/plugin-terser";
export default {
  input: "src/js/app.js",
  output: {
    file: "dist/js/app.js",
    format: "umd",
  },
  plugins: [terser()],
};
