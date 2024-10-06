const ROUTES = Object.freeze({
  getVisits: '/visits',
  getVisitsById: '/visits/:id',
  addVisit: '/add-visit',
  updateVisit: '/update-visit/:id',
  deleteVisit: '/delete-visit/:id',
  getFilesStoragePath: '/files-storage-path',
  uploadFiles: '/upload-files',
  deleteFiles: '/delete-files',
  uploads: '/uploads',
});

module.exports = ROUTES;
