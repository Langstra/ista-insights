import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { select, setProps } from '@ngneat/elf';
import * as dayjs from 'dayjs';
import { filter, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { authStore } from './auth.store';

type LoginResult = {
  cookies: {
    name: string;
    value: string;
  }[];
  uBase: {
    Cus: { Cuid: string }[];
    DisplayName: string;
    JWT: string;
  };
  period: string;
};

type RefreshResult = {
  JWT: string;
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  public initRefresh(): void {
    const helper = new JwtHelperService();
    authStore
      .pipe(
        select((d) => d.jwt),
        filter(Boolean)
      )
      .subscribe((token) => {
        const diffMs = dayjs(helper.getTokenExpirationDate(token)).diff(
          dayjs()
        );

        setTimeout(
          () => {
            this.refreshJwt();
          },
          diffMs <= 1000 * 60 * 10 ? 0 : 1000 * 60 * 5
        );
      });
  }

  private refreshJwt(): void {
    const jwt = authStore.getValue().jwt;
    const cookies = authStore.getValue().cookies;

    this.httpClient
      .post<RefreshResult>(`${environment.api}/refresh-token`, { jwt, cookies })
      .subscribe((res) => {
        authStore.update(
          setProps({
            jwt: res.JWT,
          })
        );
      });
  }

  public login(username: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<LoginResult>(`${environment.api}/login`, { username, password })
      .pipe(
        tap((res) => {
          authStore.update(
            setProps({
              jwt: res.uBase.JWT,
              cookies: res.cookies,
              cuid: res.uBase.Cus[0].Cuid,
              period: dayjs(res.period, 'DD-MM-YYYY'),
            })
          );
        }),
        map((res) => !!res)
      );
  }
}
