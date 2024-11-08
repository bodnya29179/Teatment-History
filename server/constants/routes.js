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

  exportData: '/export',
  importData: '/import',
});

module.exports = ROUTES;
