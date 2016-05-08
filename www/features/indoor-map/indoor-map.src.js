/**
 * @author Parham
 * @since 20/04/2016
 */

angular.module('svBeaconPrototype')

  .controller('IndoorMapCtrl', function ($scope, $log, $state, $interval, $stateParams, $ionicPopup, MapDefaults, Location, leafletData) {
    $log.info('IndoorMapCtrl...');

    //nw -37.8164063112279	144.956365898252
    //sw -37.8167426842612	144.956511408091
    //ne -37.8163030152644	144.956692457199
    //sw

    var nw = [-37.8164063112279,	144.956365898252];
    var sw = [-37.8167426842612,	144.956511408091];
    var ne = [-37.8163030152644,	144.956692457199];
    var se = [-37.816626, 144.956861];
    var lat = 0,lng=1;
    var tiltWidth = sw[lng] - nw[lng];
    var tiltHeight = Math.abs(nw[lat]) - Math.abs(ne[lat]);


    //w: 0.00014550983900107894
    //h: 0.00033637303329925317
    // [
    //   [-37.81635916590862, 144.95643094182014],
    //   [-37.81626381573271, 144.95675414800644],
    //   [-37.81660919467391, 144.95691373944283],
    //   [-37.81670136608138, 144.95659321546555]
    // ]

    //https://api.tiles.mapbox.com/v4/indooratlas.k4e5o551/17/118308/80428.png?access_token=pk.eyJ1IjoiaW5kb29yYXRsYXMiLCJhIjoiYmU1YjNiZmQ4MzNiNDYwMTRiNDEzMDMxOWUwMjk2ZTYifQ.gXOMtDENS3b8i7aJ6qsjSA




    var officeBoundaries = [
        [-37.81635916590862, 144.95643094182014],
        [-37.81626381573271, 144.95675414800644],
        [-37.81660919467391, 144.95691373944283],
        [-37.81670136608138, 144.95659321546555]
      ],
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
        lmap.zoomIn();

        _moveAround();

      });
    }

    function _moveAround() {
      var points = [
        [-37.8166335618388, 144.95664484798908]
    ];
      var index = 0;
      updateMarker({lat: points[index][0], lng: points[index][1]}, $scope);

      $interval(function () {
        $log.info('indooratlas', indooratlas);
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

    angular.extend($scope, {
      defaults: {
        scrollWheelZoom: true,
        maxZoom: 25,
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
      center: Location.createCenter(center),
      markers: {location: Location.createMarker(center)},
      layers: MapDefaults.defaultLayers,
      events: {
        map: {enable: ['click', 'dragend']},
        markers: {enable: ['click', 'dragend']}
      }
    });

    _initMap();

  });

