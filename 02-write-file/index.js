const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const path = require('path');

const rl = readline.createInterface({ input, output });

rl.question('Enter your text: \n', (answer) => {
	fs.writeFile(path.resolve(__dirname, 'text.txt'), `${answer}\n`, (err) => {
		if (err) console.log(err);
	});

	rl.on('line', (line) => {
		if (line === 'exit') {
			console.log('\nThank you! Goodbye!');
			process.exit();
		} else {
			fs.appendFile(
				path.resolve(__dirname, 'text.txt'),
				line + '\n',
				(err) => {
					if (err) console.log(err);
				}
			);
		}
	});
});

process.on('beforeExit', () => {
	console.log('\nThank you! Goodbye!');
});
