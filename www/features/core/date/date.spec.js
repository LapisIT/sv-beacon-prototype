/**
 * @author Parham
 * @since 12/10/2015
 */

'use strict';

describe('date', function () {

	// instantiate service
	var $log, date;

	beforeEach(module('svBeaconPrototype', function ($provide) {
		$provide.value('$log', console)
	}));

	beforeEach(inject(function (_$log_, _date_) {
		$log = _$log_;
		date = _date_;
	}));

	describe('date factory', function () {
		it('date factory should be defined', inject(function () {
			expect(date).toBeDefined();
		}));
	});

	describe('date factory', function () {

		it('now method should return current time in the JS date getTime format', inject(function () {
			var now = date.now();
			expect(angular.isNumber(now)).toBeTruthy()
		}));

		it('today method should return a JS Date that represent today', inject(function () {
			var today = date.today(),
				todayDate = new Date();
			expect(angular.isDate(today)).toBeTruthy();
			expect(today).toEqual(todayDate);
		}));

		it('parse method should return a valid JS Date for passed time', inject(function () {
			var time = (new Date('2014-06-01T12:00:00')).getTime(),
				myDate = date.parse('2014-06-01T12:00:00');
			expect(angular.isDate(myDate)).toBeTruthy();
			expect(myDate.getTime()).toEqual(time);
		}));

		it('equal should return true for equal two JS date', inject(function () {
			var date1 = (new Date(1995, 11, 17, 3, 24, 0)),
			    date2 = (new Date(1995, 11, 17, 3, 24, 0)),
			    date3 = (new Date(2010, 11, 17, 3, 24, 0));
			expect(date.equal(date1, date2)).toBeTruthy();
			expect(date.equal(date1, date3)).toBeFalsy();
		}));

		it('compare should return 1 for if first date is bigger than second one', inject(function () {
			var date1 = (new Date(1995, 11, 17, 3, 24, 0)),
			    date2 = (new Date(1995, 11, 17, 3, 24, 0)),
			    date3 = (new Date(1994, 11, 17, 3, 24, 0));
			expect(date.compare(date1, date1)).toBe(0);
			expect(date.compare(date3, date2)).toBe(-1);
			expect(date.compare(date1, date3)).toBe(1);
		}));

	});

});
