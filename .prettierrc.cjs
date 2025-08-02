/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn', 'clsx', 'cva'],
};
