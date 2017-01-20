(function(){
  'use strict';

  angular.module('ShoppingListDirectiveApp', [])
  .controller('ShoppingListController1', ShoppingListController1)
  .controller('ShoppingListController2', ShoppingListController2)
  .factory('ShoppingListFactory', ShoppingListFactory)
  .directive('shoppingList', ShoppingList);


  function ShoppingList() {
    var ddo = {
      //  restrict: 'E',               // if E: restricting whole element i.e. 'E' from html DOM and if 'A': restricting attribute ng-repeat i.e. 'A' from html DOM
       templateUrl: 'shoppingList.html',
       scope:{
         list:"=myList",
         title: '@myTitle'
       }
    };
    return ddo;
  }

  // LIST #1 - controller: unlimited items
  ShoppingListController1.$inject = ['ShoppingListFactory'];
  function ShoppingListController1(ShoppingListFactory) {
    var list = this;

    // use factory to create new shopping list service
    var shoppingList = ShoppingListFactory();
    list.items = shoppingList.getItems();
    var origTile = "Shopping List #1";
    list.title = origTile + " (" + list.items.length + " items)";

    list.itemName = "";
    list.quantity = "";
    // consuming call to service to add item method
    list.addItem = function () {
      shoppingList.addItem(list.itemName, list.quantity);
      list.title = origTile + " (" + list.items.length + " items)";
    }
    // consuming call to service to remove item method
    list.removeItem = function (itemIndex) {
      shoppingList.removeItem(itemIndex);
      list.title = origTile + " (" + list.items.length + " items)";
    }
  }

  // LIST #2 - controller: (limited to 3 items)
  ShoppingListController2.$inject = ['ShoppingListFactory'];
  function ShoppingListController2(ShoppingListFactory) {
    var list = this;
    // Use factory to create new shopping list service
    var shoppingList = ShoppingListFactory(3);

    list.items = shoppingList.getItems();
    list.itemName = "";
    list.itemQuantity = "";
    // consuming call to service to get items method
    list.addItem = function () {
        try {
          console.log('inside ctrl2');
          shoppingList.addItem(list.itemName, list.quantity)
        } catch (error) {
          list.errorMessage = error.message;
        }
      }
      list.removeItem = function (itemIndex) {
        shoppingList.removeItem(itemIndex);
      }
  };

  // Service implementation
  // If not specified, maxItems assumed unlimited
  function ShoppingListService(maxItems) {
      var service = this;

      // List of shopping items
      var items = [];

      // Servie method for adding item
      service.addItem = function (itemName, quantity) {
        console.log('inside additem');
        if ((maxItems === undefined) || (maxItems !== undefined) && (items.length < maxItems)) {
          var item = {
            name: itemName,
            quantity: quantity
          };
          items.push(item);
        }else{
          throw new Error("Max Items (" + maxItems +") reached.");
        }
      };

      // Servie method to remove items from list
      service.removeItem = function (itemIndex) {
        console.log('inside removeitem: ', itemIndex);
        items.splice(itemIndex, 1);
      }

      // Servie method to get items
      service.getItems = function () {
        console.log('inside getitems: ', items);
        return items;
      };
  }

  function ShoppingListFactory() {
    var factory = function (maxItems) {
      return new ShoppingListService(maxItems);
    };
    return factory;
  }
})();
