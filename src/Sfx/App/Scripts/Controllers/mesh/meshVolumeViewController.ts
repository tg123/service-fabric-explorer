//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IMeshSecretViewScope extends angular.IScope {
        volume: MeshVolume;
        listSettings: ListSettings;
    }

    export class MeshVolumeViewController extends MainViewController {
        public volumeName: string;
        listSettings: ListSettings;

        constructor($injector: angular.auto.IInjectorService, private $scope: IMeshSecretViewScope) {
            super($injector, {
                "essentials": { name: "Essentials" },
            });
            // this.tabs["essentials"].refresh = (messageHandler) => this.refreshEssentials(messageHandler);


            let params = this.routeParams;
            this.volumeName = IdUtils.getVolumetName(params);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshGroup(),
                IdGenerator.meshSecretGroup(),
                IdGenerator.meshVolume(this.volumeName),
            ]);

            // this.$scope.listSettings = this.settings.getNewOrExistingListSettings("secretvalues", ["name"], [
            //     new ListColumnSettingWithFilter("name", "Version"),
            // ]);

            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshVolume(this.volumeName, true)
                .then(volume => {
                    console.log(volume);
                    this.$scope.volume = volume;
                });
        }

        // private refreshEssentials(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
        //     return this.$q.all([
        //         this.$scope.secret.secretValues.refresh(messageHandler),
        //         ]);
        // }

    }

    (function () {

        let module = angular.module("MeshVolumeViewController", ["ngRoute", "dataService"]);
        module.controller("MeshVolumeViewController", ["$injector", "$scope", MeshVolumeViewController]);

    })();
}
