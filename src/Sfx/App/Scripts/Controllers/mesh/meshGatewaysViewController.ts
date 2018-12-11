//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IGatewaysViewScope extends angular.IScope {
        gateways: MeshGatewayCollection;
        listSettings: ListSettings;
    }

    export class MeshGatewaysViewController extends MainViewController {
        constructor($injector: angular.auto.IInjectorService, public $scope: IGatewaysViewScope) {
            super($injector);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshGatewayGroup()
            ]);
            this.$scope.listSettings = this.settings.getNewOrExistingListSettings("gateways", ["name"], [
                new ListColumnSettingForLink("name", "Name", item => item.viewPath),
                new ListColumnSetting("raw.properties.sourceNetwork.name", "Source Network"),
                new ListColumnSetting("raw.properties.destinationNetwork.name", "Destination Network"),
                new ListColumnSetting("raw.properties.status", "Status")

            ]);
            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshGateways(true, messageHandler)
                .then(gateways => {
                    this.$scope.gateways = gateways;
                });
        }


    };

    (function () {

        let module = angular.module("MeshGatewaysViewController", []);
        module.controller("MeshGatewaysViewController", ["$injector", "$scope", MeshGatewaysViewController]);

    })();
}
