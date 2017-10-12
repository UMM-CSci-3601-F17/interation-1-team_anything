import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {Play} from './play';
import {environment} from "../../environments/environment";


@Injectable()
export class playService {
    private sageUrl: string = environment.API_URL + "sages";

    constructor(private http: Http) {
    }

    getSages(): Observable<Play[]> {
        let observable: Observable<any> = this.http.request(this.sageUrl);
        return observable.map(res => res.json());
    }

    getSageById(id: string): Observable<Play> {
        return this.http.request(this.sageUrl + "/" + id).map(res => res.json());
    }
}
