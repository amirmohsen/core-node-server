function Component() {
	this.init();
}

Component.prototype = {
	
	init: function () {
		S.push(this);
	}
};