import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  apiKey = 'AIzaSyA5MCtZVbiPFlbjSNV5Om0rfgWu1ylC0Ag';
  public responseCache = new Map();
  constructor(public http: HttpClient) {}

  getVideosForChanel(
    resultsPerPage: number,
    totalResults: number
    // tslint:disable-next-line:ban-types
  ): Observable<Object[]> {
    const url =
      'https://www.googleapis.com/youtube/v3/search?key=' +
      this.apiKey +
      '&channelId=' +
      'UCtTuLS0NE-9aOkOiuN4lmnQ' +
      '&order=date&part=snippet &type=video,id&maxResults=' +
      resultsPerPage;
    const beersFromCache = this.responseCache.get(url);
    if (beersFromCache) {
      return of(beersFromCache);
    }
    // tslint:disable-next-line:ban-types
    // return this.http.get<Object[]>(url).pipe(
    //   map((res) => {
    //     return res;
    //   })
    // );

    // tslint:disable-next-line:ban-types
    const response = this.http.get<Object[]>(url);
    response.subscribe((beers) => this.responseCache.set(url, beers));
    return response;
  }
  // tslint:disable-next-line:ban-types
  getVideoDetails(id: any): Observable<Object[]> {
    return (
      this.http
        // tslint:disable-next-line:ban-types
        .get<Object[]>(
          ` https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${id}&key=${this.apiKey}`
        )
        .pipe(
          map((res) => {
            return res;
          })
        )
    );
  }
}
