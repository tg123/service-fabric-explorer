


module Sfx {
export class RingViewDirective implements ng.IDirective {
    public restrict = "AE";
    public replace = true;
    public templateUrl = "partials/ring-view.html";
    public scope = {
        nodes: "="
    };

    public link($scope: any, element: JQuery, attributes: any, ctrl: DetailViewPartController) {
      $scope.data = {};
      $scope.nodesData = [];
      $scope.statesData = {};
      $scope.nodes.collection.forEach((n) => {
        $scope.nodesData.push(n.raw);
      });
      
      console.log(window.location.hostname)

      if (true) {
          var ws = new WebSocket('ws://127.0.0.1:22980');

          ws.onopen = function () {
            // connection is opened and ready to use
            //console.log($scope.nodes.collection);
            //connection.send("init");
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
            // connection is opened and ready to use
            //console.log($scope.nodes.collection);
            //connection.send("init");
            var port = 22980;
            $scope.nodes.collection.forEach((n) => {
              //console.log(n.raw.IpAddressOrFQDN);
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


      $scope.messageHandler = function (node) {
        $scope.statesData[node.nodeId] = node;

      }

    }

    
}
}