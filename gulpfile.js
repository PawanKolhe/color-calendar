import gulp from "gulp";
import { deleteAsync as del } from "del";
import sass from "gulp-sass";
import * as dartSass from "sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import env from "postcss-preset-env";

const sassCompiler = sass(dartSass);

gulp.task("clean", () => {
  return del(["dist/css/"]);
});

gulp.task("sass", () => {
  return gulp
    .src("src/sass/**/*.scss")
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(gulp.dest("dist/css/"));
});

gulp.task("postcss", () => {
  const plugins = [env(), autoprefixer()];
  return gulp
    .src("dist/css/*.css")
    .pipe(postcss(plugins))
    .pipe(gulp.dest("dist/css/"));
});

gulp.task("copy-types", () => {
  return gulp
    .src("src/types.d.ts")
    .pipe(gulp.dest("dist/"));
});

gulp.task("default", gulp.series(["clean", "sass", "postcss", "copy-types"]));

gulp.task("watch", () => {
  return gulp.watch(
    "src/sass/*.scss",
    { ignoreInitial: false },
    gulp.series(["clean", "sass", "postcss"]),
  );
});
