module.exports = {
    extends: [
        'plugin:astro/recommended',
        'plugin:tailwindcss/recommended',
    ],
    plugins: [
        'tailwindcss'
    ],
    overrides: [
        {
            files: ['*.astro'],
            parser: 'astro-eslint-parser',
        }
    ],
    rules: {
        'tailwindcss/classnames-order': 'warn',
        'tailwindcss/no-custom-classname': 'warn',
        'tailwindcss/no-contradicting-classname': 'error',
    },
}