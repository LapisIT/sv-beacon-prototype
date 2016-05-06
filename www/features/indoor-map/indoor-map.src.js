/**
 * @author Parham
 * @since 20/04/2016
 */

angular.module('svBeaconPrototype')

  .controller('IndoorMapCtrl', function ($scope, $log, $state, $interval, $stateParams, $ionicPopup,
                                         MapDefaults, Location, leafletData,
                                         SvOffices) {
    $log.info('IndoorMapCtrl...');

    function _initMap(found) {
      leafletData.getMap().then(function (lmap) {
        var polyLine = L.polyline(SvOffices.office.boundaries);
        // TopLeft, TopRight, BottomRight, BottomLeft
        var transformedImage = L.imageTransform(SvOffices.office.imageUrl,
          SvOffices.office.boundaries);
        transformedImage.addTo(lmap);
        lmap.fitBounds(polyLine.getBounds());
        //lmap.zoomIn();
        //_moveAround();
        initIndoorAtlas();

        SvOffices.pois.forEach(function (poi) {
          L.circle(poi.asArray, 3, {}).addTo(lmap);
        })


      });
    }
    function initIndoorAtlas() {
      var stop = $interval(function () {
        $log.info('indooratlas', indooratlas);
        if(!indooratlas) return;
        indooratlas.current(
          '',
          function(latlng) {
            $log.info('currentLocation: ', latlng);
            if(!latlng) {
              return;
            }

            var parts = latlng.split(',');
            updateLocationMarker({lat: Number(parts[0]), lng: Number(parts[1])}, $scope);
          },
          function(err) {
            $log.error('err: ', err);
          }
        );
      }, 1000)
    }

    function _moveAround() {
      var points = [
        [-37.8166335618388, 144.95664484798908]
      ];
      var index = 0;
      updateLocationMarker({lat: points[index][0], lng: points[index][1]}, $scope);
    }

    function updateLocationMarker(latlng, $scope) {
      var newLocation = Location.createMarker(latlng);
      if ($scope.markers && $scope.markers.location) {
        $scope.markers.location.lat = newLocation.lat;
        $scope.markers.location.lng = newLocation.lng;
      }

      //$scope.markers = {};

      $scope.markers.location = newLocation;

      return newLocation;
    }
    function initMarkert() {
      return {};
      // var markers = {};
      // SvOffices.pois.forEach(function (poi) {
      //   markers[poi.key] = poi.latlng;
      // })
      // return markers;
    }
    //25
    angular.extend($scope, {
      defaults: {
        scrollWheelZoom: true,
        maxZoom: 22,
        zoomControl: false
      },
      // maxBounds: {
      //   southWest: {
      //     lat: officeBoundaries[3][0],
      //     lng: officeBoundaries[3][1]
      //   },
      //   northEast: {
      //     lat: officeBoundaries[1][0],
      //     lng: officeBoundaries[1][1]
      //   }
      //
      // },
      // maxBoundsViscosity: 1.0,
      //center: Location.createCenter(center),
      markers: initMarkert(),
      layers: MapDefaults.defaultLayers,
      //tiles: indooratlasmap,
      events: {
        map: {enable: ['click']},
        //markers: {enable: ['click', 'dragend']}
      }
    });

    $scope.$on('leafletDirectiveMap.click', function (e, options) {
      $log.info('click', options.leafletEvent.latlng);
      $scope.clicked = options.leafletEvent.latlng;
    });

    _initMap();

  });

