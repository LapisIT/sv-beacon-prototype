/**
 * @author Parham
 * @since 9/11/2015
 */

'use strict';

angular.module('speciesReporting.cache', []).factory('Cache', function ($q, $log, Sqlite, DateUtil) {

	$log.info('Cache init ... ');

	/**
	 * @method add
	 * @param {!String} key - name of cache entity
	 * @param {Number} revision
	 * @returns {object} a promise which is resolved after db record is added
	 */
	function _add(key, revision) {
		var cachedOn = DateUtil.today(),
			query = 'INSERT INTO cache (key, revision) VALUES (@key, @cachedOn)';
		$log.info('Cache > trying to add ', key);
		return Sqlite.query(query, [key, revision]).then(function (result) {
			$log.info('Cache > add: updated cache revision is ' + revision + ' for key: ' + key);
		}, function (error) {
			$log.warn(error);
		});
	}

	function _remove(key) {
		var removeQuery = 'DELETE FROM cache WHERE key = @key';
		return Sqlite.init().then(function () {
			return Sqlite.query(removeQuery, [key]);
		})
	}

	function _update(key, revision) {
		var updateQuery = 'UPDATE cache SET revision = @revision WHERE key = @key';
		return Sqlite.init().then(function () {
			return Sqlite.query(updateQuery, [revision, key]);
		}).then(function (result) {
			$log.info('Cache > update: updated cache revision is: ' + revision, result);
		});
	}

	function _upsert(key, revision) {
		return Sqlite.init().then(function () {
			return Sqlite.count('cache', 'WHERE key = @key', [key]);
		}).then(function (count) {
			if (count === 0) {
				return _add(key, revision);
			}
			return _update(key, revision);
		})
	}

	function _get(key) {
		var selectQuery = 'SELECT * FROM cache WHERE key = @key';
		return Sqlite.init().then(function () {
			return Sqlite.query(selectQuery, [key]);
		})
	}

	function _isExpired(key, revision) {
		var deferred = $q.defer(), record, result = true;
		_get(key).then(function (result) {
			if(result.rows.length > 0) {
				record = Sqlite.get(result);
				result = (record.revision != revision)
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	}

	return {
		remove: _remove,
		get: _get,
		upsert: _upsert,
		isExpired: _isExpired
	};
});

