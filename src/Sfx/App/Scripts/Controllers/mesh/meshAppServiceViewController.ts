//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IMeshAppServiceViewScope extends angular.IScope {
        service: MeshService;
        listSettings: ListSettings;
        // healthEventsListSettings: ListSettings;
        // unhealthyEvaluationsListSettings: ListSettings;
        // replicaEvents: ReplicaEventList;
    }

    export class MeshAppServiceViewController extends MainViewController {
        public appName: string;
        public serviceName: string;
        listSettings: ListSettings;


        constructor($injector: angular.auto.IInjectorService, private $scope: IMeshAppServiceViewScope) {
            super($injector, {
                "essentials": { name: "Essentials" },
            });
            // this.tabs["essentials"].refresh = (messageHandler) => this.refreshEssentials(messageHandler);


            let params = this.routeParams;
            this.appName = IdUtils.getAppId(params);
            this.serviceName = IdUtils.getServiceId(params);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshGroup(),
                IdGenerator.meshAppGroup(),
                IdGenerator.meshApp(this.appName),
                IdGenerator.meshAppService(this.serviceName)
            ]);

            // this.$scope.listSettings = this.settings.getNewOrExistingListSettings("services", ["name"], [
            //     new ListColumnSettingForLink("name", "Name", item => item.viewPath),
            //     new ListColumnSettingForBadge("healthState", "Health State"),
            //     new ListColumnSettingWithFilter("raw.properties.status", "Status"),
            // ]);

            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshService(this.appName, this.serviceName)
                .then(service => {
                    console.log(service);
                    this.$scope.service = service;
                });
        }

    }

    (function () {

        let module = angular.module("MeshAppServiceViewController", ["ngRoute", "dataService"]);
        module.controller("MeshAppServiceViewController", ["$injector", "$scope", MeshAppServiceViewController]);

    })();
}
