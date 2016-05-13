var edge = require('edge');

module.exports = {
	XrmFakedContext: function () {
		this.data = []; //list of entities in memory

		this.initialize = edge.func({
			source: 'ProxyInitialize.cs',
			references: ['FakeXrmEasy.dll']
		});
		
	}
};