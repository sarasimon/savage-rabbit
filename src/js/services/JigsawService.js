import request from 'superagent';

const requestPeople = (token) => {
  const url = 'https://jigsaw.thoughtworks.net/api/people?home_office=Barcelona';

  request.get(url)
	       .set('Authorization', 'Bearer 666733d7a3d4e6b1df3b51bc7aa67e3d');
};

export default requestPeople;
