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
  console.log('html created');

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
  const stylesFilePath = path.join(distFolderPath, 'style.css');
  await fsPromises.writeFile(stylesFilePath, stylesArr.join('\n'));
  console.log('css created');

  //Assets folder copying

  const copyAssets = async () => {
    const assetsDistPath = path.join(distFolderPath, 'assets');
    await fsPromises.mkdir(assetsDistPath, { recursive: true });

    const currentDistAssets = await fsPromises.readdir(assetsDistPath);
    for (const item of currentDistAssets) {
      const itemPath = path.join(assetsDistPath, item);
      const info = await fsPromises.stat(itemPath);
      if (info.isFile()) {
        await fsPromises.unlink(path.join(assetsDistPath, item));
      } else if (info.isDirectory()) {
        const currentFolderPath = path.join(assetsDistPath, item);
        const currentFolderItem = await fsPromises.readdir(currentFolderPath);
        currentFolderItem.forEach(async (file) => {
          const currentFolderItemPath = path.join(currentFolderPath, file);
          await fsPromises.unlink(path.join(currentFolderItemPath));
        });
        await fsPromises.rm(itemPath, { recursive: true });
      }
    }

    const assetsFolderItems = await fsPromises.readdir(assetsFolderPath);
    for (const asset of assetsFolderItems) {
      const assetPath = path.join(assetsFolderPath, asset);
      const info = await fsPromises.lstat(assetPath);

      if (info.isFile()) {
        const assetDistPath = path.join(assetsDistPath, asset);
        await fsPromises.copyFile(assetPath, assetDistPath);
      } else if (info.isDirectory()) {
        const anotherFolderPath = path.join(assetsFolderPath, asset);
        const anotherFolderCopyPath = path.join(assetsDistPath, asset);
        await fsPromises.mkdir(anotherFolderCopyPath, { recursive: true });
        // console.log('dir created');

        const assetsInFolderItem = await fsPromises.readdir(anotherFolderPath);

        for (const asset of assetsInFolderItem) {
          const assetPath = path.join(anotherFolderPath, asset);
          //   console.log(assetPath);
          const assetDistPath = path.join(anotherFolderCopyPath, asset);
          //   console.log(assetDistPath);
          await fsPromises.copyFile(assetPath, assetDistPath);
        }
      }
    }
    console.log('assets copyed');
  };

  copyAssets();
}

buildBundle();
