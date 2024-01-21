const fsPromises = require('fs').promises;
const path = require('path');

const newFolderPath = path.join(__dirname, 'files-copy-folder');
const baseFolderPath = path.join(__dirname, 'files');

async function copyDir() {
  await fsPromises.mkdir(newFolderPath, { recursive: true });

  const newFiles = await fsPromises.readdir(newFolderPath);
  newFiles.forEach((file) => {
    fsPromises.unlink(path.join(newFolderPath, file));
  });

  const baseFiles = await fsPromises.readdir(baseFolderPath);
  baseFiles.forEach((file) => {
    const currentFilePath = path.join(baseFolderPath, file);

    fsPromises.copyFile(currentFilePath, path.join(newFolderPath, file));
    console.log(`Copied: ${file}`);
  });
}

copyDir();
