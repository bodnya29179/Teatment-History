import { Component, OnInit } from '@angular/core';
import { Visit } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { LocaleService, StorageService } from '../../services';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  visit: Visit;

  get currentLanguage(): string {
    return this.localeService.currentLanguage;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly storageService: StorageService,
    private readonly localeService: LocaleService,
  ) {}

  async ngOnInit(): Promise<void> {
    const visitId = this.route.snapshot.params['id'];
    this.visit = await firstValueFrom(this.storageService.getVisitById(visitId));
  }
}
