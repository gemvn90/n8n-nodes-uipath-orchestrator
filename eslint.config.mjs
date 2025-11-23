// ESLint configuration for n8n-nodes-uipath-orchestrator
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
// import prettier from 'eslint-config-prettier';

export default [
	{
		// Files/directories to ignore from linting (replace deprecated .eslintignore)
		ignores: ['dist/**', 'node_modules/**', '.prettierrc.js', 'coverage/**'],
		files: ['**/*.ts', '**/*.js', '**/*.json'],
		...js.configs.recommended,
		plugins: {
			'@typescript-eslint': typescript,
		},
		languageOptions: {
			parser,
			ecmaVersion: 2020,
			sourceType: 'module',
		},
		// Use TypeScript-aware rule for unused variables and disable base rule
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
		},
		// ...prettier,
	},
];
