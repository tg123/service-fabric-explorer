//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IMeshAppServiceReplicaViewScope extends angular.IScope {
        replica: MeshServiceReplica;
        listSettings: ListSettings;
        // healthEventsListSettings: ListSettings;
        // unhealthyEvaluationsListSettings: ListSettings;
        // replicaEvents: ReplicaEventList;
    }

    export class MeshAppServiceReplicaViewController extends MainViewController {
        public appName: string;
        public serviceName: string;
        public replicaId: string;
        listSettings: ListSettings;


        constructor($injector: angular.auto.IInjectorService, private $scope: IMeshAppServiceReplicaViewScope) {
            super($injector, {
                "essentials": { name: "Essentials" },
            });
            // this.tabs["essentials"].refresh = (messageHandler) => this.refreshEssentials(messageHandler);


            let params = this.routeParams;
            this.appName = IdUtils.getAppId(params);
            this.serviceName = IdUtils.getServiceId(params);
            this.replicaId = IdUtils.getReplicaId(params);

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
            return this.data.getMeshServiceReplica(this.appName, this.serviceName, this.replicaId)
                .then(replica => {
                    console.log(replica);
                    this.$scope.replica = replica;
                });
        }

    }

    (function () {

        let module = angular.module("MeshAppServiceReplicaViewController", ["ngRoute", "dataService"]);
        module.controller("MeshAppServiceReplicaViewController", ["$injector", "$scope", MeshAppServiceReplicaViewController]);

    })();
}
