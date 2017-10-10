jest.mock('superagent');
import { requestEmails, requestSkills } from '../../src/js/services/SpreadsheetService';

describe('SpreadsheetService get emails', () => {
  const RESPONSE = {
    body: {
      values: [
        ['Email', 'Name', 'C#', 'JS'],
        ['jcoscol@thoughtworks.com', 'Jordi', '1', '2'],
        ['ssimon@thoughtworks.com', 'Sara', '3', '4'],
      ],
    },
  };

  const EMPTY_CELL_RESPONSE = {
    body: {
      values: [
        ['Email', 'Name', 'C#', 'JS'],
        ['evulpe@thoughtworks.com', 'Emilia', '1', '2'],
        [],
        ['ssimon@thoughtworks.com', 'Sara', '3', '4'],
      ],
    },
  };

  const INVALID_EMAIL_RESPONSE = {
    body: {
      values: [
        ['Email', 'Name', 'C#', 'JS'],
        ['evulpe@thoughtworks.com', 'Emilia', '1', '2'],
        ['ssimonrks.com', 'Sara', '3', '4'],
      ],
    },
  };

  test('test basic success response', () => {
    require('superagent').__setMockResponse(RESPONSE);
    requestEmails('token', 'spreadsheetId', 'JS', 0).then((result) => {
      expect(result).toEqual([{
        email: 'jcoscol@thoughtworks.com',
        name: 'Jordi',
        level: '2',
      }, {
        email: 'ssimon@thoughtworks.com',
        name: 'Sara',
        level: '4',
      }]);
    });
  });

  test('test empty cell response', () => {
    require('superagent').__setMockResponse(EMPTY_CELL_RESPONSE);
    requestEmails('token', 'spreadsheetId', 'JS', 0).then((result) => {
      expect(result).toEqual([{
        email: 'evulpe@thoughtworks.com',
        name: 'Emilia',
        level: '2',
      }, {
        email: 'ssimon@thoughtworks.com',
        name: 'Sara',
        level: '4',
      }]);
    });
  });

  test('test invalid email response', () => {
    require('superagent').__setMockResponse(INVALID_EMAIL_RESPONSE);
    requestEmails('token', 'spreadsheetId', 'JS', 0).then((result) => {
      expect(result).toEqual([{
        email: 'evulpe@thoughtworks.com',
        name: 'Emilia',
        level: '2',
      }]);
    });
  });

  test('test filtering by skill and level', () => {
    require('superagent').__setMockResponse(RESPONSE);
    requestEmails('token', 'spreadsheetId', 'JS', 3).then((result) => {
      expect(result).toEqual([{
        email: 'ssimon@thoughtworks.com',
        name: 'Sara',
        level: '4',
      }]);
    });
  });
});


describe('SpreadsheetService get skills', () => {
  const SKILLS_RESPONSE = {
    body: {
      values: [['JS', 'C#']],
    },
  };

  test('test get skills', () => {
    require('superagent').__setMockResponse(SKILLS_RESPONSE);
    requestSkills('token', 'spreadsheetId').then((result) => {
      expect(result).toEqual(['JS', 'C#']);
    });
  });
});

