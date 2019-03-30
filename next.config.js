const webpack = require('webpack');
const withCSS = require('@zeit/next-css');

/* With CSS Modules */
module.exports = withCSS({
	useFileSystemPublicRoutes: false,
	webpack: (config, {}) => {
		config.module.rules.push({
			test: /\.md$/,
			use: 'raw-loader'
		});

		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.ROOT': JSON.stringify(process.env.ROOT),
				'process.env.ENABLE_MOCK': JSON.stringify(process.env.ENABLE_MOCK),
				'process.env.MAPBOX_ACCESS_TOKEN': JSON.stringify(process.env.MAPBOX_ACCESS_TOKEN),
			})
		);

		return config;
	},
})