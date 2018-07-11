const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");

const source = "./src";
const destination = "./public/static";

// Let everyone know gulp is busy
gulp.task("message", function() {
  return console.log("Gulp is running...");
});

// Move the fonts to the location the webserver expects
gulp.task("fonts:copy", () => {
  gulp.src(source + "/fonts/**/*").pipe(gulp.dest(destination + "/fonts"));
});

// Move the css to the location the webserver expects
gulp.task("css:copy", () => {
  gulp.src(source + "/css/**/*").pipe(gulp.dest(destination + "/css"));
});

// Move the images to the location the webserver expects
gulp.task("img:copy", () => {
  gulp.src(source + "/img/**/*").pipe(gulp.dest(destination + "/img"));
});

// Optimize images
gulp.task("img:compress", () => {
  gulp
    .src(source + "/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest(destination + "/img"));
});
// Move the javascript files to the location the webserver expects
gulp.task("js:copy", () => {
  gulp.src(source + "/js/**/*").pipe(gulp.dest(destination + "/js"));
});
// Minify the javascript to decrease the filesize
gulp.task("js:minify", () => {
  gulp
    .src(source + "/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(destination + "/js"));
});
// Compile the sass to css and move the file to the location the webserver expects
// gulp.task("css:compile", () => {
//   gulp
//     .src(source + "/sass/main.scss")
//     .pipe(sass().on("error", sass.logError))
//     .pipe(gulp.dest(destination + "/css"));
// });

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
  // "css:compile,"
  "css:copy"
]);
gulp.task("build", [
  "message",
  "fonts:copy",
  "img:compress",
  // "css:compile",
  "css:minify",
  "js:minify"
]);
