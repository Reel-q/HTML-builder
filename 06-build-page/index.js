const path = require('path');
const fsPromises = require('fs').promises;

const distFolderPath = path.join(__dirname, 'project-dist');
const componentsFolderPath = path.join(__dirname, 'components');
const templateFilePath = path.join(__dirname, 'template.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');

async function buildBundle() {
  await fsPromises.mkdir(distFolderPath, { recursive: true });

  //Template replacing
  const templates = await fsPromises.readFile(templateFilePath, 'utf-8');
  let newTemplates = templates;

  const findTags = (string) => {
    const tagsArr = [];
    let start = 0;

    while (1) {
      const firstIndex = string.indexOf('{{', start);
      if (firstIndex === -1) {
        break;
      }

      const lastIndex = string.indexOf('}}', firstIndex);
      if (lastIndex === -1) {
        break;
      }

      const tag = string.slice(firstIndex + 2, lastIndex).trim();
      tagsArr.push(tag);

      start = lastIndex + 2;
    }

    return tagsArr;
  };

  const tagsArr = findTags(templates);

  if (tagsArr.length > 0) {
    for (const tag of tagsArr) {
      const componentFilePath = path.join(componentsFolderPath, `${tag}.html`);

      const component = await fsPromises.readFile(componentFilePath, 'utf-8');
      newTemplates = newTemplates.replace(`{{${tag}}}`, component);
    }
  }

  const indexPath = path.join(distFolderPath, 'index.html');
  await fsPromises.writeFile(indexPath, newTemplates);

  // Styles merging
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
}

buildBundle();
