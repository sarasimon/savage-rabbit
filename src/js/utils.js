const convertToTime = (seconds) => {
  const hour = Math.floor(seconds / 3600);
  const minute = (seconds - (hour * 3600)) / 60;

  return {
    hour,
    minute,
    second: 0,
  };
};

export default convertToTime;
