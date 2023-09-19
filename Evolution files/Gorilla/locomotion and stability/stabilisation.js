{
    // here we define a variable for record keeping
	fitnesses : [],

    setupSimulation: function() {
		this.fitnesses = [];
		this.maxRot = 0;
		this.maxAcc = 0;
		this.maxZ = 0;
		this.startPos = this.getRobot().getCoreComponent().getRootPosition();
		return true;
    },

    // optional function called after each step of simulation
    afterSimulationStep: function() {

		//----------------------------------------------------------------------\\
		//Core oscillations and accelerations
		var sensors = this.getRobot().getCoreComponent().getSensors()
		for (var i = 0; i < sensors.length; i++) {
			var sensor = sensors[i]
			if (sensor.getType()=="ImuSensorElement") {
				var label = sensor.getLabel();
				if (/x-acceleration$/.test(label)) {
					var value = Math.abs(sensor.read());
					if (value > this.maxAcc) this.maxAcc = value;
					
				} else if (/y-acceleration$/.test(label)) {
					var value = Math.abs(sensor.read());
					if (value > this.maxAcc) this.maxAcc = value;
					
				} else if (/z-acceleration$/.test(label)) {
					var value = Math.abs(sensor.read());
					if (value > this.maxAcc) this.maxAcc = value;
					
				} else if (/Roll$/.test(label)) {
					var value = Math.abs(sensor.read());
					if (value > this.maxRot) this.maxRot = value;
					
				} else if (/Pitch$/.test(label)) {
					var value = Math.abs(sensor.read());
					if (value > this.maxRot) this.maxRot = value;
					
				} else if (/Yaw$/.test(label)) {
					var value = Math.abs(sensor.read());
					if (value > this.maxRot) this.maxRot = value;
				}
			}
		}
		
		//----------------------------------------------------------------------\\
		//Core z-axis
		var z_value = this.getRobot().getCoreComponent().getRootPosition().z;
		if (this.maxZ < z_value) this.maxZ = z_value;
		
		return true;
    },


	// optional function called at the end of the simulation
	endSimulation: function() {
		
		//----------------------------------------------------------------------\\
		// Compute robot ending position from its closest part to the origin
		var minDistance = Number.MAX_VALUE;
			    
		bodyParts = this.getRobot().getBodyParts();
		for (var i = 0; i < bodyParts.length; i++) {
			var xDiff = (bodyParts[i].getRootPosition().x - this.startPos.x);
			var yDiff = (bodyParts[i].getRootPosition().y - this.startPos.y);
			var dist = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
		            
			if (dist < minDistance) {
				minDistance = dist;
			}
		}
		
		//----------------------------------------------------------------------\\
		// Compute total fitness
		
		this.maxRot = Math.max(this.maxRot,0.5);
		this.maxRot -= 0.5;
		
		this.fitnesses.push(2*minDistance + 2*this.maxZ /*- 0.001*this.maxAcc*/ - 0.1*Math.sqrt(this.maxRot) - (minDistance<0.01)*1000);

		return true;
    },

    // the one required method... return the fitness!
    getFitness: function() {
		var fitness = this.fitnesses[0];
		for (var i= 1; i < this.fitnesses.length; i++) {
			if (this.fitnesses[i] < fitness)
				fitness = this.fitnesses[i];
		}
		return fitness;
    },
}