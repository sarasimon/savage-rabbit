jest.mock('superagent');
import requestEmails from '../../src/js/services/SpreadsheetService';

describe('SpreadsheetService', () => {
  const RESPONSE = {
    body: {
      values: [
        'jcoscol@thoughtworks.com',
      ],
    },
  };

  beforeEach(() => {
    require('superagent').__setMockResponse(RESPONSE);
  });

  test('test basic success response', () => {
    requestEmails('token', 'spreadsheetId', 'A1:A99').then((result) => {
      expect(result).toEqual(['jcoscol@thoughtworks.com']);
    });
  });
});
