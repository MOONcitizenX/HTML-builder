const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const path = require('path');

const distPath = path.resolve(__dirname, 'text.txt');

const rl = readline.createInterface({ input, output });
const fileStream = fs.createWriteStream(distPath);

rl.question('Enter your text: \n', (answer) => {
	if (answer === 'exit') {
		console.log('\nThank you! Goodbye!');
		process.exit();
	} else {
		fileStream.write(`${answer}\n`);
	}

	rl.on('line', (line) => {
		if (line === 'exit') {
			console.log('\nThank you! Goodbye!');
			process.exit();
		} else {
			fileStream.write(`${line}\n`);
		}
	});
});

process.on('beforeExit', () => {
	console.log('\nThank you! Goodbye!');
});
