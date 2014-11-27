(function(window, angular) {
  'use strict';
  var Eventually = {
      interval: 1000,
      setup: function(events) {        
        var self = this;
        for(var k in events) {
          (function(n) {
            var check = events[n];
            var fn = function(n) { 
              var orig = arguments;
              var args = Array.prototype.slice.call(arguments, 0, arguments.length-1);
              var success = Array.prototype.slice.call(arguments, arguments.length-1)[0];
              var cb = function(stop) {
                if(stop) {
                  success();
                } else {
                  setTimeout(function() {
                    fn.apply(fn, Array.prototype.slice.call(orig, 0))
                  }, Eventually.interval);
                }
              }
              check.apply(check, Array.prototype.concat.call(args, [cb]));
            }
            self[n] = fn; // saved(id, success);
          })(k);
        }
      }
    };    
   
   angular.module('ngEventually', []).factory('Eventually', function() {
    return Eventually;
  });

})(window, window.angular);