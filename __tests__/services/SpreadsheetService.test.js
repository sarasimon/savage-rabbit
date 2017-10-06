jest.mock('superagent');
import { requestEmails, requestSkills } from '../../src/js/services/SpreadsheetService';

describe('SpreadsheetService get emails', () => {
  const RESPONSE = {
    body: {
      values: [
        ['Email', 'name', 'C#', 'JS'],
        ['jcoscol@thoughtworks.com', 'Jordi', '1', '2'],
        ['ssimon@thoughtworks.com', 'Sara', '3', '4'],
      ],
    },
  };

  const EMPTY_CELL_RESPONSE = {
    body: {
      values: [
        ['Email', 'name', 'C#', 'JS'],
        ['evulpe@thoughtworks.com', 'Emilia', '1', '2'],
        [],
        ['ssimon@thoughtworks.com', 'Sara', '3', '4'],
      ],
    },
  };

  const INVALID_EMAIL_RESPONSE = {
    body: {
      values: [
        ['Email', 'name', 'C#', 'JS'],
        ['evulpe@thoughtworks.com', 'Emilia', '1', '2'],
        ['ssimonrks.com', 'Sara', '3', '4'],
      ],
    },
  };

  test('test basic success response', () => {
    require('superagent').__setMockResponse(RESPONSE);
    requestEmails('token', 'spreadsheetId').then((result) => {
      expect(result).toEqual(['jcoscol@thoughtworks.com', 'ssimon@thoughtworks.com']);
    });
  });

  test('test empty cell response', () => {
    require('superagent').__setMockResponse(EMPTY_CELL_RESPONSE);
    requestEmails('token', 'spreadsheetId').then((result) => {
      expect(result).toEqual(['evulpe@thoughtworks.com', 'ssimon@thoughtworks.com']);
    });
  });

  test('test invalid email response', () => {
    require('superagent').__setMockResponse(INVALID_EMAIL_RESPONSE);
    requestEmails('token', 'spreadsheetId').then((result) => {
      expect(result).toEqual(['evulpe@thoughtworks.com']);
    });
  });

  test('test filtering by skill and level', () => {
    require('superagent').__setMockResponse(RESPONSE);
    requestEmails('token', 'spreadsheetId', 'JS', 3).then((result) => {
      expect(result).toEqual(['ssimon@thoughtworks.com']);
    });
  });  
});


describe('SpreadsheetService get skills', () => {

  const SKILLS_RESPONSE = {
    body: {
      values: [['JS', 'C#']],
    }
  }

  test('test ', () => {
    require('superagent').__setMockResponse(SKILLS_RESPONSE);
    requestSkills('token', 'spreadsheetId').then((result) => {
      expect(result).toEqual(['JS', 'C#']);
    });
  });

});

