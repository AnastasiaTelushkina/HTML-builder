const fs = require('fs'); 
const initPath = "04-copy-directory/files";
const copyPath = "04-copy-directory/files-copy";
 
fs.mkdir(copyPath, { recursive: true }, (err) => { if (err) throw err;}); 
 
fs.readdir(initPath,{withFileTypes: true}, (err, files) => {  
    if (err) throw err;
    files.forEach((file) =>{ 
        if(file.isFile()){   
            fs.copyFile(copyPath + "/"+ file.name, copyPath + "/"+ file.name, (err) => {
                if (err)  console.log("Error Found:", err); 
                else console.log(initPath + "/"+ file.name + " copied"); 
            });
        }
    });
 });