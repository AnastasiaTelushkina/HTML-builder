
const fs = require('fs');
const path = require('node:path'); 
const folderPath = "03-files-in-folder/secret-folder";
fs.readdir(folderPath,{withFileTypes: true}, (err, files) => {  
    files.forEach((file) =>{ 
        if(file.isFile()){ 
            fs.stat(folderPath + "/" + file.name, (error, stats) => {
                let fileSize; 
                let fileName = path.parse(file.name).name;
                let fileExt = path.parse(file.name).ext ? path.parse(file.name).ext.slice(1) : "";   
                if (error) console.log(error); 
                else fileSize = stats.size/1000;  
                console.log(fileName + " - " + fileExt + " - " + fileSize + "kb");
            }); 
        }
    });
 });