import moment from 'moment';

const config = {
  defaultDayStart: moment().set({ hour: 9, minute: 0, second: 0 }),
  defaultDayEnd: moment().set({ hour: 18, minute: 0, second: 0 }),
  defaultInterviewDuration: moment().set({ hour: 0, minute: 15, second: 0 }),
  sheetId: '1CsMCDldvbNPuQto-b8EAnnuiZn8U1L7BGfnrkwMcx5Q',
};

export default config;

