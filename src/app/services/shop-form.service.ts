import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private countryUrl = 'http://localhost:8080/api/countries';
  private stateUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) {}

  getStates(theCountryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient
      .get<GetResponseStates>(searchStateUrl)
      .pipe(map((res) => res._embedded.states));
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countryUrl)
      .pipe(map((res) => res._embedded.countries));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }
}

type GetResponseCountries = {
  _embedded: {
    countries: Country[];
  };
};

type GetResponseStates = {
  _embedded: {
    states: State[];
  };
};
