const fsPromises = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function logFiles() {
  const folderItems = await fsPromises.readdir(folderPath);

  for (const file of folderItems) {
    const filePath = path.join(folderPath, file);

    const info = await fsPromises.stat(filePath);

    if (info.isFile()) {
      const fileName = path.parse(file).name;
      const fileExtention = path.parse(file).ext.replace('.', '');
      const fileSize = `${(info.size / 1024).toFixed(3)}kb`;
      console.log(`${fileName} - ${fileExtention} - ${fileSize}`);
    }
  }
}

logFiles();
