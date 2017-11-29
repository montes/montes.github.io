const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

imagemin(['assets/images-src/*.jpg'], 'assets/images', {
	plugins: [
		imageminJpegRecompress({'quality': 'low',
			'accurate': true,
			'min': 35,
			'max': 45})
	]
}).then(() => {
	console.log('Images optimized');
});
