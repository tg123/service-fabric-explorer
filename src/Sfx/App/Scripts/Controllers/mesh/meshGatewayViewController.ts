//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IMeshGatewayViewScope extends angular.IScope {
        gateway: MeshGateway;
        listSettings: ListSettings;
        httpListSettings: ListSettings;
        flattenedHttp: any[];
    }

    export class MeshGatewayViewController extends MainViewController {
        public gatewayName: string;
        listSettings: ListSettings;


        constructor($injector: angular.auto.IInjectorService, private $scope: IMeshGatewayViewScope) {
            super($injector, {
                "essentials": { name: "Essentials" },
            });
            // this.tabs["essentials"].refresh = (messageHandler) => this.refreshEssentials(messageHandler);


            let params = this.routeParams;
            this.gatewayName = IdUtils.getGatewayName(params);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshGroup(),
                IdGenerator.meshGatewayGroup(),
                IdGenerator.meshGateway(this.gatewayName),
            ]);

            this.$scope.listSettings = this.settings.getNewOrExistingListSettings("tcp", ["application"], [
                new ListColumnSettingWithFilter("destination.applicationName", "Application"),
                new ListColumnSettingWithFilter("destination.endpointName", "Endpoint"),
                new ListColumnSettingWithFilter("destination.serviceName", "Service"),
                new ListColumnSettingWithFilter("name", "Name"),
                new ListColumnSettingWithFilter("port", "Port"),

            ]);

            this.$scope.httpListSettings = this.settings.getNewOrExistingListSettings("http", ["application"], [
                new ListColumnSettingWithFilter("applicationName", "Application"),
                new ListColumnSettingWithFilter("endpointName", "Endpoint"),
                new ListColumnSettingWithFilter("serviceName", "Service"),
                new ListColumnSettingWithFilter("name", "Name"),
                new ListColumnSettingWithFilter("port", "Port"),
                new ListColumnSettingWithFilter("hostName", "HostName"),
                new ListColumnSettingWithFilter("rewrite", "Rewrite"),
                new ListColumnSettingWithFilter("value", "Value"),
                new ListColumnSettingWithFilter("type", "Type"),
                new ListColumnSettingWithFilter("routeName", "RouteName"),
     
            ]
                // ,
                // [
                //     new ListColumnSetting(
                //         "name",
                //         "",
                //         [],
                //         null,
                //         (item) => { return `${JSON.stringify(item, null, "&nbsp;")}`  },
                //         -1), 
                //     // new ListColumnSettingWithFilter("hostName", "HostName"),
                //     // new ListColumnSettingWithFilter("rewrite", "Rewrite"),
                //     // new ListColumnSettingWithFilter("value", "Value"),
                //     // new ListColumnSettingWithFilter("type", "Type"),
                //     // new ListColumnSettingWithFilter("routeName", "RouteName"),
 
                // ],
                // true,
        );

            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshGateway(this.gatewayName)
                .then(gateway => {
                    console.log(gateway);
                    this.$scope.gateway = gateway;
                    console.log(gateway.flattenedHttp);
                    this.$scope.flattenedHttp = gateway.flattenedHttp();
                });
        }

    }

    (function () {

        let module = angular.module("MeshGatewayViewController", ["ngRoute", "dataService"]);
        module.controller("MeshGatewayViewController", ["$injector", "$scope", MeshGatewayViewController]);

    })();
}
