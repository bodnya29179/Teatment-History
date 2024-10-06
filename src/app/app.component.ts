import { Component, NgZone, OnInit } from '@angular/core';
import { IpcService, TreatmentFacadeService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading = true;

  constructor(
    private readonly ipcService: IpcService,
    private readonly treatmentFacadeService: TreatmentFacadeService,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.treatmentFacadeService.loadFilesStoragePath();

    if (this.ipcService.isElectronApp) {
      this.ipcService.on('server-ready', () => {
        this.zone.run(() => {
          this.isLoading = false;
        });
      });
    } else {
      this.isLoading = false;
    }
  }
}
