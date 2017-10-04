export default class Converter {

	constructor(time) {
		this.time = time;
	}

	get hour() {
		return this.calcHours();
	}

	get minutes(){
		return this.calcMins();
	}

	calcHours(){
		return Math.floor(this.time/3600);
	}

	calcMins(){
		return (this.time - this.hour*3600) / 60;
	}

	
}