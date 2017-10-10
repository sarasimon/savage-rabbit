jest.mock('superagent');
import moment from 'moment';
import CalendarService from '../../src/js/services/CalendarService';

describe('CalendarService', () => {
  const queryStart = new Date('2017-10-05T09:00:00+02:00'); // Thursday, 5 October 2017 09:00:00
  const queryEnd = new Date('2017-10-05T13:00:00+02:00'); // Thursday, 5 October 2017 13:00:00
  const duration = moment().set({ hour: 0, minute: 15, second: 0 });
  const longDuration = moment().set({ hour: 3, minute: 0, second: 0 });

  const morning_event = {
    status: 'confirmed',
    summary: 'Timesheet',
    start: {
      dateTime: '2017-10-05T11:15:00+02:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2017-10-05T11:45:00+02:00',
      timeZone: 'Europe/London',
    },
  };

  const midday_event = {
    status: 'confirmed',
    summary: 'Beach time',
    start: {
      dateTime: '2017-10-05T11:30:00+02:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2017-10-05T12:00:00+02:00',
      timeZone: 'Europe/London',
    },
  };

  const RESPONSE_WITHOUT_EVENT = {
    body:
    {
      summary: 'cpania@thoughtworks.com',
      items: [],
    },
  };

  const RESPONSE_ONE_EVENT = {
    body:
    {
      summary: 'cpania@thoughtworks.com',
      items: [morning_event],
    },
  };

  const RESPONSE_TWO_EVENTS = {
    body:
    {
      summary: 'cpania@thoughtworks.com',
      items: [morning_event, midday_event],
    },
  };

  test('test basic no event in calendar response', (done) => {
    require('superagent').__setMockResponse(RESPONSE_WITHOUT_EVENT);

    CalendarService.requestAvailability('token', moment(queryStart), moment(queryEnd), duration, ['cpania@thoughtworks.com']).then((slots) => {
      expect(slots).toEqual([{
        email: 'cpania@thoughtworks.com',
        data: [{
          start: queryStart,
          end: queryEnd,
        }],
      }]);
      done();
    });
  });

  test('test basic with one basic event', (done) => {
    require('superagent').__setMockResponse(RESPONSE_ONE_EVENT);

    CalendarService.requestAvailability('token', moment(queryStart), moment(queryEnd), duration, ['cpania@thoughtworks.com']).then((slots) => {
      expect(slots).toEqual([{
        email: 'cpania@thoughtworks.com',
        data: [
          {
            start: queryStart,
            end: new Date('2017-10-05T11:15:00+02:00'),
          },
          {
            start: new Date('2017-10-05T11:45:00+02:00'),
            end: queryEnd,
          },
        ],
      }]);
      done();
    });
  });

  test('test basic with two overlapping events', (done) => {
    require('superagent').__setMockResponse(RESPONSE_TWO_EVENTS);

    CalendarService.requestAvailability('token', moment(queryStart), moment(queryEnd), duration, ['cpania@thoughtworks.com']).then((slots) => {
      expect(slots).toEqual([{
        email: 'cpania@thoughtworks.com',
        data: [
          {
            start: queryStart,
            end: new Date('2017-10-05T11:15:00+02:00'),
          },
          {
            start: new Date('2017-10-05T12:00:00+02:00'),
            end: queryEnd,
          },
        ],
      }]);
      done();
    });
  });

  test('test basic no time between events', (done) => {
    require('superagent').__setMockResponse(RESPONSE_TWO_EVENTS);

    CalendarService.requestAvailability('token', moment(queryStart), moment(queryEnd), longDuration, ['cpania@thoughtworks.com']).then((slots) => {
      expect(slots).toEqual([{
        email: 'cpania@thoughtworks.com',
        data: [],
      }]);
      done();
    });
  });
});

describe('InterviewService', () => {
  const event1 = {
    status: 'confirmed',
    summary: 'Technical Interview (OID) - Jaime Ramirez Castillo',
    description: 'Hola!',
    attendees: [
      {
        email: 'smodes@thoughtworks.com',
        responseStatus: 'accepted',
      },
      {
        email: 'thoughtworks.com_526f6f6d2d537061696e2d42617263656c6f6e612d43616d706f616d6f722d4d656574696e67526f6f6d33@resource.calendar.google.com',
        displayName: 'Barcelona-8F-Campoamor (8)',
        resource: true,
        responseStatus: 'accepted',
      },
      {
        email: 'ccaroli@thoughtworks.com',
        responseStatus: 'declined',
      },
      {
        email: 'calendar21@greenhouse.io',
        responseStatus: 'needsAction',
      },
      {
        email: 'evulpe@thoughtworks.com',
        displayName: 'evulpe@thoughtworks.com',
        responseStatus: 'accepted',
      },
    ],
  };

  const invalid_event = {
    status: 'confirmed',
    summary: 'Wash Up - Mireia Anglès Farré',
    description: 'Hola!',
    attendees: [
      {
        email: 'smodes@thoughtworks.com',
        responseStatus: 'accepted',
      },
      {
        email: 'thoughtworks.com_526f6f6d2d537061696e2d42617263656c6f6e612d43616d706f616d6f722d4d656574696e67526f6f6d33@resource.calendar.google.com',
        displayName: 'Barcelona-8F-Campoamor (8)',
        resource: true,
        responseStatus: 'accepted',
      },
      {
        email: 'ccaroli@thoughtworks.com',
        responseStatus: 'declined',
      },
      {
        email: 'calendar21@greenhouse.io',
        responseStatus: 'needsAction',
      },
      {
        email: 'evulpe@thoughtworks.com',
        displayName: 'evulpe@thoughtworks.com',
        responseStatus: 'accepted',
      },
    ],
  };

  const unnamed_event = {
    status: 'confirmed',
    summary: undefined,
    description: '',
  };

  const no_attendees_event = {
    status: 'confirmed',
    summary: 'Technical Interview (OID) - Jaime Ramirez Castillo',
    description: 'Hola!',
  };

  const RESPONSE = {
    body: {
      items: [
        event1,
      ] },
  };

  const RESPONSE_TWO_EVENTS = {
    body: {
      items: [
        event1, event1,
      ] },
  };

  const RESPONSE_WITH_ONE_INVALID_EVENT = {
    body: {
      items: [
        event1, invalid_event,
      ] },
  };

  const RESPONSE_WITH_NO_ATTENDEES = {
    body: {
      items: [
        no_attendees_event,
      ] },
  };

  const RESPONSE_WITH_NO_NAME_EVENT = {
    body: {
      items: [
        unnamed_event,
      ] },
  };

  test('test basic success response - interview service', (done) => {
    require('superagent').__setMockResponse(RESPONSE);

    CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
      expect(result).toEqual({ 'evulpe@thoughtworks.com': 1,
        'smodes@thoughtworks.com': 1 });
      done();
    });
  });

  test('test basic success response - interview service - two events', (done) => {
    require('superagent').__setMockResponse(RESPONSE_TWO_EVENTS);

    CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
      expect(result).toEqual({ 'evulpe@thoughtworks.com': 2,
        'smodes@thoughtworks.com': 2 });
      done();
    });
  });

  test('test basic success response - interview service - two events', (done) => {
    require('superagent').__setMockResponse(RESPONSE_WITH_ONE_INVALID_EVENT);

    CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
      expect(result).toEqual({ 'evulpe@thoughtworks.com': 1,
        'smodes@thoughtworks.com': 1 });
      done();
    });
  });

  test('test error response', (done) => {
    require('superagent').__setMockError('error');
    CalendarService.requestInterviewsPerPerson('token', moment()).catch((e) => {
      expect(e).toMatch('error');
      done();
    });
  });

  test('test no attendees response', (done) => {
    require('superagent').__setMockResponse(RESPONSE_WITH_NO_ATTENDEES);
    CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
      expect(result).toEqual({});
      done();
    });
  });

  test('test undefined name event response', (done) => {
    require('superagent').__setMockResponse(RESPONSE_WITH_NO_NAME_EVENT);
    CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
      expect(result).toEqual({});
      done();
    });
  });
});
