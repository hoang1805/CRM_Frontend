module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './node_modules/flyonui/dist/js/*.js',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('flyonui'), require('flyonui/plugin')],
};
