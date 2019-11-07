


module Sfx {
  export class RingViewDirective implements ng.IDirective {
    public restrict = "AE";
    public replace = true;
    public templateUrl = "partials/ring-view.html";
    public scope = {
        nodes: "=",
        clusterManifest: "=",
    };

    public link($scope: any, element: JQuery, attributes: any, ctrl: DetailViewPartController) {

      let ws:WebSocket;
      let recreateTimer;

      let recreateWs = function() {

        let tmap = {}

        let m = $($scope.clusterManifest.raw.Manifest);
        m.find("NotificationEndpoint").each((idx, endpoint) => {
          let type = $(endpoint).parent().parent().attr("Name");
          let port = $(endpoint).attr("Port");
          tmap[type]  = port;
        });

        let candidateEndpoints = [];

        m.find("Node").each((idx, n) => {
          candidateEndpoints.push($(n).attr("IPAddressOrFQDN") + ":" + tmap[$(n).attr("NodeTypeRef")]);
        })

        // console.log(candidateEndpoints);

        // TODO load from config
        ws = new WebSocket("ws://" + candidateEndpoints[0]);
  
        // ws.onclose = function (event) {
        //   console.log(event)
        //   if (recreateTimer){
        //     clearTimeout(recreateTimer);
        //   }
        //   recreateTimer = setTimeout(recreateWs, 1000);
        // };
  
        ws.onerror = function (error) {
          console.log(error)
          if (recreateTimer){
            clearTimeout(recreateTimer);
          }
          recreateTimer = setTimeout(recreateWs, 1000);
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
          candidateEndpoints.forEach((ip) => {
            $scope.sendQuery(ip);
          })
        };
      }

      $scope.clusterManifest.ensureInitialized().then( data => {
        recreateWs();
      })

      $scope.sendQuery = function(IpAddressOrFQDN: string){
        ws.send(JSON.stringify(
          // {
          //   "type": "command",
          //   "command": "sub",
          //   "data": {
          //     "ip": IpAddressOrFQDN,
          //    }
          // }
          {
            "message_type": "query",
            "address": IpAddressOrFQDN,
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
        return node.node_name + " (" + node.phase + ")";
      }

      $scope.messageHandler = function (node: any) {

        let id = "sfnode_" + node.node_id;
        let n = cy.nodes("#" + id);

        if (!n.id()) {
          cy.add({
            group: 'nodes',
              data: { 
                "id": id,
                "label": $scope.buildLabel(node),
                "origin": node,
              },
            });
        } else {
            n.data("label", $scope.buildLabel(node));
            n.data("origin", node);
        }

        node.neighborhood.forEach(neighbor => {
          let dstid = "sfnode_" + neighbor.node_id;

          if (dstid === id) {
            return;
          }

          cy.edges('[source = "' + id + '"]').remove();

          try {
            cy.add({
              group: 'edges',
              data: { source: id, target: dstid},
            });
          }catch(e){
          }
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
