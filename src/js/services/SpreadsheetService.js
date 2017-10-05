import request from 'superagent';
import validator from 'email-validator';
import _ from 'lodash';

const processRequest = (res) => {
  const emails = _.flatten(res.body.values);

  return emails.filter((email) => {
    if (validator.validate(email)) {
      return true;
    }
    return false;
  });
};

const requestEmails = (token, spreadsheetId, range) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          const listOfEmails = processRequest(res);
          resolve(listOfEmails);
        }
      });
  });
};

export default requestEmails;
