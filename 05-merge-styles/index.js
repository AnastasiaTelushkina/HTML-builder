const fs = require('fs'); 
const folderPath = "05-merge-styles/styles"; 
  
 
fs.readdir(folderPath,{withFileTypes: true}, (err, files) => {  
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