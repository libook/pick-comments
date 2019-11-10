/**
 * ESLint
 */

'use strict';

module.exports = {
    "root": true,
    "env": {
        "node": true,
    },
    "parserOptions": {
        "ecmaVersion": 2019,
        "sourceType": "script",
        "ecmaFeatures": {
            "impliedStrict": true,
        },
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
            },
        ],
        "comma-dangle": ["error", "always-multiline"],
        "semi": ["error", "always"],
        "no-var": "error",
        "prefer-const": "error",
        "consistent-return": "error",
        "eqeqeq": "error",
        "no-implicit-coercion": "error",
        "function-paren-newline": ["error", "consistent"],
        "no-const-assign": "error",
        "symbol-description": "error",
        /**
         * These below won't affect the program.
         * But not recommended.
         */
        "no-debugger": "warn",
        "no-extra-boolean-cast": "warn",
        "no-multi-spaces": "warn",
        "no-useless-return": "warn",
        "yoda": "warn",
        "eol-last": ["warn", "always"],
        "no-unneeded-ternary": "warn",
        "no-useless-computed-key": "warn",
    },
};
