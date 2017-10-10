import request from 'superagent';
import validator from 'email-validator';

const processRequest = (rows, skill, level) => {
  const headers = rows[0];
  const indexOfSkill = headers.indexOf(skill);
  const indexOfEmail = headers.indexOf('Email');
  const indexOfName = headers.indexOf('Name');

  return rows
    .filter(row => row[indexOfSkill] >= level || !skill || skill === 'Any skill')
    .filter(row => validator.validate(row[indexOfEmail]))
    .map(row => ({
      email: row[indexOfEmail],
      name: row[indexOfName],
      level: row[indexOfSkill] ? row[indexOfSkill] : '',
    }));
};

const requestEmails = (token, spreadsheetId, skill, level) => {
  const range = 'A1:ZZ999';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          const listOfPeople = processRequest(res.body.values, skill, level);
          resolve(listOfPeople);
        }
      });
  });
};

const requestSkills = (token, spreadsheetId) => {
  const range = 'C1:ZZ1';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          const listOfSkills = res.body.values[0];
          listOfSkills.push('Any skill');
          resolve(listOfSkills);
        }
      });
  });
};

export { requestEmails, requestSkills };
