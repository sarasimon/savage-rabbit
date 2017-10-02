import moment from 'moment';

const config = {
  people: ['evulpe@thoughtworks.com', 'ssimon@thoughtworks.com'],
  defaultDayStart: moment().set({ hour: 9, minute: 0, second: 0 }),
  defaultDayEnd: moment().set({ hour: 18, minute: 0, second: 0 }),
  defaultInterviewDuration: moment().set({ hour: 1, minute: 0, second: 0 }),
};

export default config;

