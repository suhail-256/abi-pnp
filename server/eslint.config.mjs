import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // 1. Target TypeScript files
  { files: ['**/*.{ts,tsx}'] },

  // 2. Ignore build outputs
  { ignores: ['dist/**', 'build/**'] },

  // 3. Apply recommended base JavaScript rules
  pluginJs.configs.recommended,

  // 4. Apply recommended TypeScript rules
  ...tseslint.configs.recommended,

  // 5. Custom Rules and Overrides
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // Custom JS/TS rules
      'eqeqeq': 'error',
      // 'no-trailing-spaces': 'error',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'warn', // TS-specific rule
      '@typescript-eslint/no-explicit-any': 'warn'  // Warn when using 'any'
    },
  },
];