const fsPromises = require('fs').promises;
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distFolderPath, 'bundle.css');

async function mergeStyles() {
  const styles = await fsPromises.readdir(stylesFolderPath);

  const stylesArr = [];
  for (const file of styles) {
    if (path.parse(file).ext === '.css') {
      const filePath = path.join(stylesFolderPath, file);
      const fileContent = await fsPromises.readFile(filePath, 'utf-8');
      stylesArr.push(fileContent);
    }
  }
  await fsPromises.writeFile(bundleFilePath, stylesArr.join('\n'));
  console.log('Styles merged into bundle.css');
}

mergeStyles();
