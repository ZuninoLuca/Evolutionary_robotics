{
    // here we define a variable for record keeping
    velocities : [],    
    deltaVelocities : [],
    maxIrVals : [],
    fitnesses : [],

    setupSimulation: function() {
		this.velocities = [];
		this.deltaVelocities = [];
		this.maxIrVals = [];
		this.startPos = this.getRobot().getCoreComponent().getRootPosition();
		return true;
    },

    // optional function called after each step of simulation
    afterSimulationStep: function() {

		//----------------------------------------------------------------------\\
		//Maximum IR value accross sensors
		var sensors = this.getRobot().getSensors();
		var maxIr = 0 
		for (var i = 0; i < sensors.length; i++) {
			if (/^Distance/.test(sensors[i].getLabel())) {
				if (sensors[i].read() > maxIr)
					maxIr = sensors[i].read();
			}			

		}
		this.maxIrVals.push(maxIr);

		//----------------------------------------------------------------------\\
		//Mean Velocity of motors
		var motors = this.getRobot().getMotors();
		var meanVelocity = (motors[1].getVelocity() - motors[0].getVelocity()) / (2.0 * 2.0 * Math.PI);
		meanVelocity = (meanVelocity + 1)/2.0;
		this.velocities.push(meanVelocity);

		//----------------------------------------------------------------------\\
		//Delta Velocity of motors
		var deltaVelocity = Math.abs(motors[1].getVelocity() + motors[0].getVelocity()) / (2.0 * 2.0 * Math.PI);
		this.deltaVelocities.push(deltaVelocity);

		return true;
    },


// optional function called at the end of the simulation
endSimulation: function() {
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
	

		var fitness = 0;
		for (var i = 0; i < this.maxIrVals.length; i++) {
			// Your fitness function here.
			
			//fitness += this.velocities[i]*(1-this.maxIrVals[i])*this.deltaVelocities[i] + this.velocities[i]*minDistance; 
			fitness += (1-this.maxIrVals[i]);
			// You can already use this.velocities[i], this.deltaVelocities[i] , this.maxIrVals[i] and minDistance for your fitness function
			// Your fitness function here.
		}
	

		// Return fitness variable to submit your own fitness
		this.fitnesses.push(fitness*minDistance);
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
