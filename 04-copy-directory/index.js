const fs = require('fs');
const path = require('path');

const copyDir = () => {
	const distPath = path.resolve(__dirname, 'files-copy');
	const origPath = path.resolve(__dirname, 'files');
	fs.mkdir(distPath, { recursive: true }, (err) => {
		if (err) throw err;
	});
	fs.readdir(origPath, { withFileTypes: true }, (err, files) => {
		if (err) throw err;
		for (let file of files) {
			if (file.isFile()) {
				fs.copyFile(
					path.join(origPath, file.name),
					path.join(distPath, file.name),
					(err) => {
						if (err) throw err;
					}
				);
			}
		}
	});
};

copyDir();
