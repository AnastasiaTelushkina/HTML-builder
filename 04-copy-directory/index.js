const fs = require('fs');
const path = require('path');
const filesFolder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

function copyDir(filesFolder, copiedFolder) {
  fs.rm(path.join(copiedFolder), {recursive: true, force: true}, err => {
    if (err) console.log(err);
    fs.mkdir(path.join(copiedFolder), {recursive: true}, err => {
      if (err) return console.error(err);
    });
    fs.readdir(filesFolder, {withFileTypes: true}, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          const dir = path.join(filesFolder, file.name);
          const copied = path.join(copiedFolder, file.name);
          if (file.isFile()) {
            fs.copyFile(dir, copied, (err) => {
              if (err) {
                console.log('Error:', err);
              }  
            });
          } else if (file.isDirectory()) {
            copyDir(dir, copied); 
          }
        });
      }
    });
  });
}

copyDir(filesFolder, copiedFolder);