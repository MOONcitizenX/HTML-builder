const fs = require('fs');
const path = require('path');

const bundleCss = () => {
	const distPath = path.resolve(__dirname, 'project-dist');
	const srcPath = path.resolve(__dirname, 'styles');
	fs.writeFile(path.join(distPath, 'bundle.css'), ``, (err) => {
		if (err) console.log(err);
	});
	fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
		if (err) throw err;
		for (let file of files) {
			if (file.isFile() && path.extname(file.name) === '.css') {
				const style = fs.createReadStream(
					path.join(srcPath, file.name),
					'utf-8'
				);
				style.on('data', (chunk) => {
					fs.appendFile(
						path.join(distPath, 'bundle.css'),
						chunk,
						(err) => {
							if (err) throw err;
						}
					);
				});
			}
		}
	});
};

bundleCss();
