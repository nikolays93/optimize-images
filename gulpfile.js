/** @type {String} Image files extension */
const extension = '**/*.{jpg,jpeg,png,gif,svg,JPG,JPEG,PNG,GIF,SVG}'
/** @type {String} Images folder */
const dir = './high/'
/** @type {String} Path to the destination directory. */
const dest = './'


let gulp = require("gulp")
gulp.imagemin = require('gulp-imagemin')
gulp.newer = require("gulp-newer")
gulp.debug = require("gulp-debug")
gulp.rename = require("gulp-rename")

const imagemin = {
    Pngquant: require("imagemin-pngquant"),
    Zopfli: require("imagemin-zopfli"),
    Mozjpeg: require("imagemin-mozjpeg"),
    Giflossy: require("imagemin-giflossy"),
    // Webp = require("imagemin-webp"),
}


function transliterate(word) {
    var translateData = {'а': 'a','б': 'b','в': 'v','г': 'g','д': 'd','е': 'e','ё': 'e','ж': 'j','з': 'z','и': 'i','й': 'y','к': 'k','л': 'l','м': 'm','н': 'n','о': 'o','п': 'p','р': 'r','с': 's','т': 't','у': 'u','ф': 'f','х': 'h','ц': 'c','ч': 'ch','ш': 'sh','щ': 'shch','ы': 'y','э': 'e','ю': 'yu','я': 'ya','ъ': '','ь': ''}
    return word.split('').map(function(char) {
        return translateData[char] || char;
    }).join("");
}



function escapeImageName(path) {
    return transliterate(path.replace(/ /g, '-').toLowerCase())
        .replace(/[^0-9A-Za-z-_ ]/g, '');
}

gulp.task("default", function(done) {
    return gulp
        .src(dir + extension, { matchBase: true })
        .pipe(gulp.rename(function(path) {
            return {
                dirname: path.dirname,
                basename: escapeImageName(path.basename),
                extname: path.extname.toLowerCase()
            };
        }))
        .pipe(gulp.newer(dest))
        .pipe(gulp.imagemin([
            imagemin.Giflossy({
                optimizationLevel: 3,
                optimize: 3,
                lossy: 2
            }),
            imagemin.Pngquant({
                speed: 5,
                quality: [0.6, 0.8]
            }),
            imagemin.Zopfli({
                more: true
            }),
            imagemin.Mozjpeg({
                progressive: true,
                quality: 90
            }),
            gulp.imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { removeUnusedNS: false },
                    { removeUselessStrokeAndFill: false },
                    { cleanupIDs: false },
                    { removeComments: true },
                    { removeEmptyAttrs: true },
                    { removeEmptyText: true },
                    { collapseGroups: true }
                ]
            })
        ]))
        .pipe(gulp.dest(dest))
        .pipe(gulp.debug({ "title": "Images" }))
});