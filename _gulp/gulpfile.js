const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sassGlob = require("gulp-sass-glob-use-forward");
const mmq = require("gulp-merge-media-queries");
const postcss = require("gulp-postcss");
const cssdeclsort = require("css-declaration-sorter");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const sourcemaps = require("gulp-sourcemaps");
const imageminSvgo = require("imagemin-svgo");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const del = require("del");
const webp = require("gulp-webp");
const terser = require("gulp-terser");

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
const htmlCopy = () => {
  return src(srcPath.html).pipe(dest(destPath.html));
};

// フォントコピー
const fontCopy = () => {
  return src(srcPath.font).pipe(dest(destPath.font));
};

// CSSコンパイル
const cssSass = () => {
  return src(srcPath.css)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"),
      })
    )
    .pipe(sassGlob())
    .pipe(
      sass.sync({
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
const imgImagemin = () => {
  return src(srcPath.img)
    .pipe(changed(destPath.img))
    .pipe(
      imagemin(
        [
          imageminMozjpeg({ quality: 80 }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [{ removeViewbox: false }],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(destPath.img))
    .pipe(webp())
    .pipe(dest(destPath.img));
};

// JavaScript圧縮
const jsMinify = () => {
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
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ファイル削除
const clean = () => {
  return del(destPath.all, { force: true });
};

// ファイル監視
const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload));
  watch(srcPath.js, series(jsMinify, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  watch(srcPath.font, series(fontCopy, browserSyncReload));
  watch(srcPath.html, series(htmlCopy, browserSyncReload));
};

// 開発用タスク
exports.default = series(
  series(cssSass, jsMinify, imgImagemin, htmlCopy),
  parallel(watchFiles, browserSyncFunc)
);

// 本番用タスク
exports.build = series(clean, cssSass, jsMinify, imgImagemin, htmlCopy);
