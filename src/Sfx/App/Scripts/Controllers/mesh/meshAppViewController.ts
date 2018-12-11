//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IMeshAppViewScope extends angular.IScope {
        application: any;
        listSettings: ListSettings;
        // healthEventsListSettings: ListSettings;
        // unhealthyEvaluationsListSettings: ListSettings;
        // replicaEvents: ReplicaEventList;
    }

    export class MeshAppViewController extends MainViewController {
        public appName: string;
        listSettings: ListSettings;
        // public serviceId: string;
        // public partitionId: string;
        // public replicaId: string;
        // public appTypeName: string;

        constructor($injector: angular.auto.IInjectorService, private $scope: IMeshAppViewScope) {
            super($injector, {
                "essentials": { name: "Essentials" },
            });
            this.tabs["essentials"].refresh = (messageHandler) => this.refreshEssentials(messageHandler);

            // let params = this.routeParams;
            // this.appId = IdUtils.getAppId(params);
            // this.serviceId = IdUtils.getServiceId(params);
            // this.partitionId = IdUtils.getPartitionId(params);
            // this.replicaId = IdUtils.getReplicaId(params);
            // this.appTypeName = IdUtils.getAppTypeName(params);
            let params = this.routeParams;
            this.appName = IdUtils.getAppId(params);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshGroup(),
                IdGenerator.meshAppGroup(),
                IdGenerator.meshApp(this.appName)
            ]);

            this.$scope.listSettings = this.settings.getNewOrExistingListSettings("services", ["name"], [
                new ListColumnSettingForLink("name", "Name", item => item.viewPath),
                new ListColumnSettingForBadge("healthState", "Health State"),
                new ListColumnSettingWithFilter("raw.properties.status", "Status"),
            ]);

            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshApp(this.appName)
                .then(app => {
                    this.$scope.application = app;
                });
        }

        private refreshEssentials(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.$scope.application.services.refresh(messageHandler);
            // return this.$q.all([
            //     this.$scope.application.services.refresh(messageHandler),
            //     ]);
        }

    }

    (function () {

        let module = angular.module("MeshAppViewController", ["ngRoute", "dataService"]);
        module.controller("MeshAppViewController", ["$injector", "$scope", MeshAppViewController]);

    })();
}
