//= require angular/angular

const eriTestDirectives = angular.module('eriTestDirectives', []);

eriTestDirectives.directive('dailyProductsRanking', ['TopProducts', (TopProducts) => ({
    restrict: 'E',
    transclude: true,
    template: `
    <div layout="column" ng-cloak>
    	<md-toolbar>
		    <div class="md-toolbar-tools">
			    <div layout="row">
				    <h2 class="top-products-title">Top Products on</h2>
				    <md-datepicker
				    	ng-model="selectedDate"
				    	md-placeholder="Enter date"
				    	ng-change="dateSelected()"
				    	ng-disabled="loading"
				    	md-max-date="today"></md-datepicker>
			    </div>
		    </div>
		  </md-toolbar>
		  <md-content flex layout-padding>
		  		<div ng-if="!loading && selectedDate && !productsLoadingError">
						<h3 ng-if="topProducts.length === 0">
							No products on this date.
						</h3>
						<md-list>
						  <md-list-item class="md-2-line" ng-repeat="topProduct in topProducts">
						    <img ng-src="{{topProduct.product.image}}" class="md-avatar" alt="" />
						    <div class="md-list-item-text" layout="column">
						      <h3>
										<a ng-href="{{topProduct.product.link}}" target="_top">
											{{ topProduct.product.title }}
										</a>
						      </h3>
						      <h4>
						      	Sold count: {{topProduct.count}}
						      </h4>
						    </div>
						  </md-list-item>
						</md-list>
		  		</div>
		  		<div ng-if="loading">
		  			Loading...
		  		</div>
		  		<div ng-if="productsLoadingError">
		  			An error ocurred while loading products, please try again later.
		  		</div>
		  </md-content>
    </div>
    `,
    controller: ($scope) => {
      const loadProducts = () => {
      	$scope.loading = true;
      	$scope.productsLoadingError = false;
      	TopProducts
      		.load({ date: $scope.selectedDate, count: 3 })
      		.then((result) => {
      			$scope.loading = false;
      			$scope.topProducts = result
      		}, (error) => {
      			$scope.loading = false;
      			$scope.productsLoadingError = true;
      		})
      }
      
      $scope.dateSelected = () => {
      	loadProducts();
      }

      $scope.selectedDate = new Date();
      loadProducts();

      $scope.today = new Date();
    }
})]);