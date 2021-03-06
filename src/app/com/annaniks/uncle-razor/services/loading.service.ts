import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Loading } from '../models/models';
import { Observable } from 'rxjs';

@Injectable()
export class LoadingService {
    private _loaderSubject = new Subject<Loading>();
    private _loaderState = this._loaderSubject.asObservable();

    constructor() { }

    public showLoading(): void {
        this._loaderSubject.next(<Loading>{ show: true });
    }

    public hideLoading(): void {
        this._loaderSubject.next(<Loading>{ show: false });
    }

    public getLoaderState(): Observable<Loading> {
        return this._loaderState;
    }
}