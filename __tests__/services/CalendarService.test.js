jest.mock('superagent');
import moment from 'moment';
import CalendarService from '../../src/js/services/CalendarService';

describe('CalendarService', () => {

  const RESPONSE = {
    body:
    [{email: 'evulpe@thoughtworks.com',
    data: ['slot1', 'slot2'],
  }]

};

test('test basic success response', () => {
  require('superagent').__setMockResponse(RESPONSE);
  const mockProcessRequest = () => ['slot1', 'slot2']; 

  CalendarService.requestSingleAvailability('token', new Date(), new Date(),
    'interviewDuration', 'evulpe@thoughtworks.com', mockProcessRequest).then((result) => {
      expect(result).toEqual(
        {email: 'evulpe@thoughtworks.com',
        data: ['slot1', 'slot2'],
      })
    });
  });

test('test error response', () => {
  require('superagent').__setMockError("error");
  const mockProcessRequest = () => {};
  expect.assertions(1);

  CalendarService.requestSingleAvailability('token', new Date(), new Date(),
    'interviewDuration', 'evulpe@thoughtworks.com', mockProcessRequest).catch((e) =>
    {
      expect(e).toMatch('error')
    }
    );
  });

});



describe('InterviewService', () => {

 const event1 = {
   "status": "confirmed",
   "summary": "Technical Interview (OID) - Jaime Ramirez Castillo",
   "description": "Hola!",
   "attendees": [
   {
     "email": "smodes@thoughtworks.com",
     "responseStatus": "accepted"
   },
   {
     "email": "thoughtworks.com_526f6f6d2d537061696e2d42617263656c6f6e612d43616d706f616d6f722d4d656574696e67526f6f6d33@resource.calendar.google.com",
     "displayName": "Barcelona-8F-Campoamor (8)",
     "resource": true,
     "responseStatus": "accepted"
   },
   {
     "email": "ccaroli@thoughtworks.com",
     "responseStatus": "declined"
   },
   {
     "email": "calendar21@greenhouse.io",
     "responseStatus": "needsAction"
   },
   {
     "email": "evulpe@thoughtworks.com",
     "displayName": "evulpe@thoughtworks.com",
     "responseStatus": "accepted"
   }
   ],
 };

 const invalid_event = {
  "status": "confirmed",
  "summary": "Wash Up - Mireia Anglès Farré",
  "description": "Hola!",
  "attendees": [
  {
   "email": "smodes@thoughtworks.com",
   "responseStatus": "accepted"
 },
 {
   "email": "thoughtworks.com_526f6f6d2d537061696e2d42617263656c6f6e612d43616d706f616d6f722d4d656574696e67526f6f6d33@resource.calendar.google.com",
   "displayName": "Barcelona-8F-Campoamor (8)",
   "resource": true,
   "responseStatus": "accepted"
 },
 {
   "email": "ccaroli@thoughtworks.com",
   "responseStatus": "declined"
 },
 {
   "email": "calendar21@greenhouse.io",
   "responseStatus": "needsAction"
 },
 {
   "email": "evulpe@thoughtworks.com",
   "displayName": "evulpe@thoughtworks.com",
   "responseStatus": "accepted"
 }
 ],
}

const unnamed_event = {
  "status": "confirmed",
  "summary": undefined,
  "description": "",
}

const no_attendees_event = {
  "status": "confirmed",
  "summary": "Technical Interview (OID) - Jaime Ramirez Castillo",
  "description": "Hola!",
}

const RESPONSE = {
  body: {
   "items": [
   event1
   ]}
 };

 const RESPONSE_TWO_EVENTS = {
  body: {
   "items": [
   event1, event1,
   ]}
 };

 const RESPONSE_WITH_ONE_INVALID_EVENT = {
  body: {
   "items": [
   event1, invalid_event,
   ]}
 }

 const RESPONSE_WITH_NO_ATTENDEES = {
  body: {
   "items": [
   no_attendees_event,
   ]}
 }

 const RESPONSE_WITH_NO_NAME_EVENT = {
  body: {
   "items": [
   unnamed_event,
   ]}
 }

 test('test basic success response - interview service', (done) => {
  require('superagent').__setMockResponse(RESPONSE);

  CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
    expect(result).toEqual({'evulpe@thoughtworks.com': 1,
      'smodes@thoughtworks.com': 1});
    done();
  });
});

 test('test basic success response - interview service - two events', (done) => {
  require('superagent').__setMockResponse(RESPONSE_TWO_EVENTS);

  CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
    expect(result).toEqual({'evulpe@thoughtworks.com': 2,
      'smodes@thoughtworks.com': 2});
    done();
  });
});

 test('test basic success response - interview service - two events', (done) => {
  require('superagent').__setMockResponse(RESPONSE_WITH_ONE_INVALID_EVENT);

  CalendarService.requestInterviewsPerPerson('token', moment()).then((result) => {
    expect(result).toEqual({'evulpe@thoughtworks.com': 1,
      'smodes@thoughtworks.com': 1});
    done();
  });
});

 test('test error response', (done) => {
  require('superagent').__setMockError("error");
  CalendarService.requestInterviewsPerPerson('token', moment()).catch(e => {
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
