//= require angular/angular

const eriTestServices = angular.module('eriTestServices', []);

eriTestServices.factory('TopProducts', ['$http',
  function($http){
    return {
      load: function({ date, count }) {
        return $http({
        	url: '/products/most_ordered.json',
        	method: 'GET',
        	params:{ date, count }
        }).then(({ data }) => data)
      }
    }
  }]);