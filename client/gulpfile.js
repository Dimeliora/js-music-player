'use strict';

const fs = require('fs');
const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const htmlMin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const groupMediaQueries = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpackStream = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
const realFavicon = require('gulp-real-favicon');
const browserSync = require('browser-sync').create();

const SRC_PATH = './src';
const DEST_PATH = './dist';
const FAVICON_DESIGN_PATH = `${SRC_PATH}/favicon/favicon-design.json`;
const FAVICON_DATA_PATH = `${SRC_PATH}/favicon/favicon-data.json`;
const IS_PROD = process.env.NODE_ENV === 'production';
const WEBPACK_MODE = IS_PROD ? 'production' : 'development';

// ======== HTML Handler ========
const html = () =>
    src(`${SRC_PATH}/*.html`)
        .pipe(
            gulpIf(
                IS_PROD,
                htmlMin({
                    collapseWhitespace: true,
                    removeComments: true,
                })
            )
        )
        .pipe(dest(DEST_PATH));

// ======== SCSS Handler ========
const scss = () =>
    src(`${SRC_PATH}/scss/styles.scss`, { allowEmpty: true })
        .pipe(gulpIf(!IS_PROD, sourcemaps.init()))
        .pipe(
            sass({
                outputStyle: 'expanded',
            })
        )
        .pipe(groupMediaQueries())
        .pipe(
            autoprefixer({
                cascade: true,
                grid: true,
            })
        )
        .pipe(
            gulpIf(
                IS_PROD,
                csso({
                    comments: false,
                })
            )
        )
        .pipe(gulpIf(!IS_PROD, sourcemaps.write('.')))
        .pipe(dest(DEST_PATH))
        .pipe(browserSync.stream());

// ======== JS Handler ========
const js = () =>
    src(`${SRC_PATH}/js/index.js`, { allowEmpty: true })
        .pipe(
            webpackStream({
                mode: WEBPACK_MODE,
                output: {
                    filename: 'script.js',
                },
                devtool: IS_PROD ? false : 'eval-source-map',
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            exclude: /(node_modules)/,
                            use: 'babel-loader',
                        },
                    ],
                },
            })
        )
        .pipe(dest(DEST_PATH))
        .pipe(browserSync.stream());

// ======== Images Handler ========
const images = () =>
    src(`${SRC_PATH}/images/**/*.*`)
        .pipe(rename({ dirname: '' }))
        .pipe(newer(`${DEST_PATH}/images`))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
            ])
        )
        .pipe(dest(`${DEST_PATH}/images`), {});

// ======== WebP Converter ========
const webpConvert = () =>
    src(`${SRC_PATH}/images/**/*.{png,jpg}`)
        .pipe(rename({ dirname: '' }))
        .pipe(newer(`${DEST_PATH}/images`))
        .pipe(
            webp({
                quality: 80,
            })
        )
        .pipe(dest(`${DEST_PATH}/images`));

// ======== SVG Icon Maker ========
const svg = () =>
    src(`${SRC_PATH}/icons/**/*.svg`)
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        sprite: '../icon-sprite.svg',
                    },
                },
                shape: {
                    transform: [
                        {
                            svgo: {
                                plugins: [
                                    { removeViewBox: false },
                                    { cleanupIDs: false },
                                    { removeAttrs: { attrs: '(fill|stroke)' } },
                                ],
                            },
                        },
                    ],
                },
            })
        )
        .pipe(dest(`${DEST_PATH}/icons`));

// ======== Fonts Copy Handler ========
const fonts = () =>
    src(`${SRC_PATH}/fonts/*.*`).pipe(dest(`${DEST_PATH}/fonts`));

// ======== Favicons Generation Handler ========
const makeFavicons = (done) =>
    realFavicon.generateFavicon(
        {
            masterPicture: `${SRC_PATH}/favicon/favicon.png`,
            dest: `${DEST_PATH}/icons`,
            iconsPath: '/icons',
            design: JSON.parse(fs.readFileSync(FAVICON_DESIGN_PATH)),
            settings: {
                scalingAlgorithm: 'Mitchell',
                errorOnImageTooSmall: false,
                readmeFile: false,
                htmlCodeFile: false,
                usePathAsIs: false,
            },
            markupFile: FAVICON_DATA_PATH,
        },
        done
    );

// ======== Favicons Injection Handler ========
const injectFavicons = () =>
    src(`${DEST_PATH}/*.html`)
        .pipe(
            realFavicon.injectFaviconMarkups(
                JSON.parse(fs.readFileSync(FAVICON_DATA_PATH)).favicon.html_code
            )
        )
        .pipe(
            gulpIf(
                IS_PROD,
                htmlMin({
                    collapseWhitespace: true,
                    removeComments: true,
                })
            )
        )
        .pipe(dest(DEST_PATH, { overwrite: true }));

// ======== Favicons Data remove ========
const clearFaviconData = () => del(FAVICON_DATA_PATH);

// ======== Dist Clear ========
const clearDist = () => del(DEST_PATH);

// ======== Dev server ========
const devServer = () => {
    browserSync.init({
        server: {
            baseDir: DEST_PATH,
        },
        port: 8080,
        notify: false,
    });
};

// ======== Watchers ========
const watchers = () => {
    watch(`${SRC_PATH}/*.html`, html).on('change', browserSync.reload);
    watch(`${SRC_PATH}/scss/**/*.scss`, scss);
    watch(`${SRC_PATH}/js/**/*.js`, js);
    watch(`${SRC_PATH}/images/**/*.*`, parallel(images, webpConvert));
    watch(`${SRC_PATH}/icons/**/*.svg`, svg);
};

// ======== Build Task ========
const build = series(
    clearDist,
    parallel(html, scss, js, images, webpConvert, svg, fonts),
    series(makeFavicons, injectFavicons, clearFaviconData)
);

// ======== Build & Serve Task ========
const serve = series(build, parallel(devServer, watchers));

// ======== Exports ========
exports.build = build;
exports.serve = serve;
