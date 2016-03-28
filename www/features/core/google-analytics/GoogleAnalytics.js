'use strict';

/**
 * GoogleAnalytics class
 <script>
 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

 ga('create', 'UA-73153304-1', 'auto');
 ga('send', 'pageview');

 </script>
 *
 *
 * @module GoogleAnalytics
 */
angular.module('svBeaconPrototype.googleAnalytics', [])
  .factory('GoogleAnalytics',
  function ($log, $rootScope, $location, $localStorage, $q, $timeout, Offline, Validations) {
    var GoogleAnalytics = {},isDefined = Validations.isDefined,
      trackingCode = 'TBD',
      src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.google-analytics.com/analytics.js';

    var storage = $localStorage.$default({
      googleAnalyticsItems:[]
    });

    function init() {
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date();
        a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', src, 'ga');
    }

    init();

    function sendOfflineItems() {
      var i = 0, count = storage.googleAnalyticsItems.length;
      _ga().then(function(ga) {
        $log.info('ga available, sending now...', count);

        for(i = 0; i < count; i++) {
          var values = storage.googleAnalyticsItems[0];
          ga('send', 'pageview', values);
        }

        storage.googleAnalyticsItems = [];

        $log.info('Offline events have been sent...');
      }, function() {
        $log.info('ga NOT available, sending later...');
      })
    }

    function checkAndSendOfflineItems() {
      Offline.isOnline().then(function(online) {
        var count = storage.googleAnalyticsItems.length,
          exists = count > 0;

        if(online && exists) {
          $log.info('Online and offline activities exist, sending now ', count);
          sendOfflineItems();
        }
      })
    }

    $rootScope.$on('$routeChangeStart', function(next, current) {
      $log.info('GoogleAnalytics $routeChangeStart... ');
      checkAndSendOfflineItems();
    });

    function _ga() {
      var deferred = $q.defer();

      if(isDefined(ga)) {
        deferred.resolve(ga);
        return deferred.promise;
      }

      ga = undefined;
      init();

      $timeout(function() {
        if(isDefined(ga)) {
          deferred.resolve(ga);
          return;
        }

        deferred.reject();
      }, 3000)

      return deferred.promise;
    }

    function sendPageView(values) {
      var deferred = $q.defer();
      Offline.isOnline().then(function(online) {
        if(online) {
          _ga().then(function(ga) {
            $log.info('sendPageView sending... ');
            ga('send', 'pageview', values);
            deferred.resolve();
          })
          return;
        }

        storage.googleAnalyticsItems.push(values);
        $log.info('Offline, storing the page view in storage...', storage.googleAnalyticsItems.length);
        deferred.resolve();

      })

      return deferred.promise;
    }

    ga('create', trackingCode, 'auto');

    //GoogleAnalytics.trackAtlas = function (url, selections) {
    //  var s = selections;
    //
    //  //TODO: parameterise dimensions
    //  $log.info('GoogleAnalytics.trackAtlas selections: ', selections);
    //  sendPageView({
    //    page: url,
    //    'dimension1': s.categoryName,
    //    'dimension2': s.categoryCode,
    //    'dimension3': s.statisticName,
    //    'dimension4': s.statisticCode,
    //    'dimension5': s.measureName,
    //    'dimension6': s.measureCode,
    //    'dimension7': s.location,
    //    'dimension8': s.region,
    //    'dimension9': s.gender,
    //    'dimension10': s.fullScreen
    //  });
    //};

    GoogleAnalytics.trackError = function (url, errEvent, errDetails) {
      $log.info('GoogleAnalytics.trackError');
      var details = (errDetails ? angular.toJson(errDetails) : 'No error details passed for tracking');
      sendPageView({
        page: url,
        dimension1: errEvent,//Error event
        dimension2: details//Error details
      });
    }

    /**
     * @method trackLandingPage
     * @param {!string} url
     */
    GoogleAnalytics.trackPage = function (url) {
      $log.info('GoogleAnalytics.trackLandingPage');
      sendPageView({
        page: url
      });


    };

    return GoogleAnalytics;

  });
