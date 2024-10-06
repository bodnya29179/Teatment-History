import { Component, OnInit } from '@angular/core';
import { TreatmentFacadeService } from '../../services';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  constructor(private readonly treatmentFacadeService: TreatmentFacadeService) {}

  ngOnInit(): void {
    this.treatmentFacadeService.loadVisits();
  }
}
