/** @type {import('prettier').Config} */

module.exports = {
  // $schema: 'https://json.schemastore.org/prettierrc',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^@/(.*)$', '', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  jsxSingleQuote: true,
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
  plugins: [
    'prettier-plugin-sh',
    'prettier-plugin-packagejson',
    'prettier-plugin-sort-json',
    'prettier-plugin-two-style-order',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  printWidth: 100,
  proseWrap: 'never',
  quoteProps: 'consistent',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};
