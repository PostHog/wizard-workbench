import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomUserService {
  private readonly http = inject(HttpClient);

  find() {
    return this.http
      .get('https://randomuser.me/api/', {
        headers: {
          noauth: 'true', // Ad noauth header to bypass custom api prefix interceptor
        },
      })
      .pipe(map((response: any) => response.results));
  }
}
