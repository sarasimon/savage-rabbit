const convertToTime = (seconds) => {
  const hour = Math.floor(seconds / 3600);
  const minute = (seconds - (hour * 3600)) / 60;

  return {
    hour,
    minute,
    second: 0,
  };
};

const convertEventDateToDatetime = (event) => {
  let start = new Date(event.start.dateTime);
  if (event.start.date !== undefined) {
    start = new Date(`${event.start.date}T00:00:00`);
  }

  let end = new Date(event.end.dateTime);
  if (event.end.date !== undefined) {
    end = new Date(`${event.end.date}T23:59:00`);
  }

  return {
    start,
    end,
  };
};

export { convertToTime, convertEventDateToDatetime };
