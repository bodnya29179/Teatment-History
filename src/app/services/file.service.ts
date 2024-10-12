import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
  downloadFile(file: File | Blob, fileName: `${ string }.${ string }`): void {
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window.parent,
      })
    );

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
}
