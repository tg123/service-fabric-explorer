//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IVolumesViewScope extends angular.IScope {
        volumes: MeshVolumeCollection;
        listSettings: ListSettings;
    }

    export class MeshVolumesViewController extends MainViewController {
        constructor($injector: angular.auto.IInjectorService, public $scope: IVolumesViewScope) {
            super($injector);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshVolumeGroup()
            ]);
            this.$scope.listSettings = this.settings.getNewOrExistingListSettings("volumes", ["name"], [
                new ListColumnSettingForLink("name", "Name", item => item.viewPath),
                // new ListColumnSetting("raw.properties.kind", "Kind"),
                // new ListColumnSetting("raw.properties.contentType", "ContentType"),
                // new ListColumnSetting("raw.properties.status", "Status")

            ]);
            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshVolumes(true, messageHandler)
                .then(volumes => {
                    this.$scope.volumes = volumes;
                });
        }


    };

    (function () {

        let module = angular.module("MeshVolumesViewController", []);
        module.controller("MeshVolumesViewController", ["$injector", "$scope", MeshVolumesViewController]);

    })();
}
