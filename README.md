eventuallyjs
============

Angularjs service for polling eventually consistent systems:

Sometimes when a user performs an action such as clicking "Save" for a new record, the server does not fully process the request immediately upon responding - as in, the record is not yet committed to a database, for example - but rather queues it for execution by another process.

This pattern is frequently used by [CQRS](http://martinfowler.com/bliki/CQRS.html)-style architectures. The challenge for the UI layer is that in certain cases we would like to clue the user in to the fact that the work is not exactly completed yet, and to let them know when it is. 

Helping to (hopefully) cleanly cope with this within an Angular application is what this little service attempts to do. This solution involves triggering a repeating poll the server at a configurable interval until a condition (e.g. the record has been committed) is satisfied.

First, we configure our Eventually instance with a mapping of event names to "poll" functions. The poll function can take any number of arguments, but the last one will always be a callback that accepts **true** for "hey, we're done here", or **false** for "hey, check again later". If the callback is not invoked, then the poll function will not be called again by Eventually.

So, configure the events & poll functions:

```javascript
Eventually.setup({
					'saved': function(id, callback) {
						$http.get('/api/orders/' + id).success(function(data) {
							callback(data && data.status == 'Saved', data);
						});
					}
			});
```

Then, whenever we perform a command which will "eventually" complete, we begin polling by a call on the Eventually instance to our configured event (in this case *saved*), passing in the arguments to pass the corresponding poll function, and the "success" callback. 

The poll function is called every 1s by default until we succeed, or fail to call the callback function from within it. 


Begin polling:

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
