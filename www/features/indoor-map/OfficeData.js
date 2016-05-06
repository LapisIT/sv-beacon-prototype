angular.module('svBeaconPrototype')
  .factory('OfficeData',
    function ($http, $q, $log,
              Validations) {
      var OfficeData = {}, isDefined = Validations.isDefined;

      // var nw = [-37.8164063112279,	144.956365898252];
      // var sw = [-37.8167426842612,	144.956511408091];
      // var ne = [-37.8163030152644,	144.956692457199];
      // var se = [-37.816626, 144.956861] by Mike
      var nw = [-37.816412,	144.956350];
      var sw = [-37.816743,	144.956511408091];
      var ne = [-37.816305,	144.956690];
      var se = [-37.816645, 144.956841];
      var boundaries = [],
        center = {lat: -37.81643332707141, lng: 144.95671659708023}, map;
      boundaries = [nw,ne,se,sw];
      var imageUrl = 'https://idaweb.blob.core.windows.net/imageblobcontainer/50453515-be2d-493b-91f2-a3e1c2083d5e';
      OfficeData.boundaries = boundaries;
      OfficeData.imageUrl = imageUrl;


      //https://a.tiles.mapbox.com/v3/indooratlas.k4e5o551/13/4097/2723.png
      var indooratlasmap = {
          url: "http://{s}.tile.mapbox.com/v3/indooratlas.k4e5o551/{z}/{x}/{y}.png",
          options: {
            attribution: 'IndoorAtlas'
          }
        }

      return OfficeData;


    })
