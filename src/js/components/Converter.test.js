import Converter from './Converter'

test('3660 seconds converts to 1 minute', () => {
  let c = new Converter(3660);
  expect(c.minutes).toBe(1);
});

test('3660 seconds converts to 1 hour', () => {
	let c = new Converter(3660);
	expect(c.hour).toBe(1);
  });