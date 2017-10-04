import request from 'superagent';

const processRequest = (res) => {
  const emails = res.body.values;
  return emails;
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
