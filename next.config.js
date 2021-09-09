const withTM = require("next-transpile-modules")(["three"])
module.exports = withTM({
	future: {
	  webpack5: true
	},
	webpack: (config, options) => {

		config.module.rules.push({
			test: /\.(glsl|frag|vert)$/,
			use: [
				options.defaultLoaders.babel,
				{ loader: "raw-loader" },
				{ loader: "glslify-loader" },
			],
			exclude: /node_modules/,
		});

		return config;
	},
})
