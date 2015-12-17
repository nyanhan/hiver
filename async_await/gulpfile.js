var gulp = require('gulp-help')(require('gulp'));
var plugins = require('gulp-load-plugins')();


gulp.task("await", "transform ES7 async/await to generator.", () => {
  gulp.src(['js/**/*.babel.js'])
  .pipe(plugins.babel())
  .pipe(plugins.rename((p) => {
    p.basename = p.basename.replace(/\.babel$/i, "");
  }))
  .pipe(gulp.dest("js/"));
});

gulp.task("watch", "auto build when files change", () => {
  gulp.watch('js/**/*.babel.js', ["await"]);
  gulp.run(["await"]);
});


gulp.task('default', false, ["help"]);
