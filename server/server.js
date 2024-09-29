const { dataController } = require('./controllers');
const { ROUTES } = require('./constants');
const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('server/database/db.json');
const middlewares = jsonServer.defaults();

const PORT = 3000;
const HOSTNAME = 'localhost';

server.use(cors());

server.use(ROUTES.uploads, express.static(path.join(__dirname, 'database/uploads')));

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
server.delete(ROUTES.deleteFile, dataController.deleteFile);

server.use(router);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at http://${ HOSTNAME }:${ PORT }/`);
});
