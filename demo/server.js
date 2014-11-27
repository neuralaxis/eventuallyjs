var restify = require('restify');

var server = restify.createServer({
  
});

var orders = {
	lastId: 0,
	list: [],
	find: function(id) {
		return this.list.filter(function(o) { return o.id == id; })[0];
	},
	save: function() {
		var self = this;
		var order = null;
		self.lastId += 1;
		order = {id:self.lastId, status:'Saving'};		
		var delayedProcess = function() {
			setTimeout(function() {
				order.status = 'Saved';
				self.list.push(order);
			}, 5000);
		};
		delayedProcess();
		return order;
	},
	del: function(id) {
		var self = this;
		var order = self.find(id);
		var delayedProcess = function() {
			setTimeout(function() {
				self.list.splice(self.list.indexOf(order), 1);
			}, 5000);
		}
		delayedProcess();
	}
}

server.post('/api/orders', function(req,res,next) {
	var order = orders.save();
	res.send(order);
	return next();
});

server.get('/api/orders', function(req,res,next) {
	res.send(orders.list);
	return next();
});

server.get('/api/orders/:id', function(req,res,next) {
	var id = req.params.id;
	var order = orders.find(id);
	if(order) res.send(order);
	else res.send(404);
	return next();
});

server.del('/api/orders/:id', function(req,res,next) {
	orders.del(req.params.id);
	res.send(200);
	return next();
});

server.get(/\/src\/?.*/, restify.serveStatic({
  directory: './../'
}));

server.get(/\/?.*/, restify.serveStatic({
  directory: './static',
  default:'index.html'
}));

server.listen(8080, function() {
	console.log('listening at %s', server.url);
});