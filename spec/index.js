var cards = [
            {name: "card 1", type: "type 1"},
            {name: "card 2", type: "type 1"},
            {name: "card 3", type: "type 2"},
            {name: "card 4", type: "type 2"},
            ];

describe('Testing cardService', function() {
  var testEngine, testModule;
  var $httpBackend, $rootScope, createController, cardRequestHandler;

  beforeEach(function($injector){
    testEngine = {};
    testModule = angular.module('test', ['starter', 'ngMockE2E']);
    module('test');
  });   

  beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     $httpBackend.whenGET(/templates/).respond('');

     // Get hold of a scope (i.e. the root scope)
     $rootScope = $injector.get('$rootScope');
     // The $controller service is used to create instances of controllers
     var $controller = $injector.get('$controller');

     createController = function(controllerName) {
       return $controller(controllerName, {'$scope' : $rootScope });
     };
   }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });


  it('should fail to read data', inject(function(cardsService) {
    $httpBackend.expectGET('data/data.json').respond(401, '');

    cardsService.getCards().then(function(data){}, function(reason){
        expect(reason).toEqual('Error loading');
    });
    $httpBackend.flush();
  }));

  
  it('should read card data', inject(function(cardsService) {
    $httpBackend.expectGET('data/data.json').respond(201, cards);

    cardsService.getCards().then(function(data){
        expect(data).toEqual(cards);
    });
    $httpBackend.flush();
  }));


  it('should have types parsed: "type 1", "type 2"', inject(function(cardsService) {
    $httpBackend.expectGET('data/data.json').respond(201, cards);

    cardsService.getCards().then(function(data){
        expect(cardsService.types).toEqual(["type 1", "type 2"]);
    });
    $httpBackend.flush();
  }));


});


describe('Testing Filter groupby', function() {
  var testEngine, testModule;
  var $httpBackend, $rootScope, $filter, createController, cardRequestHandler;

  beforeEach(function($injector){
    testEngine = {};
    testModule = angular.module('test', ['starter', 'ngMockE2E']);
    module('test');
  });   

  beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     $httpBackend.whenGET(/templates/).respond('');

     // Get hold of a scope (i.e. the root scope)
     $rootScope = $injector.get('$rootScope');

     //get filter service
     $filter = $injector.get('$filter');

     // The $controller service is used to create instances of controllers
     var $controller = $injector.get('$controller');

     createController = function(controllerName) {
       return $controller(controllerName, {'$scope' : $rootScope });
     };
   }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });


  it('should group elements by type', inject(function(cardsService) {

    var typesGrouped = {"type 1" : [
            {name: "card 1", type: "type 1"},
            {name: "card 2", type: "type 1"}
            ],
            "type 2": [
            {name: "card 3", type: "type 2"},
            {name: "card 4", type: "type 2"}
            ]
        };
    
    var result = $filter("groupBy")(cards, 'type');

    console.log();
    expect(result).toEqual(typesGrouped);

  }));


});