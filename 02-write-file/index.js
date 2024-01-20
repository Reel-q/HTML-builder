const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const textPath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(textPath, {
  flags: 'a',
});

const interface = readline.createInterface({
  input: stdin,
  output: stdout,
});

console.log('Greetings! Waiting for input');

function inputHandler(input) {
  if (input.toLowerCase() === 'exit') {
    console.log('Done! GLHF');
    process.exit();
  }

  writeStream.write(input + '\n');

  interface.question('Input: ', inputHandler);
}

interface.question('Input: ', inputHandler);

process.on('beforeExit', () => {
  console.log('Done! GLHF');
});
