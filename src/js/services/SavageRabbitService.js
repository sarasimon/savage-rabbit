import _ from 'lodash';
import CalendarService from './CalendarService';
import { requestEmails } from './SpreadsheetService';

let people = [];

const requestFreeSlots =
(token, sheetId, skill, level, workingDayStart, workingDayEnd, interviewDuration) =>
  requestEmails(token, sheetId, skill, level)
    .then(listOfPeople => CalendarService.requestInterviewsPerPerson(token, workingDayStart)
      .then((attendeesCount) => {
        const peopleWithInterviews = listOfPeople.map(person => ({
          ...person,
          weekInterviews: attendeesCount[person.email] || 0,
        }));
        return peopleWithInterviews.filter(person => person.weekInterviews <= 2);
      }))
    .then((listOfPeople) => {
      people = listOfPeople;
      return CalendarService.requestAvailability(token,
        workingDayStart,
        workingDayEnd,
        interviewDuration,
        listOfPeople.map(item => item.email));
    })
    .then((freeSlots) => {
      const merged = _.map(people, item => _.assign(item, _.find(freeSlots, ['email', item.email])))
       .filter(person => person.data.length > 0);
      return _.reverse(_.sortBy(merged, ['level']));
    });

export default requestFreeSlots;
