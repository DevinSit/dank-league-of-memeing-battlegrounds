const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "src", "styles")]
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        // Disable SVG optimizations since it seems to strip `stopColor`s
                        // from linear gradients, resulting in colorless SVG graphics.
                        svgo: false
                    }
                }
            ]
        });

        return config;
    }
};
