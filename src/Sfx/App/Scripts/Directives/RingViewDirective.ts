


module Sfx {
  export class RingViewDirective implements ng.IDirective {
    public restrict = "AE";
    public replace = true;
    public templateUrl = "partials/ring-view.html";
    public scope = {
        nodes: "=",
    };

    

    // constructor(){
    //   'ngInject';
    //   console.log($scope);
    // }


    public link($scope: any, element: JQuery, attributes: any, ctrl: DetailViewPartController) {

      $scope.nodesData = [];
      $scope.statesData = [];
      // $scope.nodes.collection.forEach((n) => {
      //   $scope.nodesData.push(n.raw);
      //   $scope.statesData.push({nodeId: n.raw.Id.Id});
      // });
      // $scope.myDataset = [100, 200, 300, 400, 500];
      
      var ws:WebSocket;


      let recreateWs = function() {
        // TODO load from config
        ws = new WebSocket('ws://127.0.0.1:10286/debug');
  
        ws.onclose = function (event) {
          console.log(event)
          recreateWs();
        };
  
        ws.onerror = function (error) {
          console.log(error)
          recreateWs();
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
      }

      recreateWs();

      // if (true) {
      //     // ws = new WebSocket('ws://127.0.0.1:10546');
      //     // ws = new WebSocket('ws://10.31.62.28/debug');
          

      //     // ws.onopen = function () {
      //     //   var port = 10546;
      //     //   $scope.nodes.collection.forEach((n) => {
      //     //     //console.log(n.raw.IpAddressOrFQDN);
      //     //     ws.send(JSON.stringify({address: "172.17.27.113:" + (port++), messageType: "init"}));

      //     //   });
      //     // };
      // }
      // else {
      //     var ws = new WebSocket('ws://' + window.location.hostname + ':' + 22980);
      //     ws.onopen = function () {
      //       var port = 22980;
      //       $scope.nodes.collection.forEach((n) => {
      //         ws.send(JSON.stringify({address: "127.0.0.1:" + (port++), messageType: "init"}));
      //       });
      //     };
      // }



      $scope.messageHandler = function (node: any) {
        console.log(node)
        $scope.preprocess(node);
        var index = _.findIndex($scope.statesData, function (o: any) { return o.node_id == node.node_id; })
        if (index >= 0) {
          $scope.statesData[index] = node;
        }
        else {
          var insertIndex = _.sortedIndexBy($scope.statesData, node, function (o: any) { return o.node_id; });
          $scope.statesData.splice(insertIndex, 0, node);

          //$scope.statesData.push(node);
          //_.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
        }
        _.defer(function(){$scope.$apply(); });
      }

      $scope.preprocess = function (node: any) {
        node.node_id = node.node_id.padStart(32, "0");
        node.routing_token_start = node.routing_token_start.padStart(32, "0");
        node.routing_token_end = node.routing_token_end.padStart(32, "0");
      }
    }
  }
}