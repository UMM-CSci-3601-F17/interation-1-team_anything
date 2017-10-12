import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {Sage} from './sage';
import {environment} from "../../environments/environment";


@Injectable()
export class SageListService {
    private sageUrl: string = environment.API_URL + "sages";

    constructor(private http: Http) {
    }

    getSages(): Observable<Sage[]> {
        let observable: Observable<any> = this.http.request(this.sageUrl);
        return observable.map(res => res.json());
    }

    getSageById(id: string): Observable<Sage> {
        return this.http.request(this.sageUrl + "/" + id).map(res => res.json());
    }

    addNewSage(word : string, synonym : string, antonym : string, generalization : string, example : string): Observable<Boolean> {
        const body = {word:word, synonym:synonym, antonym:antonym, generalization:generalization, example:example};
        console.log(body);

        //Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post(this.sageUrl + "/new", body).map(res => res.json());
    }
}
