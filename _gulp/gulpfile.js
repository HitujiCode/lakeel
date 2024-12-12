import gulp from "gulp";
const { src, dest, watch, series, parallel } = gulp;
import gulpSass from "gulp-sass";
import dartSass from "sass";
const sass = gulpSass(dartSass);

import plumber from "gulp-plumber";
import notify from "gulp-notify";
import sassGlob from "gulp-sass-glob-use-forward";
import mmq from "gulp-merge-media-queries";
import postcss from "gulp-postcss";
import cssdeclsort from "css-declaration-sorter";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import sourcemaps from "gulp-sourcemaps";
import gulpImagemin from "gulp-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import browserSyncLib from "browser-sync";
const browserSync = browserSyncLib.create();
import changed from "gulp-changed";
import { deleteAsync } from "del";
import webp from "gulp-webp";
import terser from "gulp-terser";

// パス設定
const srcPath = {
  css: "../src/sass/**/*.scss",
  js: "../src/js/**/*",
  img: "../src/images/**/*",
  font: "../src/fonts/**/*",
  html: ["../src/**/*.html", "!./node_modules/**"],
};
const destPath = {
  all: "../dist/**/*",
  css: "../dist/assets/css/",
  js: "../dist/assets/js/",
  img: "../dist/assets/images/",
  font: "../dist/assets/fonts/",
  html: "../dist/",
};

const browsers = [
  "last 2 versions",
  "> 5%",
  "not ie <= 10",
  "ios >= 8",
  "and_chr >= 5",
  "Android >= 5",
];

// HTMLコピー
export const htmlCopy = () => {
  return src(srcPath.html).pipe(dest(destPath.html));
};

// フォントコピー
export const fontCopy = () => {
  return src(srcPath.font).pipe(dest(destPath.font));
};

// CSSコンパイル
export const cssSass = () => {
  return src(srcPath.css)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"),
      })
    )
    .pipe(sassGlob())
    .pipe(
      sass({
        includePaths: ["src/sass"],
        outputStyle: "expanded",
      })
    )
    .pipe(
      postcss([
        autoprefixer({ grid: true }),
        postcssPresetEnv({ browsers }),
        cssdeclsort({ order: "alphabetical" }),
      ])
    )
    .pipe(mmq())
    .pipe(sourcemaps.write("./"))
    .pipe(dest(destPath.css))
    .pipe(
      notify({
        message: "Sassをコンパイルしました！",
        onLast: true,
      })
    );
};

// 画像圧縮
export const imgImagemin = () => {
  return src(srcPath.img)
    .pipe(changed(destPath.img))
    .pipe(
      gulpImagemin(
        [
          imageminMozjpeg({ quality: 80 }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [
              {
                removeViewbox: false,
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(dest(destPath.img))
    .pipe(webp())
    .pipe(dest(destPath.img));
};

// JavaScript圧縮
export const jsMinify = () => {
  return src(srcPath.js)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(terser())
    .pipe(dest(destPath.js));
};

// ブラウザーシンク
const browserSyncOption = {
  notify: false,
  server: "../dist/",
};

export const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

export const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ファイル削除
export const clean = () => {
  return deleteAsync(destPath.all, { force: true });
};

// ファイル監視
export const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload));
  watch(srcPath.js, series(jsMinify, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  watch(srcPath.font, series(fontCopy, browserSyncReload));
  watch(srcPath.html, series(htmlCopy, browserSyncReload));
};

// 開発用タスク
export default series(
  series(cssSass, jsMinify, imgImagemin, htmlCopy),
  parallel(watchFiles, browserSyncFunc)
);

// 本番用タスク
export const build = series(clean, cssSass, jsMinify, imgImagemin, htmlCopy);
