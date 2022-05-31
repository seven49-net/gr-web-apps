// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  plugins: [
    ['@snowpack/plugin-sass', {

    }],
    [
      "snowpack-plugin-rollup-bundle",
      {
        emitHtmlFiles: true,
        preserveSourceFiles: false,

        // equivalent to inputOptions.input from Rollup
        entrypoints: "app.js",


      }
    ]
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  optimize: {
    bundle: true,
    minify: false,
    target: 'es2017',
  }
};
