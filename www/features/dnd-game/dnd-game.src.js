/**
 * @author Parham
 * @since 6/04/2016
 */
angular.module('svBeaconPrototype').controller('DndGameCtrl', function ($scope) {
  $scope.centerAnchor = true;

  $scope.draggables = ['One', 'Two'];
  $scope.dropped1 = [];
  $scope.dropped2 = [];
  $scope.dropped3 = [];
  $scope.dropped4 = [];

  $scope.onDropComplete = function (data, evt, droppedArray) {
    console.log("onDropComplete", data, evt, droppedArray, new Date());
    var index = droppedArray.indexOf(data);
    if (index === -1) {
      droppedArray.push(data);
    }
  };

  $scope.onDragSuccess = function (data, evt, draggedArray) {
    console.log("onDragSuccess", data, evt, draggedArray, new Date());
    var draggedArrayIndex = draggedArray.indexOf(data);
    if (draggedArrayIndex > -1) {
      draggedArray.splice(draggedArrayIndex, 1);
    }
  };

});
