angular.module('svBeaconPrototype')
  .factory('EventData',
    function ($http, $q, $log,
              ApisValidations) {
      var EventData = {}, isDefined = ApisValidations.isDefined, isEmpty = ApisValidations.isEmpty;
      var event = {id:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
        name:'SV Tech Talk 26 March',
        organiser:'Imran Qazi'};

      var createBeacon = function (beaconName, identifier, major, minor,
                                   colour, locationName,
                                   immediate, near, far, unknown) {
        return {beaconName:beaconName,identifier:identifier, major:major, minor:minor,
          colour:colour, locationName:locationName,
          proximity:{immediate:immediate, near:near, far:far, unknown:unknown}}
      }
      var createKey = function (event, beacon) {
        return event.id + ':' + beacon.major + ':' + beacon.minor;
      }
      var addBeacons = function (event, beacons) {
        var bs = {}
        beacons.forEach(function (beacon, index) {
          beacon.order = index + 1;
          bs[createKey(event, beacon)] = beacon;
        })
        return bs;
      }

      var beacons = [];
      beacons.push(
        createBeacon('blueberry', 'd6390eb6e0c5', '57541', '3766',
          '#54428C','Van Dimen\'s Land',
          'Immediate info','Near info','Far info', 'Unknown info'));
      beacons.push(
        createBeacon('mint', 'f613db7a8e0a', '36362', '56186',
          '#B8D4B5','Torresia',
          'Immediate info','Near info','Far info', 'Unknown info'));
      beacons.push(
        createBeacon('ice', 'fc03fce84038', '16440', '64744',
          '#85C2E5','Reception',
          'Immediate info','Near info','Far info', 'Unknown info'));
      beacons.push(
        createBeacon('blueberry', 'db62f71df1d8', '61912', '63261',
          '#54428C','Dumperia',
          'Immediate info','Near info','Far info', 'Unknown info'));
      beacons.push(
        createBeacon('mint', 'e208d3f96d73', '28019', '54265',
          '#B8D4B5','Carpentaria',
          'Immediate info','Near info','Far info', 'Unknown info'));
      beacons.push(
        createBeacon('ice', 'cffb1b05c7c8', '51144', '6917',
          '#85C2E5','Victoria',
          'Immediate info','Near info','Far info', 'Unknown info'));
      event.beacons = addBeacons(event, beacons);
      EventData.event = event;
      return EventData;


    });
