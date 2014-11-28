# eventuallyjs

## An Angularjs service for polling eventually consistent systems.

Sometimes when a user performs an action such as clicking "Save" for a new record, the server does not fully process the request immediately upon responding - as in, the record is not yet committed to a database, for example - but rather queues it for execution by another process.

This pattern is frequently used in [CQRS](http://martinfowler.com/bliki/CQRS.html)-style architectures. The challenge for the UI layer is that in certain cases, we would like to clue the user in to the fact that the work is not exactly completed yet, but should be soon, and to let them know when it is. 

Helping to (hopefully) cleanly cope with this within an Angular application is what this little service attempts to do. This solution involves triggering a repeating poll the server at a configurably reasonable interval until a condition (e.g. the record has been committed) is satisfied.

First, we configure our Eventually instance with a mapping of event names to "poll" functions. The poll function can take any number of arguments, but the last one will always be a callback that accepts **true** for success, aka "we're done here, no need to keep checking", or **false** for "nothing new, check again later". If the callback is not invoked at all, then the poll function will not be called again by Eventually.

So, let's configure an event poll:

```javascript
Eventually.setup({
					'saved': function(id, callback) {
						$http.get('/api/orders/' + id).success(function(data) {
							callback(data && data.status == 'Saved', data);
						});
					}
			});
```

This registers a "saved" function on the instance... 

```javascript
Eventually.saved(...)
```

This will begin calling the registered poll function on an interval. The method can take any number of arguments, which will be passed to the poll function (in our case, *id*), but the last argument must be the callback to invoke when the poll reports success.

The poll function is called every 1s by default until we succeed or fail to call the callback function from within it. 

Begin polling:

```javascript
$scope.submitOrder = function() {
				$http.post('/api/orders').success(function(data) {
					Eventually.saved(data.id, $scope.loadOrders); 
					$scope.orders.push(data);
				});
			};
```

> I realize the cool kids are doing websockets these days for this type of problem. If you've ever had to support websockets in an enterprise network, under CORS, or in the cloud, then you know that solution isn't exactly a walk in the park.


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
