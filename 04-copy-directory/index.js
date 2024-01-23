const fsPromises = require('fs').promises;
const path = require('path');

const newFolderPath = path.join(__dirname, 'files-copy-folder');
const baseFolderPath = path.join(__dirname, 'files');

async function copyDir() {
  await fsPromises.mkdir(newFolderPath, { recursive: true });

  const newFiles = await fsPromises.readdir(newFolderPath);
  for (const file of newFiles) {
    await fsPromises.unlink(path.join(newFolderPath, file));
  }

  const baseFiles = await fsPromises.readdir(baseFolderPath);
  for (const file of baseFiles) {
    const currentFilePath = path.join(baseFolderPath, file);

    fsPromises.copyFile(currentFilePath, path.join(newFolderPath, file));
    console.log(`Copied: ${file}`);
  }
}

copyDir();
