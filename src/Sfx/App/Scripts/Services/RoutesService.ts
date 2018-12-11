//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    // Important:
    // If modifying a route in the RoutesService, make sure to make a corresponding change in the routes configuration below, and vice versa.

    export class RoutesService {
        private _forceSingleEncode: boolean = false;

        constructor(private $interval: angular.IIntervalService, private $location: angular.ILocationService) {
        }

        public navigate(pathGetter: () => string): void {
            let path: string;

            try {
                this.forceSingleEncode(true);
                path = pathGetter();
            } finally {
                this.forceSingleEncode(false);
            }

            this.$interval(() => {
                this.$location.path(path.substring(1));
            }, 0, 1);
        }

        public getTabViewPath(baseViewPath: string, tabId: string): string {
            return _.trimEnd(baseViewPath, "/") + "/tab/" + tabId;
        }

        public getClusterViewPath(): string {
            return "#/";
        }

        public getNodesViewPath(): string {
            return "#/nodes";
        }

        public getSystemAppsViewPath(): string {
            return "#/system/apps";
        }

        public getAppsViewPath(): string {
            return "#/apps";
        }

        public getAppTypesViewPath(): string {
            return "#/appTypes";
        }

        public getNodeViewPath(nodeName: string): string {
            return "#/node/" + this.doubleEncode(nodeName);
        }

        public getNetworksViewPath(): string {
            return "#/networks";
        }

        //mesh
        public getMeshApplicationsViewPath(): string {
            return "#/mesh/apps";
        }

        public getMeshApplicationViewPath(appName: string): string {
            return `#/mesh/app/${this.doubleEncode(appName)}`;
        }

        public getMeshAppServiceViewPath(appName: string, serviceName: string): string {
            return `#/mesh/app/${this.doubleEncode(appName)}/service/${this.doubleEncode(serviceName)}`;
        }

        public getMeshAppServiceReplicaViewPath(appName: string, serviceName: string, replicaId: string): string {
            return `#/mesh/app/${this.doubleEncode(appName)}/service/${this.doubleEncode(serviceName)}/replica/${this.doubleEncode(replicaId)}`;
        }

        public getMeshVolumesViewPath(): string {
            return "#/mesh/volumes";
        }

        public getMeshVolumeViewPath(volumeName: string): string {
            return `#/mesh/volume/${this.doubleEncode(volumeName)}`;
        }

        public getMeshNetworksViewPath(): string {
            return "#/mesh/networks";
        }

        public getMeshGatewaysViewPath(): string {
            return "#/mesh/gateways";
        }

        public getMeshGatewayViewPath(gatewayName: string): string {
            return `#/mesh/gateway/${this.doubleEncode(gatewayName)}`;
        }

        public getMeshSecretsViewPath(): string {
            return "#/mesh/secrets";
        }

        public getMeshSecretViewPath(secretName: string): string {
            return `#/mesh/secret/${this.doubleEncode(secretName)}`;
        }
        
        public getNetworkViewPath(networkName: string): string {
            return "#/network/" + this.doubleEncode(networkName);
        }

        public getDeployedAppViewPath(nodeName: string, appId: string): string {
            return "#/node/" + this.doubleEncode(nodeName) + "/deployedapp/" + this.doubleEncode(appId);
        }

        public getDeployedServiceViewPath(nodeName: string, appId: string, serviceId: string, activationId: string): string {
            return "#/node/" + this.doubleEncode(nodeName) + "/deployedapp/" + this.doubleEncode(appId) +
                "/deployedservice/" + this.doubleEncode(serviceId) +
                (activationId ? "/activationid/" + this.doubleEncode(activationId) : "");
        }

        public getDeployedReplicasViewPath(nodeName: string, appId: string, serviceId: string, activationId: string): string {
            return "#/node/" + this.doubleEncode(nodeName) + "/deployedapp/" + this.doubleEncode(appId) +
                "/deployedservice/" + this.doubleEncode(serviceId) +
                (activationId ? "/activationid/" + this.doubleEncode(activationId) : "") +
                "/replicas/";
        }

        public getDeployedCodePackagesViewPath(nodeName: string, appId: string, serviceId: string, activationId: string): string {
            return "#/node/" + this.doubleEncode(nodeName) + "/deployedapp/" + this.doubleEncode(appId) +
                "/deployedservice/" + this.doubleEncode(serviceId) +
                (activationId ? "/activationid/" + this.doubleEncode(activationId) : "") +
                "/codepackages/";
        }

        public getDeployedReplicaViewPath(nodeName: string, appId: string, serviceId: string, activationId: string, partitionId: string, replicaId: string): string {
            // A partition with a node/app/service is enough to uniquely identify a Replica.  A replicaId is NOT enough to identify a replica.  However, the replicaId is still used in displaying information.
            return "#/node/" + this.doubleEncode(nodeName) + "/deployedapp/" + this.doubleEncode(appId) +
                "/deployedservice/" + this.doubleEncode(serviceId) +
                (activationId ? "/activationid/" + this.doubleEncode(activationId) : "") +
                "/partition/" + this.doubleEncode(partitionId) +
                "/replica/" + this.doubleEncode(replicaId);
        }

        public getCodePackageViewPath(nodeName: string, appId: string, serviceId: string, activationId: string, codePackageName: string): string {
            return "#/node/" + this.doubleEncode(nodeName) + "/deployedapp/" + this.doubleEncode(appId) +
                "/deployedservice/" + this.doubleEncode(serviceId) +
                (activationId ? "/activationid/" + this.doubleEncode(activationId) : "") +
                "/codepackage/" + this.doubleEncode(codePackageName);
        }

        public getAppTypeViewPath(appTypeName: string): string {
            return "#/apptype/" + this.doubleEncode(appTypeName);
        }

        public getAppViewPath(appTypeName: string, appId: string): string {
            return "#/apptype/" + this.doubleEncode(appTypeName) + "/app/" + this.doubleEncode(appId);
        }

        public getServiceViewPath(appTypeName: string, appId: string, serviceId: string): string {
            return "#/apptype/" + this.doubleEncode(appTypeName) + "/app/" + this.doubleEncode(appId) + "/service/" + this.doubleEncode(serviceId);
        }

        public getPartitionViewPath(appTypeName: string, appId: string, serviceId: string, partitionId: string): string {
            return "#/apptype/" + this.doubleEncode(appTypeName) + "/app/" + this.doubleEncode(appId) + "/service/" + this.doubleEncode(serviceId) +
                "/partition/" + this.doubleEncode(partitionId);
        }

        public getReplicaViewPath(appTypeName: string, appId: string, serviceId: string, partitionId: string, replicaId: string): string {
            return "#/apptype/" + this.doubleEncode(appTypeName) + "/app/" + this.doubleEncode(appId) + "/service/" + this.doubleEncode(serviceId) +
                "/partition/" + this.doubleEncode(partitionId) + "/replica/" + this.doubleEncode(replicaId);
        }

        // Double encode may be necessary because the browser automatically decodes the token before we have access to it
        private doubleEncode(str: string): string {
            return this._forceSingleEncode ? encodeURIComponent(str) : encodeURIComponent(encodeURIComponent(str));
        }

        private forceSingleEncode(force: boolean) {
            this._forceSingleEncode = force;
        }
    }

    (function () {

        /**
         * This will create two routes per path in the RouteService; One route that maps to route, and another that maps to route/tab/.
         * @param $routeProvider
         * @param paths
         * @param route
         */
        function whenWithTabs($routeProvider, paths, route) {
            // We'll change search parameters on the fly (for theme etc.), should not reload the page.
            route.reloadOnSearch = false;

            // We don't need to conditional here; ADAL is set at a more global level, so, if it's enabled, treat each route as ADAL enabled.
            route.requireADLogin = true;

            if (!_.isArray(paths)) {
                paths = [paths];
            }

            _.each(paths, (path: string) => {
                $routeProvider
                    .when(path, route)
                    .when(_.trimEnd(path, "/") + "/tab/:tabId", route);
            });
        };

        let module = angular.module("routes", ["ngRoute"]);

        module.factory("routes", ["$interval", "$location", ($interval, $location) => new RoutesService($interval, $location)]);

        module.config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
            whenWithTabs($routeProvider, "/", {
                templateUrl: "partials/cluster.html",
                controller: "ClusterViewController",
                controllerAs: "clusterCtrl"
            });
            whenWithTabs($routeProvider, "/apps", {
                templateUrl: "partials/apps.html",
                controller: "AppsViewController",
                controllerAs: "appsCtrl"
            });
            whenWithTabs($routeProvider, "/system/apps", {
                templateUrl: "partials/system-apps.html",
                controller: "SystemAppsViewController",
                controllerAs: "systemAppsCtrl"
            });
            whenWithTabs($routeProvider, "/nodes", {
                templateUrl: "partials/nodes.html",
                controller: "NodesViewController",
                controllerAs: "nodesCtrl"
            });
            whenWithTabs($routeProvider, "/node/:nodeName", {
                templateUrl: "partials/node.html",
                controller: "NodeViewController",
                controllerAs: "nodeCtrl"
            });
            whenWithTabs($routeProvider, "/node/:nodeName/deployedapp/:appId", {
                templateUrl: "partials/deployed-app.html",
                controller: "DeployedAppViewController",
                controllerAs: "deployedAppCtrl"
            });
            whenWithTabs($routeProvider, "/networks", {
                templateUrl: "partials/networks.html",
                controller: "NetworksViewController",
                controllerAs: "networksCtrl"
            });
            whenWithTabs($routeProvider, "/network/:networkName", {
                templateUrl: "partials/network.html",
                controller: "NetworkViewController",
                controllerAs: "networkCtrl"
            });
            whenWithTabs($routeProvider,
                [
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId",
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/activationid/:activationId"
                ], {
                    templateUrl: "partials/deployed-service-package.html",
                    controller: "DeployedServiceViewController",
                    controllerAs: "deployedServicePackageCtrl"
                });
            whenWithTabs($routeProvider,
                [
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/codepackages",
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/activationid/:activationId/codepackages"
                ], {
                    templateUrl: "partials/deployed-code-packages.html",
                    controller: "DeployedServiceCodePackagesViewController",
                    controllerAs: "deployedCodePackagesCtrl"
                });
            whenWithTabs($routeProvider,
                [
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/replicas",
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/activationid/:activationId/replicas"
                ], {
                    templateUrl: "partials/deployed-replicas.html",
                    controller: "DeployedServiceReplicasViewController",
                    controllerAs: "deployedReplicasCtrl"
                });
            whenWithTabs($routeProvider,
                [
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/partition/:partitionId/replica/:replicaId",
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/activationid/:activationId/partition/:partitionId/replica/:replicaId"
                ], {
                    templateUrl: "partials/deployed-replica.html",
                    controller: "DeployedReplicaViewController",
                    controllerAs: "deployedReplicaCtrl"
                });
            whenWithTabs($routeProvider,
                [
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/codepackage/:codePackageName",
                    "/node/:nodeName/deployedapp/:appId/deployedservice/:serviceId/activationid/:activationId/codepackage/:codePackageName"
                ], {
                    templateUrl: "partials/deployed-code-package.html",
                    controller: "DeployedCodePackageViewController",
                    controllerAs: "codePackageCtrl"
                });
            whenWithTabs($routeProvider, "/apptype/:appTypeName", {
                templateUrl: "partials/app-type.html",
                controller: "AppTypeViewController",
                controllerAs: "appTypeCtrl"
            });
            whenWithTabs($routeProvider, "/apptype/:appTypeName/app/:appId", {
                templateUrl: "partials/app.html",
                controller: "AppViewController",
                controllerAs: "appCtrl"
            });
            whenWithTabs($routeProvider, "/apptype/:appTypeName/app/:appId/service/:serviceId", {
                templateUrl: "partials/service.html",
                controller: "ServiceViewController",
                controllerAs: "serviceCtrl"
            });
            whenWithTabs($routeProvider, "/apptype/:appTypeName/app/:appId/service/:serviceId/partition/:partitionId", {
                templateUrl: "partials/partition.html",
                controller: "PartitionViewController",
                controllerAs: "partitionCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/app/:appId", {
                templateUrl: "partials/mesh/mesh-app.html",
                controller: "MeshAppViewController",
                controllerAs: "MeshAppCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/app/:appId/service/:serviceId", {
                templateUrl: "partials/mesh/mesh-app-service.html",
                controller: "MeshAppServiceViewController",
                controllerAs: "MeshAppServiceCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/app/:appId/service/:serviceId/replica/:replicaId", {
                templateUrl: "partials/mesh/mesh-app-service-replica.html",
                controller: "MeshAppServiceReplicaViewController",
                controllerAs: "MeshAppServiceReplicaCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/gateways", {
                templateUrl: "partials/mesh/mesh-gateways.html",
                controller: "MeshGatewaysViewController",
                controllerAs: "MeshGatewaysCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/gateway/:gatewayName", {
                templateUrl: "partials/mesh/mesh-gateway.html",
                controller: "MeshGatewayViewController",
                controllerAs: "MeshGatewayCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/secrets", {
                templateUrl: "partials/mesh/mesh-secrets.html",
                controller: "MeshSecretsViewController",
                controllerAs: "MeshSecretsCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/secret/:secretName", {
                templateUrl: "partials/mesh/mesh-secret.html",
                controller: "MeshSecretViewController",
                controllerAs: "MeshSecretCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/volumes", {
                templateUrl: "partials/mesh/mesh-volumes.html",
                controller: "MeshVolumesViewController",
                controllerAs: "MeshVolumesCtrl"
            });
            whenWithTabs($routeProvider, "/mesh/volume/:volumeName", {
                templateUrl: "partials/mesh/mesh-volume.html",
                controller: "MeshVolumeViewController",
                controllerAs: "MeshVolumeCtrl"
            });
            $routeProvider.otherwise({
                templateUrl: "partials/cluster.html",
                controller: "ClusterViewController",
                controllerAs: "clusterCtrl"
            });
        }]);
    })();
}
