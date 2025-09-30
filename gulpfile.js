import autoprefixer from "autoprefixer";
import { deleteAsync as del } from "del";
import gulp from "gulp";
import postcss from "gulp-postcss";
import sass from "gulp-sass";
import env from "postcss-preset-env";
import * as dartSass from "sass";

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
  return gulp.src("dist/css/*.css").pipe(postcss(plugins)).pipe(gulp.dest("dist/css/"));
});

gulp.task("default", gulp.series(["clean", "sass", "postcss"]));

gulp.task("watch", () => {
  return gulp.watch(
    "src/sass/*.scss",
    { ignoreInitial: false },
    gulp.series(["clean", "sass", "postcss"])
  );
});
