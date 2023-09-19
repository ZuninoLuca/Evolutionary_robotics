{
	maxIrVals : [],
	
	setupSimulation: function() {
		// record the starting position
    	this.startPos = this.getRobot().getCoreComponent().getRootPosition();
    	this.max_x = -1;
    	this.max_y = -1;
    	this.max_z = -1;
		this.max_r = -1;
		this.max_p = -1;
		this.maxIrVals = [];
		this.fitnessIR = 0;
    	return true;
	},
	
	afterSimulationStep: function() {
	
	// find the distance between the starting position and ending position
    	var sensors = this.getRobot().getCoreComponent().getSensors();
		
		var maxIr = 0;
		for (var i = 0; i < sensors.length; i++) {
			if (/^Distance/.test(sensors[i].getLabel())) {
				if (sensors[i].read() > maxIr)
					maxIr = sensors[i].read();
			}	
		
		
		}
		this.maxIrVals.push(maxIr);
		
    	for (var i = 0; i < sensors.length; i++)
    	{
    		var sensor = sensors[i];
    		if (sensor.getType()=="ImuSensorElement") {
    			var label = sensor.getLabel();
    			if (/x-acceleration$/.test(label)) {
        			// do something with x acceleration
        			if (Math.abs(sensor.read()) > this.max_x) {
        				this.max_x = Math.abs(sensor.read());
        			}
    			} else if (/y-acceleration$/.test(label)) {
        			// do something with y acceleration
        			if (Math.abs(sensor.read()) > this.max_y) {
        				this.max_y = Math.abs(sensor.read());
        			}
    			} else if (/z-acceleration$/.test(label)) {
        			// do something with z acceleration
        			if (Math.abs(sensor.read()) > this.max_z) {
        				this.max_z = Math.abs(sensor.read());
        			}
    			} else if (/Roll$/.test(label)) {
        			// do something with roll
					if (Math.abs(sensor.read()) > this.max_r) {
        				this.max_r = Math.abs(sensor.read());
        			}
    			} else if (/Pitch$/.test(label)) {
        			// do something with pitch
					if (Math.abs(sensor.read()) > this.max_p) {
        				this.max_p = Math.abs(sensor.read());
        			}
    			} else if (/Yaw$/.test(label)) {
        			// do something with yaw
    			}
			}	
		}
		return true;
    },

	endSimulation: function() {
	
		var nsensors = 0;
		var sensors = this.getRobot().getCoreComponent().getSensors();
		for (var i = 0; i < sensors.length; i++) {
			if (/^Distance/.test(sensors[i].getLabel())) {
				nsensors += 1;
			}
			}
		if (nsensors > 4)
		{
			nsensors = 4;
		}
	
		for (var i = 0; i < this.maxIrVals.length; i++) {
			// Your fitness function here.
			this.fitnessIR += (1 - 1.2*this.maxIrVals[i]); 
		}
		this.fitnessIR = this.fitnessIR / this.maxIrVals.length;
		
		// find the distance between the starting position and ending position
    	var currentPos = this.getRobot().getCoreComponent().getRootPosition();
		var xDiff = (currentPos.x - this.startPos.x);
    	var yDiff = (currentPos.y - this.startPos.y);
		var zDiff = (currentPos.z - this.startPos.z);
    	this.fitness = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2) + Math.pow(zDiff,2));
    	
    	var max = this.max_x + this.max_y + this.max_z;
		var max_ = this.max_r + this.max_p;
    	var stability_fitness =0.5*( 1/(max + 0.5)) +0.5*( 1/(max_ + 0.5));
    	
		this.fitness = 0.9*this.fitnessIR*nsensors + 0.5*this.fitness + 0.2*stability_fitness;
		
    	return true;
	},

	getFitness: function() {
    		return this.fitness;
	},

}