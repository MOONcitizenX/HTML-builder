const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'text.txt');

const stream = new fs.ReadStream(src, {
	encoding: 'utf-8'
});

stream.on('readable', () => {
	const data = stream.read();
	if (data !== null) console.log(data);
});

stream.on('error', (err) => {
	if (err.code === 'ENOENT') {
		console.log('File not found');
	} else {
		console.log(err);
	}
});
