const fs = require('fs');
const path = require('path'); 
const { mkdir, readdir, rm, access} = fs.promises;

const initFolder = path.basename(__dirname);
const htmlPageFolder = path.resolve(path.basename(__dirname), 'components');
const stylesFolder = path.resolve(initFolder, 'styles');
const projectDistFolder = path.resolve(initFolder, 'project-dist');
const assetsFolder = path.resolve(initFolder, 'assets');
const copiedAssetsFolder = path.resolve(projectDistFolder, 'assets');
  

async function copyDir(source, destination) {
  const dirExistence = await isExist(destination);

  if (dirExistence) {
    await rm(destination, {recursive: true});
  }
 
  await mkdir(destination, {recursive: true});
  await readdir(source, {encoding: 'utf8',withFileTypes: true})
    .then(async(files) => {
      for (let file of files) {
        if (file.isFile()) {
          fs.copyFile(path.resolve(source, file.name), path.resolve(destination, file.name), err => { if (err) console.log(err);});
        } else {
          const newSource = path.resolve(source, file.name);
          const newDestination = path.resolve(destination, file.name);
          copyDir(newSource, newDestination);
        }
      }
    })
    .catch( err => console.log(err)); 
}
async function getHtmlPage(template, componentName, replaceablePart) {
  return new Promise( resolve => {
    const _path = path.resolve(htmlPageFolder, componentName);
    let component = '';
    const stream = fs.createReadStream(_path, 'utf-8');
    stream.on('data', data => {component += data;});
    stream.on('end', () => resolve(template.replace(replaceablePart, component)));
    stream.on('error', err => console.log(err));
  });
}

async function getHtmlTemplate() {

  const htmlTemplatePath = path.resolve(initFolder, 'template.html');
  let htmlTemplate = '';
  const htmlTemplateStream = fs.createReadStream(htmlTemplatePath, 'utf-8');
  htmlTemplateStream.on('data', data => {htmlTemplate += data;});
  htmlTemplateStream.on('end', () => renderPage(htmlTemplate));
  htmlTemplateStream.on('error', err => console.log(err)); 
}

async function renderPage(template) {
  
  let updatedTemplate = template;
  const htmlList = [];  
  await readdir(htmlPageFolder, {encoding: 'utf8',withFileTypes: true})
    .then(async(files) => {
      for (let file of files) if (file.isFile()) htmlList.push(file.name.substring(0, file.name.indexOf('.'))); 
      for( let file of htmlList) updatedTemplate = await getHtmlPage(updatedTemplate, `${file}.html`, `{{${file}}}`);
      fs.access(projectDistFolder, err => {
        if (err) mkdir(projectDistFolder);
        fs.writeFile(path.resolve(projectDistFolder, 'index.html'), updatedTemplate, err => {if (err) console.log(err);});
      });
    })
    .catch( err => console.log(err));
}

function getStylesBundle(_stylesFolder, bundleDestinationFolder) { 
  fs.access(projectDistFolder, err => {
    if (err) mkdir(projectDistFolder);
    fs.writeFile(path.resolve(bundleDestinationFolder, 'style.css'), '', (err) => {if (err) console.log(err);});
  
    readdir(_stylesFolder, {encoding: 'utf8',withFileTypes: true})
      .then( files => {
        for (let file of files) {
          if (path.extname(file.name) === '.css') {
            const readableStream = fs.createReadStream(path.resolve(stylesFolder, file.name));
            readableStream.on('data', data => {
              fs.appendFile(
                path.resolve(bundleDestinationFolder, 'style.css'),
                data + '\n',
                (err) => {if (err) console.log(err);}
              );
            });
          }
        }
      })
      .catch(err => console.log(err));
  });
  
}

async function isExist(path) {
  try{
    await access(path, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  }
  catch (err) {
    if (err) return false;
  }
} 

getStylesBundle(stylesFolder, projectDistFolder);
getHtmlTemplate();
copyDir(assetsFolder, copiedAssetsFolder);