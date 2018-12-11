//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class MeshApplication extends DataModelBase<IRawMeshApplication> {
        // public decorators: IDecorators = {
        //     decorators: {
        //         "LastInBuildDurationInSeconds": {
        //             displayName: (name) => "Last In Build Duration",
        //             displayValueInHtml: (value) => this.lastInBuildDuration
        //         },
        //         "NodeName": {
        //             displayValueInHtml: (value) => HtmlUtils.getLinkHtml(value, this.nodeViewPath)
        //         },
        //         "ReplicaRole": {
        //             displayValueInHtml: (value) => this.role
        //         }
        //     }
        // };

        // public health: ReplicaHealth;
        // public detail: DeployedReplicaDetail;
        // public address: any;
        public services: MeshServiceCollection;

        public constructor(data: DataService, raw: IRawMeshApplication) {
            super(data, raw);
            console.log(this);
            this.services = new MeshServiceCollection(data, this);

            this.updateInternal();

            if (this.data.actionsEnabled()) {
                this.setUpActions();
            }
        }

        // public get id(): string {
        //     return this.raw.ReplicaId || this.raw.InstanceId;
        // }

        public get name(): string {
            return this.raw.name;
        }


        public get viewPath(): string {
            return this.data.routes.getMeshApplicationViewPath(this.raw.name);
        }

        protected retrieveNewData(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return Utils.getHttpResponseData(this.data.restClient.getMeshApplication(this.name, messageHandler));
        }

        protected updateInternal(): angular.IPromise<any> | void {
        }

        private setUpActions(): void {
            // let serviceName = this.parent.parent.raw.Name;

            // this.actions.add(new ActionWithConfirmationDialog(
            //     this.data.$uibModal,
            //     this.data.$q,
            //     "Restart Replica",
            //     "Restart Replica",
            //     "Restarting",
            //     () => this.restartReplica(),
            //     () => true,
            //     `Confirm Replica Restart`,
            //     `Restart Replica for ${serviceName}`,
            //     "confirm"
            // ));
        }
    }
}

