const fs = require("fs"); 
const path = require('node:path'); 
const folderPath = "05-merge-styles/styles"; 
  
 
fs.readdir(folderPath,{withFileTypes: true}, (err, files) => {  
    if (err) throw err;
    const output = fs.createWriteStream("05-merge-styles/bundle.css");
    files.forEach((file) =>{  
        if(file.isFile() && path.parse(file.name).ext === ".css"){  
            console.log(file.name);
            const input = fs.createReadStream(folderPath + "/" + file.name, "utf-8");  
            input.pipe(output);
        }
    });
 });