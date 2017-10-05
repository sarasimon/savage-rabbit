jest.mock('superagent');
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
    CalendarService.requestSingleAvailability('token', new Date(), new Date(),
  'interviewDuration', 'email').then((result) => {
      expect(result).toEqual([{email: 'email',
        data: ['slot1', 'slot2'],
        }])
    });
  });

  test('test error response', () => {
    require('superagent').__setMockError("error");
    expect.assertions(1);
    return CalendarService.requestSingleAvailability('token', new Date(), new Date(),
  'interviewDuration', 'email').catch(e =>
    expect(e).toMatch('error')
    );
  });

});

