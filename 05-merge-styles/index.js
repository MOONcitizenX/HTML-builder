const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const distPath = path.resolve(__dirname, 'project-dist');
const srcPath = path.resolve(__dirname, 'styles');

const bundleCss = async (src, dist, distFile) => {
	await fs.promises.writeFile(path.join(dist, distFile), ``);
	const files = await fs.promises.readdir(src, { withFileTypes: true });
	for (let file of files) {
		if (file.isFile() && path.extname(file.name) === '.css') {
			await pipeline(
				fs.createReadStream(path.join(src, file.name), 'utf-8'),
				fs.createWriteStream(path.join(dist, distFile), {
					encoding: 'utf-8',
					flags: 'a'
				})
			);
		}
	}
};

bundleCss(srcPath, distPath, 'bundle.css');

exports.bundleCss = bundleCss;
