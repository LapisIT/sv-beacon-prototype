/**
 * @author Parham
 * @since 9/11/2015
 */

'use strict';

angular.module('speciesReporting.sqlite')
	.constant('Config', {
		name: 'speciesReporting',
		tables: [
			{
				name: 'version',
				columns: [
					{name: 'id', type: 'INTEGER primary key'},
					{name: 'version', type: 'TEXT'}
				],
				data: {
					"version": {
						id: 1,
						version: '1.0.0'
					}
				}
			},
			{
				name: 'cache',
				columns: [
					{name: 'id', type: 'INTEGER primary key'},
					{name: 'key', type: 'TEXT'},
					{name: 'revision', type: 'INTEGER'}
				]
			},
			{
				name: 'myReports',
				columns: [
					{name: 'id', type: 'INTEGER primary key'},
					{name: 'uuid', type: 'TEXT'},
					{name: 'status', type: 'TEXT'},
					{name: 'image', type: 'BLOB'},
					{name: 'lat', type: 'REAL'},
					{name: 'lng', type: 'REAL'},
					{name: 'speciesId', type: 'INTEGER'},
					{name: 'movement', type: 'TEXT'},
					{name: 'numberOfAdults', type: 'INTEGER'},
					{name: 'numberOfCalves', type: 'INTEGER'},
					{name: 'date', type: 'TEXT'},
					{name: 'comment', type: 'TEXT'},
					{name: 'sound', type: 'INTEGER'}
				]
			},
			{
				name: 'reports',
				columns: [
					{name: 'id', type: 'INTEGER primary key'},
					{name: 'uuid', type: 'TEXT'},
					{name: 'status', type: 'TEXT'},
					{name: 'image', type: 'TEXT'},
					{name: 'lat', type: 'REAL'},
					{name: 'lng', type: 'REAL'},
					{name: 'speciesId', type: 'INTEGER'},
					{name: 'movement', type: 'INTEGER'},
					{name: 'numberOfAdults', type: 'INTEGER'},
					{name: 'numberOfCalves', type: 'INTEGER'},
					{name: 'date', type: 'INTEGER'},
					{name: 'comment', type: 'TEXT'}
				]
			},
			{
				name: 'species',
				columns: [
					{name: 'id', type: 'INTEGER primary key'},
					{name: 'name', type: 'TEXT'},
					{name: 'scientificName', type: 'TEXT'},
					{name: 'category', type: 'TEXT'},
					{name: 'description', type: 'TEXT'},
					{name: 'image1', type: 'TEXT'},
					{name: 'image2', type: 'TEXT'},
					{name: 'list', type: 'TEXT'},
					{name: 'subcategory', type: 'TEXT'}
				]
			},
			{
				name: 'categories',
				columns: [
					{name: 'id', type: 'INTEGER primary key'},
					{name: 'name', type: 'TEXT'}
				]
			}]
	});