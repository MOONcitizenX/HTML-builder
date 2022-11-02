const { readdir } = require('fs');
const fs = require('fs');
const path = require('path');

readdir(
	path.resolve(__dirname, 'secret-folder'),
	{ withFileTypes: true },
	(err, files) => {
		if (err) throw err;
		const direntArr = files.filter((file) => file.isFile());
		direntArr.forEach((file) => {
			const path2file = path.join(__dirname, 'secret-folder', file.name);
			fs.stat(path2file, (err, stats) => {
				if (err) throw err;
				console.log(
					`${file.name.split('.').slice(0, -1).join('')} - ${path
						.extname(path2file)
						.split('')
						.slice(1)
						.join('')} - ${(stats.size / 1000).toFixed(2)} kB`
				);
			});
		});
	}
);
