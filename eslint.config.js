import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    plugins: { js, '@stylistic': stylistic },
    extends: ['js/recommended'],
    rules: {

      'eqeqeq': 'error',
      'no-console': 0,

      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }]
    }
  },

  globalIgnores(['dist/**'])
])