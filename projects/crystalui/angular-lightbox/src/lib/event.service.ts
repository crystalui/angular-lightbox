import {ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class EventService {
    emitter: ReplaySubject<any> = new ReplaySubject(1);

    emitChangeEvent(data: any) {
        this.emitter.next(data);
    }
}