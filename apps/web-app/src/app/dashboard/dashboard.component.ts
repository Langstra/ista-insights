import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { map, Observable, tap } from 'rxjs';
import { selectPeriod } from '../login/auth.store';
import { DataService } from './data.service';
import { selectData } from './data.store';

@Component({
  selector: 'ista-insights-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected period = selectPeriod.pipe(
    tap((d) => console.log(d)),
    map((d) => d?.format('DD-MM-YYYY'))
  );
  // type should be
  // Observable<ChartConfiguration<'bar'>['data'] | undefined>
  // but somehow it is then also | null which is not accepterd by data
  protected barChartData$: Observable<any> = selectData.pipe(
    tap((d) => console.log(d)),
    map((data) => ({
      labels: (data || []).map((d) => d.date.format('MM')),
      datasets: [{ data: (data || []).map((d) => d.usage), label: 'Verbruik' }],
    }))
  );

  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData();
  }
}
