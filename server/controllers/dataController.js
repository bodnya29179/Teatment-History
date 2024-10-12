const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const unzipper = require('unzipper');
const { processFileName } = require('../utils');

const DB_FOLDER_PATH = path.join(__dirname, '..', 'database');
const DB_PATH = path.join(DB_FOLDER_PATH, 'db.json');
const UPLOADS_FOLDER_PATH = path.join(DB_FOLDER_PATH, 'uploads');
const ZIP_FILE_PATH = path.join(__dirname, 'database.zip');

const router = jsonServer.router(DB_PATH);

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
      res.status(404).json({ message: 'Visit not found' });
      return;
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
      res.status(404).json({ message: 'Visit not found' });
      return;
    }

    visit.reports.forEach((fileName) => {
      const fullFilePath = path.join(UPLOADS_FOLDER_PATH, fileName);
      fs.unlinkSync(fullFilePath);
    });

    getDB().remove({ id }).write();

    res.status(200).send();
  }

  getFilesStoragePath(req, res) {
    res.status(200).json(UPLOADS_FOLDER_PATH);
  }

  async uploadFiles(req, res) {
    try {
      const files = Array.isArray(req.files.reports) ? req.files.reports : [req.files.reports];
      const fileNames = files.map((file) => processFileName(file.name));
      const filePaths = fileNames.map((fileName) => path.join(UPLOADS_FOLDER_PATH, fileName));

      files.forEach((file, index) => file.mv(filePaths[index]));

      res.status(200).json(fileNames);
    } catch (error) {
      res.status(500).json({ message: 'Files upload failed', error: error.message });
    }
  }

  deleteFiles(req, res) {
    req.body.forEach((fileName) => {
      const filePath = path.join(UPLOADS_FOLDER_PATH, fileName);
      fs.unlinkSync(filePath);
    });

    res.status(200).send();
  }

  deleteFile(req, res) {
    const fileName = req.body.fileName;

    if (fileName) {
      const filePath = path.join(UPLOADS_FOLDER_PATH, req.body.fileName);

      fs.access(filePath, fs.constants.F_OK, (error) => {
        if (error) {
          res.status(404).json({ message: `File "${fileName}" not found.` });
          return;
        }

        fs.unlink(filePath, (error) => {
          if (error) {
            res.status(500).json({ message: 'Error deleting file.', error: error.message });
            return;
          }

          res.status(200);
        });
      });
    } else {
      res.status(500).json({ message: 'Invalid file name' });
    }
  }

  exportData(req, res) {
    const errorMessage = 'Error creating archive.';

    try {
      const output = fs.createWriteStream(ZIP_FILE_PATH);

      const archive = archiver('zip', {
        zlib: {
          level: 9,
        },
      });

      output.on('close', () => {
        res.download(ZIP_FILE_PATH, 'database.zip', (err) => {
          if (err) {
            res.status(500).send('Error downloading the file.');
          } else {
            fs.unlinkSync(ZIP_FILE_PATH);
          }
        });
      });

      archive.on('error', () => res.status(500).send(errorMessage));

      archive.pipe(output);

      archive.directory(DB_FOLDER_PATH, false);

      archive.finalize();
    } catch (error) {
      res.status(500).json({ message: errorMessage, error: error.message });
    }
  }

  async importData(req, res) {
    const errorMessage = 'Error unzipping archive.';

    if (!req.files?.archive) {
      res.status(400).send('Archive is not uploaded');
      return;
    }

    try {
      const archive = req.files.archive;
      const tempDir = path.join(__dirname, 'temp');

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const archivePath = path.join(tempDir, archive.name);
      await archive.mv(archivePath);

      await new Promise((resolve, reject) => {
        fs.createReadStream(archivePath)
          .pipe(unzipper.Extract({ path: tempDir }))
          .on('close', resolve)
          .on('error', reject);
      });

      const extractedUploadsDir = path.join(tempDir, 'uploads');

      if (fs.existsSync(extractedUploadsDir)) {
        const files = fs.readdirSync(extractedUploadsDir);

        files.forEach((file) => {
          const sourcePath = path.join(extractedUploadsDir, file);
          const destPath = path.join(UPLOADS_FOLDER_PATH, file);
          fs.copyFileSync(sourcePath, destPath);
        });
      }

      const extractedDbPath = path.join(tempDir, 'db.json');

      if (fs.existsSync(extractedDbPath)) {
        const newDb = JSON.parse(fs.readFileSync(extractedDbPath, 'utf-8'));
        const currentVisits = getDB().value();

        newDb.visits.forEach((newVisit) => {
          const doesAlreadyExist = currentVisits.some((visit) => visit.id === newVisit.id);

          if (!doesAlreadyExist) {
            getDB().push(newVisit).write();
          }
        });
      }

      fs.rmSync(tempDir, { recursive: true, force: true });

      res.status(200).send(getDB().value());
    } catch (error) {
      res.status(500).json({ message: errorMessage, error: error.message });
    }
  }
}

module.exports = new DataController();
