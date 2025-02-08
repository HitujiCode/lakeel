const { src, dest, watch, series, parallel } = require("gulp"); // Gulpの基本関数
const sass = require("gulp-sass")(require("sass")); // SCSS→CSSコンパイル
const plumber = require("gulp-plumber"); // エラー発生時もタスク継続
const notify = require("gulp-notify"); // エラー・完了通知
const sassGlob = require("gulp-sass-glob-use-forward"); // SCSSインポート簡略化
const mmq = require("gulp-merge-media-queries"); // メディアクエリのマージ
const postcss = require("gulp-postcss"); // CSS変換処理
const autoprefixer = require("autoprefixer"); // ベンダープレフィックス自動付与
const cssdeclsort = require("css-declaration-sorter"); // CSS宣言のソート
const postcssPresetEnv = require("postcss-preset-env"); // 未来のCSS構文対応
const sourcemaps = require("gulp-sourcemaps"); // ソースマップ生成
const babel = require("gulp-babel"); // ES6+→ES5変換
const imageminSvgo = require("imagemin-svgo"); // SVG最適化
const browserSync = require("browser-sync"); // ブラウザ自動リロード
const imagemin = require("gulp-imagemin"); // 画像圧縮
const imageminMozjpeg = require("imagemin-mozjpeg"); // JPEG圧縮
const imageminPngquant = require("imagemin-pngquant"); // PNG圧縮
const changed = require("gulp-changed"); // 変更ファイルのみ処理
const del = require("del"); // ファイル・ディレクトリ削除
const webp = require("gulp-webp"); // WebP変換

// JSONとHTMLテンプレート用プラグイン
const data = require("gulp-data");
const nunjucksRender = require("gulp-nunjucks-render");
const fs = require("fs");
const path = require("path");

// 各種ソースファイルのパス設定
const srcPath = {
  css: "../src/sass/**/*.scss",
  js: "../src/js/**/*",
  img: "../src/images/**/*",
  library: "../src/library/**/*",
  pdf: "../src/pdf/**/*",
  data: "../src/data/**/*",
  // HTMLファイル（テンプレート含む） ※必要に応じて分ける
  html: ["../src/**/*.html", "!./node_modules/**"],
  // nunjucks用テンプレートファイルの配置場所（例：dialog出力用）
  templates: "../src/*.html"
};

// 出力先パス設定
const destPath = {
  all: "../dist/**/*",
  css: "../dist/assets/css/",
  js: "../dist/assets/js/",
  img: "../dist/assets/images/",
  library: "../dist/assets/library/",
  pdf: "../dist/assets/pdf/",
  data: "../dist/data/",
  html: "../dist/"
};

const browsers = [
  "last 2 versions",
  "> 5%",
  "ie = 11",
  "not ie <= 10",
  "ios >= 8",
  "and_chr >= 5",
  "Android >= 5"
];

// ===================================================================
// HTML関連タスク
// ===================================================================

// HTMLをNunjucksでコンパイルし、JSON(modalData.json)の内容をテンプレートに埋め込むタスク
const htmlNunjucks = () => {
  return src(srcPath.templates)
    .pipe(
      data(function (file) {
        // JSONデータのパス（プロジェクト構成に合わせて適宜変更）
        return {
          modals: JSON.parse(
            fs.readFileSync(
              path.join(__dirname, "../src/data/modalData.json")
            )
          )
        };
      })
    )
    .pipe(
      nunjucksRender({
        path: ["../src/"]
      })
    )
    .pipe(dest(destPath.html));
};

// 必要に応じて、その他HTMLのコピータスクも残しておく（ここではコメントアウト）
// const htmlCopy = () => {
//   return src(srcPath.html).pipe(dest(destPath.html));
// };

// ===================================================================
// その他のファイルコピータスク
// ===================================================================

// フォントコピー
const fontCopy = () => {
  return src(srcPath.font).pipe(dest(destPath.font));
};

// ライブラリコピー
const libraryCopy = () => {
  return src(srcPath.library).pipe(dest(destPath.library));
};

// PDFコピー
const pdfCopy = () => {
  return src(srcPath.pdf).pipe(dest(destPath.pdf));
};

// dataコピー
// const dataCopy = () => {
//   return src(srcPath.data).pipe(dest(destPath.data));
// };

// ===================================================================
// SCSSコンパイルタスク
// ===================================================================
const cssSass = () => {
  return src(srcPath.css)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>")
      })
    )
    .pipe(sassGlob())
    .pipe(
      sass.sync({
        includePaths: ["src/sass"],
        outputStyle: "expanded"
      })
    )
    .pipe(
      postcss([
        postcssPresetEnv(),
        autoprefixer({
          grid: true
        })
      ])
    )
    .pipe(
      postcss(
        [cssdeclsort({ order: "alphabetical" })],
        postcssPresetEnv({ browsers: "last 2 versions" })
      )
    )
    .pipe(mmq())
    .pipe(sourcemaps.write("./"))
    .pipe(dest(destPath.css))
    .pipe(
      notify({
        message: "Sassをコンパイルしました！",
        onLast: true
      })
    );
};

// ===================================================================
// 画像圧縮タスク
// ===================================================================
const imgImagemin = () => {
  return src(srcPath.img)
    .pipe(changed(destPath.img))
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 80
          }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [
              {
                removeViewbox: false
              }
            ]
          })
        ],
        {
          verbose: true
        }
      )
    )
    .pipe(dest(destPath.img))
    .pipe(webp())
    .pipe(dest(destPath.img));
};

// ===================================================================
// JavaScriptコンパイルタスク
// ===================================================================
const jsUglify = () => {
  return src(srcPath.js)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(dest(destPath.js));
};

// ===================================================================
// BrowserSync関連タスク
// ===================================================================
const browserSyncOption = {
  notify: false,
  server: "../dist/"
};

const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ===================================================================
// クリーンタスク
// ===================================================================
const clean = () => {
  return del(destPath.all, { force: true });
};

// ===================================================================
// ファイル監視タスク
// ===================================================================
const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload));
  watch(srcPath.js, series(jsUglify, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  watch(srcPath.library, series(libraryCopy, browserSyncReload));
  watch(srcPath.pdf, series(pdfCopy, browserSyncReload));
  // テンプレート（およびHTML）の変更を監視
  watch(srcPath.templates, series(htmlNunjucks, browserSyncReload));
  watch(srcPath.html, series(htmlNunjucks, browserSyncReload));
};

// ===================================================================
// タスクのエクスポート（default, build）
// ===================================================================
exports.default = series(
  series(cssSass, jsUglify, imgImagemin, htmlNunjucks, libraryCopy, pdfCopy),
  parallel(watchFiles, browserSyncFunc)
);

exports.build = series(
  clean,
  cssSass,
  jsUglify,
  imgImagemin,
  htmlNunjucks,
  libraryCopy,
  pdfCopy
);
