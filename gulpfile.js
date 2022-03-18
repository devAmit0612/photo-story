// Gulp APIs
const gulp = require('gulp');
const { 
	src, 
	dest,
	watch,
	series, 
	parallel } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');

const uglify = require('gulp-uglify-es').default;

const rename = require("gulp-rename");

// Rollup plugins
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');

// json files
const package = require('./package.json');
const config = require('./config.json');
const es6 = config.es6;

const sync = require('browser-sync').create();
const del = require('del');

const rollupBanner = [
	'/**',
	' * Photo Story is a ' + package.description,
	' * @version ' + package.version,
	' * @author ' + package.author,
	' * @email ' + package.email,
	' * @license ' + package.license,
	' */',
	''
].join('\n');


/**
 * Get end filename from path
 * @param path
 * @returns {string}
 */
const baseFileName = (path) => {
	if (path !== undefined) {
		const maybeFile = path.split('/').pop();
		if (maybeFile.indexOf('.') !== -1) {
			return maybeFile;
		}
		return '';
	}
}

const rootFile = (type) => {
	const file = config.files[type].src;
	const regex = new RegExp(/\{\$.*?\}/);
    const matched = file.match(regex);

	if (matched) {
		const root = config.root;
		return file.replace(matched[0], root);
	}	
}

const outputFile = (type, minify = false) => {
	const file = config.files[type].output;
	const regex = new RegExp(/\{\$.*?\}/);
    const matched = file.match(regex);

	if (matched) {
		let path = '';
		const output = config.output;
		
		if (minify) {
			const filePath = file.replace(matched[0], output).split('.');
			path = filePath[0] + '.min.' + filePath[1];
		} else {
			path = file.replace(matched[0], output);
		}
		
		return {
			path: path.replace(baseFileName(path), ''),
			name: baseFileName(path)
		}
	}	
}

const getOutputFilePath = (type) => {
	return Object.values(outputFile(type)).join('');
}


// Clean generated file
const clean = async () => {
    return del.sync(config.output, {force: true});
}

const generate = (bundle) => {
	return bundle.write({
		file: getOutputFilePath('scripts'),
		format: es6.format,
		name: es6.module,
		sourcemap: true,
		banner: rollupBanner
	});
}

const scssConvert = (compressed = false) => {
	return sass({
		outputStyle: compressed ? 'compressed' : 'expanded',
		errLogToConsole: true,
		includePaths: rootFile('styles')
	}).on('error', sass.logError);
}

const liveServer = (done) => {
	sync.init({
        injectChanges: true,
        server: {
            baseDir: './' + config.output
        }
    });
	done();
}

const reloadServer = (done) => {
	sync.reload();
	done();
}

const jsBuild = async () => {
    return rollup
    .rollup({
		input: rootFile('scripts'),
		plugins: [
			babel({
				presets: [ ['@babel/preset-env', { modules: false }] ],
				plugins: [ ['@babel/transform-runtime', { regenerator: true }] ],
				runtimeHelpers: true,
				exclude: 'node_modules/**',
				babelrc: false
			}),
			json({
				indent: '  ',
				namedExports: true
			}),
			resolve(),
			commonjs()
		]
    })
    .then(bundle => {
		generate(bundle);
    });
}

const cssBuild = () => {
	const output = outputFile('styles');
	
	return src(rootFile('styles'))
	.pipe(scssConvert())
	.pipe(autoprefixer())
	.pipe(dest(output.path))
	.pipe(sync.stream());
}

const copyFiles = async () => {
	for (const asset of config.assets) {
		const output = outputFile(asset);
		src(rootFile(asset)).pipe(dest(output.path));
	}
}

const htmlFile = () => {
	const output = outputFile('html');
	return src(rootFile('html'))
	.pipe(dest(output.path));
}

const compressJs = () => {
	const output = outputFile('scripts', true);
	
	return src(getOutputFilePath('scripts'), { sourcemaps: true })
	.pipe(uglify())
	.pipe(rename(output.name))
	.pipe(dest(output.path, { sourcemaps: '.' }));
}

const compressCss = () => {
	const output = outputFile('styles', true);
	
	return src(getOutputFilePath('styles'), { sourcemaps: true })
	.pipe(cleanCss({debug: config.debug}))
	.pipe(rename(output.name))
	.pipe(dest(output.path, { sourcemaps: '.' }));
}

const serve = async () => {
	const scriptFileName = baseFileName(rootFile('scripts'));
	const scriptsPath = rootFile('scripts').replace(scriptFileName, '');
	
	watch(rootFile('styles'), series(cssBuild));
	watch(scriptsPath, series(jsBuild, reloadServer));
	watch(rootFile('html'), series(htmlFile, reloadServer));
}

// build
// const cleanup = parallel(clean);
// const build = parallel(jsBuild, cssBuild, copyFiles);

// Exports gulp commands
// exports.build = series(cleanup, build);
// exports.prod = series(build, parallel(compressJs, compressCss));
// exports.serve = series(liveServer, serve);

const build = series(clean, parallel(jsBuild, cssBuild, copyFiles))

// Exports gulp commands
exports.build = build;
exports.prod = series(build, parallel(compressJs, compressCss));
exports.serve = series(liveServer, serve);