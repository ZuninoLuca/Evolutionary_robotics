{
    // here we define a variable for record keeping
	fitnesses : [],
	hasIrSensor : false,
	destroysWall: false,
	
    setupSimulation: function() {
		this.fitnesses = [];
		this.maxRot = 0;
		this.maxAcc = 0;
		this.maxZ = 0;
		this.startPos = this.getRobot().getCoreComponent().getRootPosition();
		
		var sensors = this.getRobot().getSensors();
		// check if the robot has a light sensor
		for (var i=0; i<sensors.length; i++) {
			if (sensors[i].getType() == "IrSensor") {
				this.hasIrSensor = true;
			}
		}
		// if there is no light sensor then stop the simulator
		if (!this.hasIrSensor) {
			this.stopSimulationNow();
		}
		
		//console.log("number of obstacles:")
		//console.log(this.getEnvironment().getObstacles().length)
		
		if (this.getEnvironment().getObstacles().length != 12) {
			this.destroysWall = true;
			this.stopSimulationNow();
		}
		
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
		
		this.fitnesses.push(minDistance);

		return true;
    },

    // the one required method... return the fitness!
    getFitness: function() {
        // return bad fitness if no ir sensor
        if (!this.hasIrSensor||this.destroysWall) {
            return -10000;
        }
		
		var fitness = this.fitnesses[0];
		for (var i= 1; i < this.fitnesses.length; i++) {
			if (this.fitnesses[i] < fitness)
				fitness = this.fitnesses[i];
		}
		return fitness;
    },
}
