const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

imagemin(['assets/images-src/*.jpg'], 'assets/images', {
	plugins: [
		imageminJpegRecompress({'quality': 'high',
			'accurate': true,
			'min': 65,
			'max': 80})
	]
}).then(() => {
	console.log('Images optimized');
});
