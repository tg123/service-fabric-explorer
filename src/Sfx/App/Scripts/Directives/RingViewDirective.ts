


module Sfx {
  export class RingViewDirective implements ng.IDirective {
    public restrict = "AE";
    public replace = true;
    public templateUrl = "partials/ring-view.html";
    public scope = {
        nodes: "="
    };

    public link($scope: any, element: JQuery, attributes: any, ctrl: DetailViewPartController) {
      $scope.nodesData = [];
      $scope.statesData = [];
      $scope.nodes.collection.forEach((n) => {
        $scope.nodesData.push(n.raw);
        $scope.statesData.push({nodeId: n.raw.Id.Id});
      });
      
      var ws:WebSocket;
      if (true) {
          ws = new WebSocket('ws://127.0.0.1:10546');

          ws.onopen = function () {
            var port = 22980;
            $scope.nodes.collection.forEach((n) => {
              //console.log(n.raw.IpAddressOrFQDN);
              ws.send(JSON.stringify({address: "127.0.0.1:" + (port++), messageType: "init"}));

            });
          };
      }
      else {
          var ws = new WebSocket('ws://' + window.location.hostname + ':' + 22980);
          ws.onopen = function () {
            var port = 22980;
            $scope.nodes.collection.forEach((n) => {
              ws.send(JSON.stringify({address: "127.0.0.1:" + (port++), messageType: "init"}));
            });
          };
      }

      ws.onclose = function (event) {
        console.log(event)
      };

      ws.onerror = function (error) {
        console.log(error)
      };

      ws.onmessage = function (message) {
        var json;
        try {
          json = JSON.parse(message.data);
        } catch (e) {
          console.log('This doesn\'t look like a valid JSON: ', message.data);
          return;
        }
        $scope.messageHandler(json);
      };


      $scope.messageHandler = function (node: any) {
        $scope.preprocess(node);
        console.log(node)
        var index = _.findIndex($scope.statesData, function (o: any) { return o.nodeId == node.nodeId; })
        if (index >= 0) {
          $scope.statesData[index] = node;
        }
        else {
          var insertIndex = _.sortedIndexBy($scope.statesData, node, function (o: any) { return o.nodeId; });
          $scope.statesData.splice(insertIndex, 0, node);

          //$scope.statesData.push(node);
          //_.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
        }
        _.defer(function(){$scope.$apply(); });
      }

      $scope.preprocess = function (node: any) {
        node.nodeId = node.nodeId.padStart(32, "0");
        node.routingTokenStart = node.routingTokenStart.padStart(32, "0");
        node.routingTokenEnd = node.routingTokenEnd.padStart(32, "0");
      }
    }
  }
}