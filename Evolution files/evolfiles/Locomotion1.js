{
	stepFitness : [],
	
	setupSimulation: function() {
		// record the starting position
    	this.startPos = this.getRobot().getCoreComponent().getRootPosition();
		this.stepFitness = [];
		this.fitness = 0;
    	return true;
	},
	
	afterSimulationStep: function() {
	
	// find the distance between the starting position and ending position
    	var currentPos = this.getRobot().getCoreComponent().getRootPosition();
		var xDiff = (currentPos.x - this.startPos.x);
    	var yDiff = (currentPos.y - this.startPos.y);
		var zDiff = (currentPos.z - this.startPos.z);
		var res = 0;
		res = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2) + Math.pow(zDiff,2));
		this.stepFitness.push(res);
		return true;
    },

	endSimulation: function() {
	
		for (var i = 0; i < this.stepFitness.length; i++) {
			// Your fitness function here.
			this.fitness = this.fitness + this.stepFitness[i];
			}
			return true;
	},

	getFitness: function() {
    		return this.fitness;
	},
}