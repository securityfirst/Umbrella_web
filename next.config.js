const webpack = require('webpack');
const withCSS = require('@zeit/next-css');

/* With CSS Modules */
module.exports = withCSS();

module.exports = {
 	useFileSystemPublicRoutes: false,
};

module.exports = {
	webpack: (config, {}) => {
		config.module.rules.push({
			test: /\.md$/,
			use: 'raw-loader'
		});

		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.ROOT': JSON.stringify(process.env.ROOT),
			})
		);

		return config;
	},
};