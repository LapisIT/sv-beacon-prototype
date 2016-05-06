angular.module('svBeaconPrototype')
  .factory('SvOffices',
    function ($http, $q, $log,
              Validations, PoiData, OfficeData) {
      var SvOffices = {pois:PoiData.pois, office:OfficeData,
      }, isDefined = Validations.isDefined;

      SvOffices.load = function () {
        var deferred = $q.defer();

        return deferred.promise;
      };

      return SvOffices;


    })
