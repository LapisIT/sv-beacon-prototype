angular.module('svBeaconPrototype')
  .factory('PoiData',
    function ($http, $q, $log,
              Validations) {
      var PoiData = {}, isDefined = Validations.isDefined, id = 1;
      var create = function (name, lat, lng) {
        return {key:id++,name:name, latlng:{lat: lat, lng: lng}, asArray:[lat,lng]};
      }
      var pois = [];
      pois.push(create('Victoria (at the door)', -37.81641, 144.95668));
      pois.push(create('Back kitchen (at the door)', -37.81659, 144.95672));
      pois.push(create('Reception area', -37.81641, 144.95657));
      pois.push(create('Blue team area', -37.81663, 144.95650));

      PoiData.pois = pois;

      return PoiData;


    })
