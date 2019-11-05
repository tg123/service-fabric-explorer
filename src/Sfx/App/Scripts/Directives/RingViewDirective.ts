


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
      $scope.candidateIps = [];
      $scope.nodes.collection.forEach((n) => {
        $scope.candidateIps.push(n.raw.IpAddressOrFQDN);
        // $scope.statesData.push({nodeId: n.raw.Id.Id});
      });


      // $scope.myDataset = [100, 200, 300, 400, 500];
      
      console.log($scope.nodesData);

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

        ws.onopen = function(){
          $scope.candidateIps.forEach((ip) => {
            $scope.sendQuery(ip);
          })
        };
      }

      recreateWs();

      $scope.sendQuery = function(IpAddressOrFQDN: string){
        ws.send(JSON.stringify(
          {
            "type": "command",
            "command": "sub",
            // "command_guid": "bf5ca388-4294-4136-9f98-d2c38b317309",
            //"dst_node": "node5", 
            "data": {
              "ip": IpAddressOrFQDN,
             }
          }
        ))
      }


      let cy = cytoscape({
        container: document.getElementById('cytoscape-canvas'),
        zoomingEnabled: false,
        userZoomingEnabled: false,
        autoungrabify: false,
        style: [{
          "selector": "node",
          "style": {
              "content": "data(label)",
              "font-size": "12px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#7FBA00",
              "text-outline-color": "#555",
              "text-outline-width": "2px",
              "color": "#fff",
              "overlay-padding": "6px",
              "z-index": "10"
          }
       }],
      });


      $scope.buildLabel = function(node: any){
        return node.node_name + " (" + node.phase + ")"
      }

      $scope.messageHandler = function (node: any) {

        let id = "sfnode_" + node.node_id
        let n = cy.nodes("#" + id)

        if (!n.id()) {
          cy.add({
            group: 'nodes',
              data: { 
                "id": id,
                "label": $scope.buildLabel(node),
                "origin": node,
              },
            })
        } else {
            n.data("label", $scope.buildLabel(node))
            n.data("origin", node)
        }

        node.neighborhood.forEach(neighbor => {
          let dstid = "sfnode_" + neighbor.node_id

          if (dstid == id) {
            return
          }

          cy.edges('[source = "' + id + '"]').remove()

          try {
            cy.add({
              group: 'edges',
              data: { source: id, target: dstid},
            });
          }catch(e){}
        })

        var layout = cy.layout({'name': 'circle'});
        layout.run();

        // console.log(node)
        // $scope.preprocess(node);
        // var index = _.findIndex($scope.statesData, function (o: any) { return o.node_id == node.node_id; })
        // if (index >= 0) {
        //   $scope.statesData[index] = node;
        // }
        // else {
        //   var insertIndex = _.sortedIndexBy($scope.statesData, node, function (o: any) { return o.node_id; });
        //   $scope.statesData.splice(insertIndex, 0, node);

        //   //$scope.statesData.push(node);
        //   //_.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
        // }
        // _.defer(function(){$scope.$apply(); });


      }

      $scope.preprocess = function (node: any) {
        node.node_id = node.node_id.padStart(32, "0");
        node.routing_token_start = node.routing_token_start.padStart(32, "0");
        node.routing_token_end = node.routing_token_end.padStart(32, "0");
      }
    }
  }
}