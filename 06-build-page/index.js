const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const styles = path.resolve(__dirname, 'styles');
const distPath = path.resolve(__dirname, 'project-dist');
const assetsPath = path.resolve(__dirname, 'assets');
const htmlPath = path.resolve(__dirname, 'components');
const templatePath = path.resolve(__dirname, 'template.html');

const copyDir = async (src, dist) => {
	const files = await fs.promises.readdir(src, { withFileTypes: true });
	await fs.promises.mkdir(dist, { recursive: true }, (err) => {
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

const bundleHtml = async (src, dist) => {
	const components = await fs.promises.readdir(src, { withFileTypes: true });
	let htmlString = await fs.promises.readFile(templatePath, 'utf-8');

	await fs.promises.writeFile(dist, '', (err) => {
		if (err) throw err;
	});
	for (let component of components) {
		const pathToComponent = path.join(src, component.name);
		const componentExt = path.extname(pathToComponent);
		if (componentExt === '.html' && component.isFile()) {
			const componentName = path.basename(pathToComponent, componentExt);
			const componentContent = await fs.promises.readFile(
				pathToComponent,
				'utf-8'
			);
			htmlString = htmlString.replaceAll(
				`{{${componentName}}}`,
				componentContent
			);
		}
	}
	await fs.promises.writeFile(dist, htmlString, (err) => {
		if (err) throw err;
	});
};

(async () => {
	await fs.promises.rm(distPath, { recursive: true, force: true });
	await fs.promises.mkdir(distPath, { recursive: true });
	await copyDir(assetsPath, path.join(distPath, 'assets'));
	await bundleCss(styles, distPath, 'style.css');
	await bundleHtml(htmlPath, path.join(distPath, 'index.html'));
})();
