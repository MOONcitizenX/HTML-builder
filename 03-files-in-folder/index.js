const { readdir } = require('fs');
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'secret-folder');

readdir(src, { withFileTypes: true }, (err, files) => {
	if (err) throw err;
	const direntArr = files.filter((file) => file.isFile());
	direntArr.forEach((file) => {
		const path2file = path.join(src, file.name);
		fs.stat(path2file, (err, stats) => {
			if (err) throw err;
			console.log(
				`${path.basename(path2file, path.extname(path2file))} - ${path
					.extname(path2file)
					.slice(1)} - ${stats.size} bytes`
			);
		});
	});
});
