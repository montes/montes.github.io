const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

imagemin(['assets/images-src/*.jpg', 'assets/images-src/*.png'], 'assets/images', {
	plugins: [
		imageminJpegRecompress({'quality': 'high',
			'accurate': true,
			'min': 70,
			'max': 85})
	]
}).then(() => {
	console.log('Images optimized');
});
