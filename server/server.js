const { dataController } = require('./controllers');
const { ROUTES } = require('./constants');
const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'database/db.json');
const UPLOADS_FOLDER_PATH = path.join(__dirname, 'database/uploads');
const PORT = 3000;
const HOSTNAME = 'localhost';
const IS_DEV = process.env.NODE_ENV === 'development' || !process.env.ELECTRON_RUN_AS_NODE;

const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults();

server.use(cors());

server.use(ROUTES.uploads, express.static(UPLOADS_FOLDER_PATH));

server.use(middlewares);
server.use(fileUpload());
server.use(jsonServer.bodyParser);

server.get(ROUTES.getVisits, dataController.getVisits);
server.get(ROUTES.getVisitsById, dataController.getVisitById);
server.post(ROUTES.addVisit, dataController.addVisit);
server.put(ROUTES.updateVisit, dataController.updateVisit);
server.delete(ROUTES.deleteVisit, dataController.deleteVisit);

server.get(ROUTES.getFilesStoragePath, dataController.getFilesStoragePath);
server.post(ROUTES.uploadFiles, dataController.uploadFiles);
server.delete(ROUTES.deleteFiles, dataController.deleteFiles);
server.get(ROUTES.exportData, dataController.exportData);

server.use(router);

server.listen(PORT, HOSTNAME, () => {
  if (IS_DEV) {
    console.log(`Server is running at http://${ HOSTNAME }:${ PORT }/`);
  }
});
