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

  const EMPTY_CELL_RESPONSE = {
    body: {
      values: [
        'jcoscol@thoughtworks.com',
        '',
        'evulpe@thoughtworks.com',
      ],
    },
  };

  const INVALID_EMAIL_RESPONSE = {
    body: {
      values: [
        'evulpethoughtworks.com',
        'evulpe@thoughtworks.com',
      ],
    },
  };

  test('test basic success response', () => {
    require('superagent').__setMockResponse(RESPONSE);
    requestEmails('token', 'spreadsheetId', 'A1:A99').then((result) => {
      expect(result).toEqual(['jcoscol@thoughtworks.com']);
    });
  });

  test('test empty cell response', () => {
    require('superagent').__setMockResponse(EMPTY_CELL_RESPONSE);
    requestEmails('token', 'spreadsheetId', 'A1:A99').then((result) => {
      expect(result).toEqual(['jcoscol@thoughtworks.com', 'evulpe@thoughtworks.com']);
    });
  });

  test('test invalid email response', () => {
    require('superagent').__setMockResponse(INVALID_EMAIL_RESPONSE);
    requestEmails('token', 'spreadsheetId', 'A1:A99').then((result) => {
      expect(result).toEqual(['evulpe@thoughtworks.com']);
    });
  });
});

