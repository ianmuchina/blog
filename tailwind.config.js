const colors = require("tailwindcss/colors");

module.exports = {
  content: ['layouts/**/*.html'],
  theme: {
    fontFamily: {
      'sans': [
        "Inter", "InterVariable",
        'ui-sans-serif', 'system-ui', '-apple-system',
        'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial',
        "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji", "sans-serif"
      ],
      'mono': [
        "iA Writer Mono",
        'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco',
        'Consolas', "Liberation Mono", "Courier New", 'monospace',
      ],
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
  ],
};
