//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export interface IMeshSecretViewScope extends angular.IScope {
        secret: MeshSecret;
        listSettings: ListSettings;
    }

    export class MeshSecretViewController extends MainViewController {
        public secretName: string;
        listSettings: ListSettings;

        constructor($injector: angular.auto.IInjectorService, private $scope: IMeshSecretViewScope) {
            super($injector, {
                "essentials": { name: "Essentials" },
            });
            this.tabs["essentials"].refresh = (messageHandler) => this.refreshEssentials(messageHandler);


            let params = this.routeParams;
            this.secretName = IdUtils.getSecretName(params);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshGroup(),
                IdGenerator.meshSecretGroup(),
                IdGenerator.meshSecret(this.secretName),
            ]);

            this.$scope.listSettings = this.settings.getNewOrExistingListSettings("secretvalues", ["name"], [
                new ListColumnSettingWithFilter("name", "Version"),
            ]);

            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshSecret(this.secretName)
                .then(secret => {
                    console.log(secret);
                    this.$scope.secret = secret;
                });
        }

        private refreshEssentials(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.$q.all([
                this.$scope.secret.secretValues.refresh(messageHandler),
                ]);
        }

    }

    (function () {

        let module = angular.module("MeshSecretViewController", ["ngRoute", "dataService"]);
        module.controller("MeshSecretViewController", ["$injector", "$scope", MeshSecretViewController]);

    })();
}
