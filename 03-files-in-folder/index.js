// const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (error, files) => {
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (error, info) => {
      if (info.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtention = path.parse(file).ext.replace('.', '');
        const fileSize = `${(info.size / 1024).toFixed(3)}kb`;
        console.log(`${fileName} - ${fileExtention} - ${fileSize}`);
      }
    });
  });
});
