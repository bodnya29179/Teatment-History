import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable()
export class IpcService {
  private readonly ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  get isElectronApp(): boolean {
    return !!(window.require && window.require('electron'));
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
}
