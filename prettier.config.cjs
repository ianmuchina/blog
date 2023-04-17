module.exports = {
  overrides: [
    {
      files: ["*.html"],
      options: {
        parser: "go-template",
      },
    },
  ],
  printWidth: 80,
  proseWrap: "always",
  htmlWhitespaceSensitivity: "css",

  plugins: [require("prettier-plugin-go-template")],
};
