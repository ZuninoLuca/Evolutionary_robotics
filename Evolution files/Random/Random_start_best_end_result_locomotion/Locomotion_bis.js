{	
	setupSimulation: function() {
    	this.startPos = this.getRobot().getCoreComponent().getRootPosition();
		this.max_xDiff = -1;
		this.max_yDiff = -1;
    	return true;
	},
	
	afterSimulationStep: function() {
    	var currentPos = this.getRobot().getCoreComponent().getRootPosition();
		var xDiff = currentPos.x - this.startPos.x;
		var yDiff = currentPos.y - this.startPos.y;
		
		if (Math.pow(xDiff, 2) > this.max_xDiff)
    	{
    		this.max_xDiff = Math.pow(xDiff, 2);
    	}
		
		if (Math.pow(yDiff, 2) > this.max_yDiff)
    	{
    		this.max_yDiff = Math.pow(yDiff, 2);
    	}
    	
		return true;
    },

	endSimulation: function() {
    	var currentPos = this.getRobot().getCoreComponent().getRootPosition();

		this.fitness = Math.sqrt(this.max_xDiff+ this.max_yDiff);
    	return true;
	},

	getFitness: function() {
    		return this.fitness;
	},

}