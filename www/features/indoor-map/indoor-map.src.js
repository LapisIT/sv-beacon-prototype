/**
 * @author Parham
 * @since 20/04/2016
 */

angular.module('svBeaconPrototype')

  .controller('IndoorMapCtrl', function ($scope, $log, $state, $interval, $stateParams, $ionicPopup, MapDefaults, Location, leafletData) {
    $log.info('IndoorMapCtrl...');

    // var nw = [-37.8164063112279,	144.956365898252];
    // var sw = [-37.8167426842612,	144.956511408091];
    // var ne = [-37.8163030152644,	144.956692457199];
    // var se = [-37.816626, 144.956861] by Mike
    var nw = [-37.816412,	144.956350];
    var sw = [-37.816743,	144.956511408091];
    var ne = [-37.816305,	144.956690];
    var se = [-37.816645, 144.956841];
    var officeBoundaries = [],
      center = {lat: -37.81643332707141, lng: 144.95671659708023}, map;
    officeBoundaries = [nw,ne,se,sw];

    function _initMap(found) {
      leafletData.getMap().then(function (lmap) {
        var polyLine = L.polyline(officeBoundaries);

        var imageUrl = 'https://idaweb.blob.core.windows.net/imageblobcontainer/50453515-be2d-493b-91f2-a3e1c2083d5e';

        // TopLeft, TopRight, BottomRight, BottomLeft
        var transformedImage = L.imageTransform(imageUrl, officeBoundaries);
        transformedImage.addTo(lmap);

        lmap.fitBounds(polyLine.getBounds());
        //lmap.zoomIn();

        _moveAround();

      });
    }

    function _moveAround() {
      var points = [
        [-37.8166335618388, 144.95664484798908]
    ];
      var index = 0;
      updateMarker({lat: points[index][0], lng: points[index][1]}, $scope);

      var stop = $interval(function () {
        $log.info('indooratlas', indooratlas);
        if(!indooratlas) {
          return;
        }
        indooratlas.current(
          '',
          function(latlng) {
            $log.info('currentLocation: ', latlng);
            if(!latlng) {
              return;
            }

            var parts = latlng.split(',');
            updateMarker({lat: Number(parts[0]), lng: Number(parts[1])}, $scope);
          },
          function(err) {
            $log.error('err: ', err);
          }
        );


      }, 1000)
    }

    function updateMarker(latlng, $scope) {
      var newLocation = Location.createMarker(latlng);
      if ($scope.markers) {
        $scope.markers.location.lat = newLocation.lat;
        $scope.markers.location.lng = newLocation.lng;
      }

      $scope.markers = {};
      $scope.markers.location = newLocation;

      return newLocation;
    }


    //https://a.tiles.mapbox.com/v3/indooratlas.k4e5o551/13/4097/2723.png
    var
      indooratlasmap = {
        url: "http://{s}.tile.mapbox.com/v3/indooratlas.k4e5o551/{z}/{x}/{y}.png",
        options: {
          attribution: 'IndoorAtlas'
        }
      }
    //25
    angular.extend($scope, {
      defaults: {
        scrollWheelZoom: true,
        maxZoom: 22,
        zoomControl: false
      },
      maxBounds: {
        southWest: {
          lat: officeBoundaries[3][0],
          lng: officeBoundaries[3][1]
        },
        northEast: {
          lat: officeBoundaries[1][0],
          lng: officeBoundaries[1][1]
        }

      },
      maxBoundsViscosity: 1.0,
      //center: Location.createCenter(center),
      markers: {location: Location.createMarker(center)},
      layers: MapDefaults.defaultLayers,
      //tiles: indooratlasmap,
      events: {
        map: {enable: ['click']},
        //markers: {enable: ['click', 'dragend']}
      }
    });
    $scope.$on('leafletDirectiveMap.click', function (e, options) {
      $log.info('click', options.leafletEvent.latlng);
    });

    _initMap();

  });

