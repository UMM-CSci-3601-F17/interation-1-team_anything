import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {Card} from './card';
import {environment} from "../../environments/environment";


@Injectable()
export class CardListService {
    private cardUrl: string = environment.API_URL + "card";

    constructor(private http: Http) {
    }

    getCards(): Observable<Card[]> {
        let observable: Observable<any> = this.http.request(this.cardUrl);
        return observable.map(res => res.json());
    }

    getCardById(id: string): Observable<Card> {
        return this.http.request(this.cardUrl + "/" + id).map(res => res.json());
    }

    addNewCard(word: string, synonym: string, antonym : string, generalization : string, example: string): Observable<Boolean> {
        const body = {word:word, synonym:synonym, antonym:antonym, generalization:generalization, example:example};
        console.log(body);

        //Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post(this.cardUrl + "/new", body).map(res => res.json());
    }
}
