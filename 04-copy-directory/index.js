const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, 'files-copy');
const origPath = path.resolve(__dirname, 'files');

const copyDir = async (src, dist) => {
	await fs.promises.rm(dist, { recursive: true, force: true });

	const files = await fs.promises.readdir(src, { withFileTypes: true });
	await fs.promises.mkdir(dist, { recursive: true });
	for (let file of files) {
		const srcPath = path.join(src, file.name);
		const distPath = path.join(dist, file.name);
		if (file.isDirectory()) {
			await copyDir(srcPath, distPath);
		} else {
			await fs.promises.copyFile(srcPath, distPath);
		}
	}
};

copyDir(origPath, distPath);
