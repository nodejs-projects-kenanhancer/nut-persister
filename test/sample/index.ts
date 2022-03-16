import { v4 as uuid } from 'uuid';

export interface IEvent {
    id?: string;
    eventType: string;
    data: any;
}

export interface IEventRepository {
    getEvent(id: string): IEvent | undefined;
    setEvent(event: IEvent): IEvent;
}

const createEvent = (event: IEvent): IEvent => ({ id: uuid(), ...event });

export class EventRedisRepository implements IEventRepository {

    constructor(private events: Array<IEvent> = []) { }

    getEvent(id: string): IEvent | undefined {
        return this.events.find(item => item.id === id);
    }
    setEvent(event: IEvent): IEvent {

        const newEvent: IEvent = createEvent(event);

        this.events.push(newEvent);

        return newEvent;
    }
}

export class EventCosmosDbRepository implements IEventRepository {

    constructor(private events: Array<IEvent> = []) { }

    getEvent(id: string): IEvent | undefined {
        return this.events.find(item => item.id === id);
    }
    setEvent(event: IEvent): IEvent {

        const newEvent: IEvent = createEvent(event);

        this.events.push(newEvent);

        return newEvent;
    }
}