//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

module Sfx {

    export interface ISecretsViewScope extends angular.IScope {
        secrets: MeshSecretCollection;
        listSettings: ListSettings;
    }

    export class MeshSecretsViewController extends MainViewController {
        constructor($injector: angular.auto.IInjectorService, public $scope: ISecretsViewScope) {
            super($injector);

            this.selectTreeNode([
                IdGenerator.cluster(),
                IdGenerator.meshSecretGroup()
            ]);
            this.$scope.listSettings = this.settings.getNewOrExistingListSettings("secrets", ["name"], [
                new ListColumnSettingForLink("name", "Name", item => item.viewPath),
                new ListColumnSetting("raw.properties.kind", "Kind"),
                new ListColumnSetting("raw.properties.contentType", "ContentType"),
                new ListColumnSetting("raw.properties.status", "Status")

            ]);
            this.refresh();
        }

        protected refreshCommon(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return this.data.getMeshSecrets(true, messageHandler)
                .then(secrets => {
                    this.$scope.secrets = secrets;
                });
        }


    };

    (function () {

        let module = angular.module("MeshSecretsViewController", []);
        module.controller("MeshSecretsViewController", ["$injector", "$scope", MeshSecretsViewController]);

    })();
}
