# Treatment History

This project is a web application that allows users to track their medical visits to various doctors. Users can log
their visits, specifying the type of doctor, date, place, description of the issue, conclusion, and any files such as
reports or prescriptions provided by the doctor. The backend uses a JSON database to store this information, and
uploaded files are saved to a local directory.

## Features
- Add medical visits with details such as date, doctor type, place, and more.
- Upload files (PDFs, DOCX, images) related to the visit, such as reports or prescriptions.
- View visit history, sorted by date or doctor type.
- Delete visits, including the removal of any uploaded files.
- Import and export data.
- Supports macOS and Windows.

## Installation

### Prerequisites:
- [Node.js (v12+)](https://nodejs.org/)
- [Angular CLI](https://angular.dev/)

### Steps:

- Clone the repository:

   ```bash
   git clone https://github.com/bodnya29179/treatment-history.git
   cd treatment-history
   ```

- Install dependencies:

   ```bash
   npm ci
   ```
  
- Run the app in browser:

   ```bash
   npm run start-web
   ```

- Run the app as a desktop app:

   ```bash
   npm run start-desktop
   ```

The application should now be running at http://localhost:4200/.

## Build

Build the app:

   ```bash
   npm run build-desktop
   ```

## License
This project is licensed under the MIT License.

