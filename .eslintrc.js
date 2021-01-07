module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        /*'plugin:import/errors', 'plugin:import/warnings'*/
    ],
    ignorePatterns: ['dist', 'node_modules'],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        curly: 'error',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
}
