const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const source = "./assets";
const destination = "./public/static";

gulp.task("message", function() {
  return console.log("Gulp is running...");
});

gulp.task("fonts:copy", () => {
  gulp.src(source + "/fonts/**/*").pipe(gulp.dest(destination + "/fonts"));
});

gulp.task("img:copy", () => {
  gulp.src(source + "/img/**/*").pipe(gulp.dest(destination + "/img"));
});

gulp.task("img:compress", () => {
  gulp
    .src(source + "/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest(destination + "/img"));
});

gulp.task("js:copy", () => {
  gulp.src(source + "/js/**/*").pipe(gulp.dest(destination + "/js"));
});

gulp.task("js:minify", () => {
  gulp
    .src(source + "/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(destination + "/js"));
});

gulp.task("css:compile", () => {
  gulp
    .src(source + "/sass/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(destination + "/css"));
});

gulp.task("css:minify", () => {
  return gulp
    .src(destination + "/css/**/*")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(destination + "/css/"));
});

gulp.task("default", [
  "message",
  "fonts:copy",
  "js:copy",
  "img:copy",
  "css:compile"
]);
gulp.task("build", [
  "message",
  "fonts:copy",
  "img:compress",
  "css:compile",
  "css:minify",
  "js:minify"
]);

gulp.task("watch", () => {
  gulp.watch(source + "/**/*", ["default"]);
});
