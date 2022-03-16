import { NutPersister } from '../src';
import { EventRedisRepository, EventCosmosDbRepository, IEventRepository, IEvent } from './sample';
import { mocked } from 'jest-mock'

jest.mock('./sample');

const eventRedisRepository = new EventRedisRepository();

const eventCosmosdbRepository = new EventCosmosDbRepository();

const mockedEventRedisRepository = mocked(eventRedisRepository, true);

const mockedEventCosmosdbRepository = mocked(eventRedisRepository, true);

const events: Array<IEvent> = [];

mockedEventRedisRepository.setEvent.mockImplementation(event => {
    events.push(event);

    return event;
});

mockedEventRedisRepository.getEvent.mockImplementation(id => {
    return events.find(event => event.id === id);
});

mockedEventCosmosdbRepository.setEvent.mockImplementation(event => {
    events.push(event);

    return event;
});

mockedEventCosmosdbRepository.getEvent.mockImplementation(id => {
    return events.find(event => event.id === id);
});

const module_name = `${NutPersister.name}`;

afterEach(() => {
    mockedEventRedisRepository.setEvent.mockReset();
    mockedEventCosmosdbRepository.setEvent.mockReset();
    mockedEventRedisRepository.getEvent.mockReset();
    mockedEventCosmosdbRepository.getEvent.mockReset();
});

describe(`${module_name} Test`, () => {
    it('should call setEvent function in both persisters', () => {

        const eventPersister = new NutPersister<IEventRepository>([eventRedisRepository, eventCosmosdbRepository]);

        const eventId = '4e0c71bb-eedf-43dd-b9a1-911a7ed6d74f';
        const newEvent: IEvent = { id: eventId, eventType: 'Submission', data: {} };

        eventPersister.set('setEvent', op => op(newEvent));

        expect(mockedEventRedisRepository.setEvent).toHaveBeenCalledTimes(1);

        expect(mockedEventCosmosdbRepository.setEvent).toHaveBeenCalledTimes(1);

    });

    it('should not call any getEvent in both persisters', () => {

        const eventPersister = new NutPersister<IEventRepository>([eventRedisRepository, eventCosmosdbRepository]);

        const eventId = '4e0c71bb-eedf-43dd-b9a1-911a7ed6d74f';
        const newEvent: IEvent = { id: eventId, eventType: 'Submission', data: {} };

        eventPersister.set('setEvent', op => op(newEvent));

        expect(mockedEventRedisRepository.setEvent).toHaveBeenCalledTimes(1);

        expect(mockedEventCosmosdbRepository.setEvent).toHaveBeenCalledTimes(1);

        mockedEventRedisRepository.setEvent.mockReset();

        mockedEventCosmosdbRepository.setEvent.mockReset();

        const result = eventPersister.get('getEvent', op => op(eventId), (persister, result) => persister.setEvent(result!), newEvent);

        expect(result).toEqual(newEvent);

        expect(mockedEventRedisRepository.setEvent).not.toHaveBeenCalled();

        expect(mockedEventCosmosdbRepository.setEvent).not.toHaveBeenCalled();
    });
});