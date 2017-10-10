import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {Card} from '../Card/card';
import {environment} from "../../environments/environment";


@Injectable()
export class PlayListService {
    private playUrl: string = environment.API_URL + "play";

    constructor(private http: Http) {
    }

    getCards(): Observable<Card[]> {
        let observable: Observable<any> = this.http.request(this.playUrl);
        return observable.map(res => res.json());
    }

    getCardById(id: string): Observable<Card> {
        return this.http.request(this.playUrl + "/" + id).map(res => res.json());
    }

}
