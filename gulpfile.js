var spritesmith = require('spritesmith-texturepacker');
var gulp = require('gulp');

gulp.task('sprite', function() {
  return gulp.src('bonusPanel/*.png')
    .pipe(spritesmith({
      imgName: "scubaman.png",
      cssName: "scubaman.json",
      algorithm: 'binary-tree',
      cssTemplate: require('spritesmith-texturepacker') // <-- this right here
    }))
    .pipe(gulp.dest('./dist/gfx/'));
});
