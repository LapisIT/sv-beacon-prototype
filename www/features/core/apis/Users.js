angular.module('svBeaconPrototype')
  .factory('Users',
    function ($http, $q, $log,
              Validations, Firebases, $firebaseArray) {
      var Users = {}, isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
      var deferred;
      var path = 'users';

      var users = function(userPath) {
        return Firebases.childRef(path + '/' + userPath);
      }

      Users.save = function (user) {
        deferred = isDefined(deferred)?deferred:$q.defer();
        var path = user.name.replace(/ /g, '');
        users(path).then(function (users) {
          var newRef = users.set(user,function(error) {
            if (error) {
              $log.info("could not be saved.", error);
              deferred.reject(user);
            } else {
              $log.info("saved successfully.");
              deferred.resolve(user);
            }
          })

        })

        return deferred.promise;
      }

      return Users;


    })
