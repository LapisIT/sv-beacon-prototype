angular.module('svBeaconPrototype.apis', ['ngStorage'])
  .factory('SpeciesReportingApis',
  function ($http, $q, $log,$localStorage,
            Validations) {
    var SpeciesReportingApis = {}, isDefined = Validations.isDefined, isEmpty = Validations.isEmpty,
      storage = $localStorage.$default({
        apiTarget: 'uat'
      });

    var registryUrl = 'http://registry.species-reporting.spatialvision.com.au/nccma/apis.json';

    function registry() {
      var deferred = $q.defer();

      if(isDefined(storage.apis)) {
        deferred.resolve(storage.apis);
        return deferred.promise;
      }

      $http.get(registryUrl).then(function(res) {
        storage.apis = res.data;
        deferred.resolve(storage.apis);
      })

      return deferred.promise;
    }

    SpeciesReportingApis.init = function($rootScope, $location) {
      $rootScope.isWeb = false;
      $rootScope.isWebUat = false;
      SpeciesReportingApis.isWebUat($location).then(function (isWebUat) {
        $rootScope.isWebUat = isWebUat;
      });
      SpeciesReportingApis.isWeb($location).then(function (isWeb) {
        $rootScope.isWeb = isWeb;
      });
      return SpeciesReportingApis;
    }

    SpeciesReportingApis.contentBase = function() {
      return registry().then(function(apis) {
        return apis.content[storage.apiTarget];
      })
    }

    /**
     * reportBase will be empty if it's a web edition as it is served via nginx proxy
     * @returns {*}
     */
    SpeciesReportingApis.reportBase = function($location) {
      return isWeb($location).then(function(isWeb) {
        if(isWeb) {
          return '';
        }
        return registry().then(function(apis) {
          return apis.report[storage.apiTarget];
        })

      })
    }

    function containHttp(url) {
      return (url && url.indexOf('http') > -1);
    }
    function containDev(url) {
      return (url && url.indexOf('dev') > -1 || url.indexOf(':810') > -1);
    }
    function containUatInUrl(url, apis) {
      return (url && url.indexOf(apis.web.uat) > -1);
    }

    function isWeb($location) {
      var url = $location.absUrl();
      $log.info('SpeciesReportingApis.isWebUat ', url);
      return registry().then(function(apis) {
        var isContainHttp = containHttp(url);
        $log.info('SpeciesReportingApis.isWeb ', isContainHttp);
        return  isContainHttp;
      })
    }

    function isWebUat($location) {
      var url = $location.absUrl();
      $log.info('SpeciesReportingApis.isWebUat ', url);

      return registry().then(function(apis) {
        var isContainDev = containDev(url),
          isContainUatInUrl = containUatInUrl(url, apis);
        $log.info('SpeciesReportingApis.isWebUat ', isContainUatInUrl);

        if(isContainDev) {
          return true;
        }

        return  isContainUatInUrl;
      })
    }
    SpeciesReportingApis.isWeb = isWeb;
    SpeciesReportingApis.isWebUat = isWebUat;
    return SpeciesReportingApis;


  })
