import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()
export class IpcService {
  private readonly electron: typeof Electron.CrossProcessExports;
  private readonly ipc: IpcRenderer | undefined;

  constructor(private readonly storageService: StorageService) {
    if (window.require) {
      try {
        this.electron = window.require('electron');
        this.ipc = this.electron.ipcRenderer;
        this.ipc.send('renderer-ready');
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  get isElectronApp(): boolean {
    return !!this.electron;
  }

  on(channel: string, listener: (...args: any) => void): void {
    if (!this.ipc) {
      return;
    }

    this.ipc.on(channel, listener);
  }

  send(channel: string, ...args: unknown[]): void {
    if (!this.ipc) {
      return;
    }

    this.ipc.send(channel, ...args);
  }

  async openFile(filePath: string): Promise<void> {
    const absolutePath = await firstValueFrom(this.storageService.getFilesStoragePath());
    await this.electron.shell.openPath(`${ absolutePath }/${ filePath }`);
  }
}
