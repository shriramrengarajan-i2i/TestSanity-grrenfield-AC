// Design guardrails: colours and sizes come from the theme tokens.
export default [
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/\\b[a-z-]+-\\[#[0-9a-fA-F]{3,8}\\]/]",
          message: "Use a design token class, not an arbitrary colour.",
        },
        {
          selector: "JSXAttribute[name.name='style'] Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message: "Use a CSS variable from the design tokens, not a raw colour.",
        },
      ],
    },
  },
];
