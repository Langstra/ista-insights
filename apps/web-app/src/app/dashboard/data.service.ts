import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { environment } from '../../environments/environment';
import { authStore } from '../login/auth.store';
import { dataStore } from './data.store';

type DataRes = {
  CurStart: string;
  ServicesComp: {
    CurMeters: unknown[];
    DecPos: number;
    Id: number;
    TotalNow: number;
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  public getData(year = 2022): void {
    const jwt = authStore.getValue().jwt;
    const cuid = authStore.getValue().cuid;
    this.httpClient
      .post<DataRes[]>(`${environment.api}/data`, {
        jwt,
        cuid,
        year,
      })
      .subscribe((res) => {
        dataStore.next(
          res.map(({ ServicesComp: res, CurStart }) => ({
            date: dayjs(CurStart, 'DD-MM-YYYY'),
            curMeters: res[0].CurMeters,
            decPos: res[0].DecPos,
            id: res[0].Id,
            usage: res[0].TotalNow,
          }))
        );
      });
  }
}
