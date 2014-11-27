eventuallyjs
============

Simple polling Angularjs service for eventually consistent system frontends:


```
Eventually.setup({
					'saved': function(id, callback) {
						$http.get('/api/orders/' + id).success(function(data) {
							callback(data && data.status == 'Saved', data);
						});
					}
			})
$scope.submitOrder = function() {
				$http.post('/api/orders').success(function(data) {
					Eventually.saved(data.id, $scope.loadOrders);
					$scope.orders.push(data);
				});
			};
```