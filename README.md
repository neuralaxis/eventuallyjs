eventuallyjs
============

Simple polling Angularjs service for eventually consistent system frontends:


Sometimes, when a user requests an action such as saving a new record through a user interface, the server does not fully process the request immediately - as in, the record is not persisted to a database, for example - but rather queues it for execution by another process.

This pattern is frequently used by [CQRS-style architectures](http://martinfowler.com/bliki/CQRS.html). The challenge for the UI layer then, is that in certain cases we would like to clue the user to the fact that the item is not exactly processed yet, and to let them know when it is. 

Helping to (hopefully) cleanly cope with this within an Angular application is what this little service attempts to do.

First, we configure our Eventually instance with a mapping of event names to "check" functions. The check function can take any number of arguments, but the last argument will always be a callback that accepts **true** for operation completed, or **false** for "hey, check again later". If the callback is not called, then the checker will not be called again:

```javascript
Eventually.setup({
					'saved': function(id, callback) {
						$http.get('/api/orders/' + id).success(function(data) {
							callback(data && data.status == 'Saved', data);
						});
					}
			})
```

Then, whenever we perform a command which will "eventually" complete, we call a function on the Eventually instance with our event name (in this case *saved*), passing in first the arguments to the checker function, and last the "success" function. Success is defined as the checker function calling its callback with a *true* argument:

```javascript
$scope.submitOrder = function() {
				$http.post('/api/orders').success(function(data) {
					Eventually.saved(data.id, $scope.loadOrders);
					$scope.orders.push(data);
				});
			};
```

## Demo application:

```bash
cd demo && npm init && cd static && bower init
node server.js
```

## Building:
```bash
npm install
gulp
```
