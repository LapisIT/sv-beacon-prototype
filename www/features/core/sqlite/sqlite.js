/**
 * @author Parham
 * @since 9/11/2015
 */

'use strict';

angular.module('speciesReporting.sqlite', [])
	// DB wrapper
	.factory('Sqlite', function ($q, $log, $window, Config) {

		var db = null, ready = false;

		function _init() {
			var deferred = $q.defer();
			if(!ready) {
				db = _openDB();
				ready = true;
				return _createTables(Config.tables);
			} else {
				deferred.resolve(db);
				return deferred.promise;
			}
		};

		function _openDB(){
			var name = Config.name;
			try {
				if (!$window.sqlitePlugin) {
					console.info('DB Wrapper > init: Application is running in dev mode, database name: ' + name);
					return $window.openDatabase(name, '1.0', 'database', -1)
				} else {
					console.info('DB Wrapper > init: Application is running in production mode, database name: ' + name);
					return $window.sqlitePlugin.openDatabase({name: name, location: 1});
				}
			} catch (e) {
				console.error('DB Wrapper > init: failed to open database')
			}
		}

		function _createTables(configs) {
			var promises = [], createPromise;

			angular.forEach(configs, function (table) {
				var columns = [], createQuery;

				angular.forEach(table.columns, function (column) {
					columns.push(column.name + ' ' + column.type);
				});

				createQuery = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
				createPromise = _query(createQuery).then(function () {
					$log.info('DB Wrapper > Table ' + table.name + ' initialized');
				}, function (error) {
					$log.error(error);
				});
				promises.push(createPromise);
			});
			return $q.all(promises).then(function(){
				return _initData(Config.tables[0]);
			});
		}

		function _initData(table) {
			_count(table.name).then(function(count){
				if (typeof table.data !== 'undefined' && count === 0) {
					angular.forEach(table.data, function (view) {
						var values = [], columns = [];
						angular.forEach(view, function (value, key) {
							if (value === null) {
								values.push("NULL");
							} else {
								values.push("'" + value + "'");
							}
							columns.push(key);
						});
						return _query('INSERT INTO ' + table.name + ' (' + columns.join(',') + ')' + ' VALUES ' + '(' + values.join(',') + ')');
					});
				}
			});
		}

		function _count(table, condition, bindings){
			var countQuery = 'SELECT COUNT(*) FROM ' + table;
			if(condition) {
				countQuery = countQuery + ' ' + condition;
			}
			return _query(countQuery, bindings).then(function (result) {
				var resultObj = _get(result);
				return resultObj['COUNT(*)'];
			});
		}

		function _isReady() {
			return ready;
		};

		function _query(query, bindings) {
			bindings = typeof bindings !== 'undefined' ? bindings : [];
			var deferred = $q.defer();
			db.transaction(function (transaction) {
				transaction.executeSql(query, bindings, function (transaction, result) {
					deferred.resolve(result);
				}, function (transaction, error) {
					deferred.reject(error);
				});
			});

			return deferred.promise;
		};

		function _get(result) {
			return result.rows.item(0);
		};

		function _getAll(result) {
			var output = [];

			for (var i = 0; i < result.rows.length; i++) {
				output.push(result.rows.item(i));
			}

			return output;
		};


		return {
			init: _init,
			get: _get,
			query: _query,
			getAll: _getAll,
			count: _count,
			isReady: _isReady
		};


	});