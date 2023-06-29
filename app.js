(function() {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowCtrl = this;
      narrowCtrl.searchTerm = "";
      narrowCtrl.found = [];
  
      narrowCtrl.narrowItDown = function() {
        if (narrowCtrl.searchTerm.trim() === "") {
          narrowCtrl.found = [];
          return;
        }
  
        var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm);
        promise.then(function(foundItems) {
          narrowCtrl.found = foundItems;
        });
      };
  
      narrowCtrl.removeItem = function(index) {
        narrowCtrl.found.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function(searchTerm) {
        return $http({
          method: "GET",
          url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
        }).then(function(result) {
          var menuItems = result.data.menu_items;
          var foundItems = [];
  
          for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              foundItems.push(menuItems[i]);
            }
          }
  
          return foundItems;
        });
      };
    }
  
    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'foundItemsCtrl',
        bindToController: true
      };
  
      return ddo;
    }
  
    function FoundItemsDirectiveController() {
      var foundItemsCtrl = this;
    }
  
  })();
  