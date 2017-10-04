jest.mock('superagent');
import requestSingleAvailability from '../../src/js/services/CalendarService';

describe('CalendarService', () => {

  const RESPONSE = {
    body:
      [{email: 'evulpe@thoughtworks.com',
        data: ['slot1', 'slot2'],
        }]
  };

  test('test basic success response', () => {
    require('superagent').__setMockResponse(RESPONSE);
    requestSingleAvailability('token', new Date(), new Date(),
  'interviewDuration', 'email').then((result) => {
      expect(result).toEqual([{email: 'email',
        data: ['slot1', 'slot2'],
        }])
    });
  });

});

