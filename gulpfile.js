"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const ttfToWoff2 = require("gulp-ttf2woff2");

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function () {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
        grid: "autoplace",
      })
    )
    .pipe(gulp.dest("./css"))
    .pipe(sourcemaps.write("."))
});

// Convert ttf font to woff2
gulp.task("ttfToWoff2", function () {
  return gulp
    .src("./fonts/*.ttf")
    .pipe(ttfToWoff2())
    .pipe(gulp.dest("./fonts/"));
});

gulp.task("default", function () {
  gulp.watch(["./scss/*.scss", "./scss/**/*.scss"], gulp.series("sass"));
});
gulp.task("build", gulp.series("ttfToWoff2"));
