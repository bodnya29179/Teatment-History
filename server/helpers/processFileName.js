function processFileName(fileName) {
  const lastDotIndex = fileName.lastIndexOf('.');
  const newFileName = fileName.slice(0, lastDotIndex).replace(/\s+/g, '_');

  if (lastDotIndex < 1) {
    throw new Error('Invalid file name: No file extension found.');
  }

  const fileFormat = fileName.slice(lastDotIndex + 1);

  return `${ newFileName }_${ Date.now() }.${fileFormat}`;
}

module.exports = processFileName;
