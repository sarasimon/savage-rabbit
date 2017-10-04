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
    // Set up some mocked out file info before each test
    require('superagent').__setMockResponse(RESPONSE);
  });

  test('test basic success response', () => {
    requestEmails('token', 'spreadsheetId', 'A1:A99').then((result) => {
      expect(result).arrayContaining(['jcoscol@thoughtworks.com']);
    });
  });
});
