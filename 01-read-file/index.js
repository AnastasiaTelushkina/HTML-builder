const fs = require('fs');   
var stream = new fs.ReadStream('01-read-file\\text.txt', {encoding: 'UTF-8'});

stream.on('readable', function(){
  var data = stream.read();
  if(data != null) console.log(data);
}); 