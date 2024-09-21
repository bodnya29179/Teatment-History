const ROUTES = Object.freeze({
  getVisits: '/visits',
  addVisit: '/add-visit',
  updateVisit: '/update-visit',
  deleteVisit: '/delete-visit/:id',

  getFilesStoragePath: '/files-storage-path',
  uploadFiles: '/upload-files',
  deleteFile: '/delete-file',
});

module.exports = ROUTES;
