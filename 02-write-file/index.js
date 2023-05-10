const { stdin, stdout } = process;
const fs = require('fs');
const output = fs.createWriteStream('02-write-file\\result.txt');

stdout.write('Hello! Enter your text:\n');
stdin.on('data', data => {  
  const dataStringified = data.toString('utf8'); 
  if(dataStringified != 'exit\r\n')  output.write(dataStringified); 
  else process.exit();  
}); 
process.on('exit', () => stdout.write('Text saved'));
process.on('SIGINT', () => process.exit()); 
 
 