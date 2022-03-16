# nut-persister

a very simple repository manager. The aim of this package is wrapping all repositories to prioritize one repository to others. This library provides two functions named `get` and `set`.


`get` function requires function name which retrieves data in your repository like `getEvent`, `getCustomer`, etc, and parameters of it. If it finds in first repository, than it return data directly, otherwise when it finds data in second or other repositories, than it requires to call set function for previous repositories one by one.

`set` function requires function name which write data in your repository. It calls all repositories to write data one by one.

## Sample Scenario
Assume that you have Redis, AWS DynamoDB and MySQL repositories. Your master data is always in MySQL database but you don't want to reach always due to performance issue. So you can save in Redis but it is costly in long-term so you should set TTL(Time To Live) to delete some data when it is not used. In this case, you can still think to cache it to have better performance and lower cost so AWS DynamoDB is good option to use. AWS Dynamodb is slower than but faster than database and also cheaper than Redis.

## Install

Install the package.

```sh
$ npm i -S nut-persister
```

## Usage

Create your repositories like the following code. According to the following code;


**`index.ts`**
```ts
import { NutPersister } from 'nut-persister';
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

```

Create instances of repositories.

```ts
const eventRedisRepository = new EventRedisRepository();

const eventCosmosdbRepository = new EventCosmosDbRepository();
```

Create instance of Persister.

```ts
const eventPersister = new NutPersister<IEventRepository>([eventRedisRepository, eventCosmosdbRepository]);
```

```ts
const eventId = '4e0c71bb-eedf-43dd-b9a1-911a7ed6d74f';
const newEvent: IEvent = { id: eventId, eventType: 'Submission', data: {} };

// it will call setEvent function of eventRedisRepository and eventCosmosdbRepository respectively.
eventPersister.set('setEvent', op => op(newEvent)); 

// this usage is same as above usage, just second parameters requires tuple instead of arrow function.
// eventPersister.setV2('setEvent', [newEvent]);

// it will call getEvent function in eventRedisRepository firstly and find it because set action is already called above line. So, setEvent function will not be called for any repositories.
const result1 = eventPersister.get('getEvent', op => op(eventId), (persister, result) => persister.setEvent(result!), newEvent);

console.log(result1);

// Same behaviour will continue in this line as well.
const result2 = eventPersister.getV2('getEvent', [eventId], (persister, result) => persister.setEvent(result!), newEvent);

console.log(result2);
```