/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');
const webpack = require('webpack');

/** @type WebpackConfig */
const webExtensionConfig = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	target: 'webworker', // extensions run in a webworker context
	entry: {
		'extension': './src/extension.ts',
		'test/suite/index': './src/web/test/suite/index.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, './dist/web'),
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: '../../[resource-path]'
	},
	resolve: {
		mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
		extensions: ['.ts', '.js'], // support ts-files and js-files
		alias: {
			// provides alternate implementation for node module and source files
		},
		fallback: {
			// Webpack 5 no longer polyfills Node.js core modules automatically.
			// see https://webpack.js.org/configuration/resolve/#resolvefallback
			// for the list of Node.js core module polyfills.
			assert: require.resolve('assert'),
            crypto: false,
            os: false, // vscode-jsonrpc dependency not called in web.
            path: false, // vscode-jsonrpc dependency not called in web.
            stream: require.resolve("stream-browserify"),
            constants: require.resolve("constants-browserify"),
            buffer: require.resolve("safe-buffer"),
		}
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader'
			}]
		}]
	},
	plugins: [
        // Resolves Uncaught ReferenceError: Buffer is not defined
        new webpack.ProvidePlugin({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Buffer: ['safe-buffer', 'Buffer'],
        }),
		new webpack.ProvidePlugin({
			process: 'process/browser.js', // provide a shim for the global `process` variable
		}),
	],
	externals: {
		'vscode': 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map', // create a source map that points to the original source file
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	},
};

/** @type WebpackConfig */
const webOpenerConfig = {
    entry: './src/webOpener/webOpener.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    stats: {
        errorDetails: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        // Resolves Uncaught ReferenceError: Buffer is not defined
        new webpack.ProvidePlugin({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Buffer: ['safe-buffer', 'Buffer'],
        }),
        // Resolves ReferenceError: process is not defined
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
          }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js',],
        modules: ['node_modules'],
        fallback: {
            crypto: false, // SSH dependency not called in web.
            os: false, // vscode-jsonrpc dependency not called in web.
            path: false, // vscode-jsonrpc dependency not called in web.
            stream: require.resolve("stream-browserify"),
            constants: require.resolve("constants-browserify"),
            assert: require.resolve("assert/"),
            // Resolves Uncaught ReferenceError: Buffer is not defined
            buffer: require.resolve("safe-buffer"),
        }
    },
    output: {
        filename: 'webOpener.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true
    }
};

module.exports = [ webExtensionConfig, webOpenerConfig ];