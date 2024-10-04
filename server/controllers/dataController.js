const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { processFileName } = require('../utils');

const router = jsonServer.router('server/database/db.json');
const uploadsFolderPath = path.join(__dirname, '..', '/database/uploads');

function getDB() {
  return router.db.get('visits');
}

class DataController {
  getVisits(req, res) {
    const todos = getDB().value();

    res.status(200).send(todos);
  }

  getVisitById(req, res) {
    const id = req.params.id;
    const visit = getDB().find({ id }).value();

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    res.status(200).send(visit);
  }

  addVisit(req, res) {
    const visit = {
      id: uuidv4(),
      ...req.body,
    };

    getDB().push(visit).write();

    res.status(200).send(visit);
  }

  updateVisit(req, res) {
    const id = req.params.id;

    getDB().find({ id }).assign(req.body).write();

    const visit = getDB().find({ id }).value();

    res.status(200).send(visit);
  }

  deleteVisit(req, res) {
    const id = req.params.id;

    const visit = getDB().find({ id }).value();

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    visit.reports.forEach((fileName) => {
      const fullFilePath = path.join(uploadsFolderPath, fileName);
      fs.unlinkSync(fullFilePath);
    });

    getDB().remove({ id }).write();

    res.status(200).send();
  }

  getFilesStoragePath(req, res) {
    res.status(200).json(uploadsFolderPath);
  }

  async uploadFiles(req, res) {
    try {
      const files = Array.isArray(req.files.reports) ? req.files.reports : [req.files.reports];
      const fileNames = files.map((file) => processFileName(file.name));
      const filePaths = fileNames.map((fileName) => path.join(uploadsFolderPath, fileName));

      files.forEach((file, index) => file.mv(filePaths[index]));

      res.status(200).json(fileNames);
    } catch (error) {
      res.status(500).json({ message: 'Files upload failed', error: error.message });
    }
  }

  deleteFiles(req, res) {
    req.body.forEach((fileName) => {
      const filePath = path.join(uploadsFolderPath, fileName);
      fs.unlinkSync(filePath);
    });

    res.status(200).send();
  }

  deleteFile(req, res) {
    const fileName = req.body.fileName;

    if (fileName) {
      const filePath = path.join(uploadsFolderPath, req.body.fileName);

      fs.access(filePath, fs.constants.F_OK, (error) => {
        if (error) {
          return res.status(404).json({ message: `File "${fileName}" not found.` });
        }

        fs.unlink(filePath, (error) => {
          if (error) {
            return res.status(500).json({ message: 'Error deleting file.', error: error.message });
          }

          return res.status(200);
        });
      });
    } else {
      res.status(500).json({ message: 'Invalid file name' });
    }
  }
}

module.exports = new DataController();
