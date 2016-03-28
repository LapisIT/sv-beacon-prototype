/**
 * @author Parham
 * @since 9/11/2015
 */

'use strict';

angular.module('svBeaconPrototype.date', [])
	.factory('DateUtil',
		function ($filter) {

			function _now() {
				return (new Date()).getTime();
			}

			function _today() {
				return (new Date());
			}

			function _compare(date1, date2) {
				if (date1 < date2) {
					return -1;
				}
				if (date1 > date2) {
					return 1;
				}
				if (_equal(date1, date2)) {
					return 0;
				}
			}

			function _equal(date1, date2) {
				return date1.getFullYear() === date2.getFullYear() &&
					date1.getMonth() === date2.getMonth() &&
					date1.getDate() === date2.getDate();
			}

			function _parse(date) {
				return new Date(date);
			}

			function _fromNow(date) {
				if (!moment) {
					return;
				}
				return moment(_parse(date)).fromNow();
			}

			function _formatToString(date){
				return $filter('date')(date, "dd/MM/yyyy");
			}

			function _humanize(input, units) {
				// units is a string with possible values of y, M, w, d, h, m, s, ms
				if (input == 0) {
					return 0;
				} else {
					var duration = moment().startOf('day').add(input, units);
					var format = "";
					if (duration.hour() > 0) {
						format += "H[h] ";
					}
					if (duration.minute() > 0) {
						format += "m[m] ";
					}
					if (duration.second() > 0) {
						format += "s[s] ";
					}
					return duration.format(format);
				}
			}

			return {
				now: _now,
				today: _today,
				compare: _compare,
				equal: _equal,
				fromNow: _fromNow,
				parse: _parse,
				formatToString: _formatToString,
				humanize: _humanize
			};

		}
	);
