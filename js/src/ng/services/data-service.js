define([], function()
{
    var services = angular.module('app.Services', ['firebase']);

    services.factory('configService', ['$q', '$http', function($q, $http) {

      var sup = this;

      this.load = function(){
        var defer = $q.defer();

        $http.get('/js/config.json').success(function(data, status, headers, config) {
          console.log(data);
        }).error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

        return defer.promise;
      }

      return this;

    }]);

    services.factory('datService', ['$q', '$http', 'appConfig', 'configService', function($q, $http, appConfig, configService) {

        var sup = this;
        this.categorias = null;
        this.paginas = null;

        var categoriasRef = new Firebase(appConfig.categoriasRef);
        var paginasRef = new Firebase(appConfig.paginasRef);


        configService.load();


      this.loadData = function(){
        var defer = $q.defer();

        categoriasRef.on('value', function(dataSnapshot) {
          var categorias = dataSnapshot.val();

          paginasRef.on('value', function(dataSnapshot) {
            Firebase.goOffline();
            var paginas = dataSnapshot.val();

            defer.resolve({categorias: categorias, paginas: paginas});
          });
        });

        return defer.promise;
      }

      this.getData = function(){
        var defer = $q.defer();

        if(this.categorias == null && this.paginas == null){
          this.categorias = {};
          this.paginas = {};

          this.loadData().then(function(data){
            angular.forEach(data.paginas, function(value, key){
                var parent = value.parentId;

                if(data.categorias[parent] && value.state == "available"){
                  sup.categorias[parent] = data.categorias[parent];
                  sup.categorias[parent].url = (sup.categorias[parent].url)? '/pages/'+sup.categorias[parent].slug : '/'+value.slug;
                }
            });
            defer.resolve();
          });
        }//end if

        return defer.promise;
      }

      return this;

    }]);


    return services;
});