module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "airbnb-typescript/base",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3'
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "extraFileExtensions": ['.svelte']
    },
    "plugins": [
        "svelte3",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
