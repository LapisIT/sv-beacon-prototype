/**
 * @author Parham
 * @since 9/11/2015
 */

'use strict';

describe('cache factory', function() {

	// instantiate service
	var cache, $log;

	beforeEach(module('speciesReporting', function($provide) {
		$provide.value('$log', console)
	}));

	beforeEach(inject(function (_cache_, _$log_) {
		cache = _cache_;
		$log = _$log_;
	}));

	describe('cache factory', function(){

		it('cache should be defined', inject(function() {
			expect(cache).toBeDefined();
		}));

	});

	describe('cache factory crud actions', function(){

		it('cache should add new data', inject(function() {
			cache.add('testKey').then(function(result){
				$log.info(result)
			})
		}));

	});

});
