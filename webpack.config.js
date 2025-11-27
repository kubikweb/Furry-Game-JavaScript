const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./js/app.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'index.html', to: 'index.html' },
                { from: 'css', to: 'css' },
                { from: 'images/furry2 (1).png', to: 'images/furry2 (1).png' },
                { from: 'images/bitcoin.png', to: 'images/bitcoin.png' }
            ]
        })
    ]
};
