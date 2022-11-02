const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, 'project-dist');
const assetsPath = path.resolve(__dirname, 'assets');
const htmlPath = path.resolve(__dirname, 'components');
const templatePath = path.resolve(__dirname, 'template.html');

const copyDir = async (src, dist) => {
	const files = await fs.promises.readdir(src, { withFileTypes: true });
	fs.mkdir(dist, { recursive: true }, (err) => {
		if (err) throw err;
	});
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

const bundleCss = async () => {
	const distPath = path.resolve(__dirname, 'project-dist');
	const srcPath = path.resolve(__dirname, 'styles');
	await fs.writeFile(path.join(distPath, 'style.css'), ``, (err) => {
		if (err) console.log(err);
	});
	await fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
		if (err) throw err;
		for (let file of files) {
			if (file.isFile() && path.extname(file.name) === '.css') {
				const style = fs.createReadStream(
					path.join(srcPath, file.name),
					'utf-8'
				);
				style.on('data', (chunk) => {
					fs.appendFile(
						path.join(distPath, 'style.css'),
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

const bundleHtml = async (src, dist) => {
	let output = '';

	const components = await fs.promises.readdir(src, { withFileTypes: true });
	let stream = await fs.promises.readFile(templatePath, 'utf-8');

	fs.promises.writeFile(dist, '', (err) => {
		if (err) throw err;
	});
	for (let component of components) {
		const pathToComponent = path.join(src, component.name);
		const componentExt = path.extname(pathToComponent);
		if (componentExt === '.html' && component.isFile()) {
			const componentName = component.name.split('.')[0];

			const streamComponent = await fs.promises.readFile(
				pathToComponent,
				'utf-8'
			);
			stream = stream.replaceAll(`{{${componentName}}}`, streamComponent);
			console.log(stream);
		}
	}
	// const htmlStream = fs.createWriteStream(dist);
	fs.promises.writeFile(dist, stream, (err) => {
		if (err) throw err;
	});
	// htmlStream.write(stream);
};

(async () => {
	fs.mkdir(distPath, { recursive: true }, (err) => {
		if (err) throw err;
	});
	await copyDir(assetsPath, path.join(distPath, 'assets'));
	await bundleCss();
	await bundleHtml(htmlPath, path.join(distPath, 'index.html'));
})();
