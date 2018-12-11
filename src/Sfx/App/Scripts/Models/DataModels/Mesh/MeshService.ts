//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class MeshService extends DataModelBase<IRawMeshApplicationService> {

        // public partitions: PartitionCollection;
        // public health: ServiceHealth;
        // public description: ServiceDescription;
        public replicas: MeshServiceReplicaCollection;

        public constructor(data: DataService, raw: IRawMeshApplicationService, public parent: MeshApplication) {
            super(data, raw, parent);

            this.replicas = new MeshServiceReplicaCollection(this.data, this);
            // this.health = new ServiceHealth(this.data, this, HealthStateFilterFlags.Default, HealthStateFilterFlags.None);
            // this.description = new ServiceDescription(this.data, this);

            if (this.data.actionsEnabled()) {
                this.setUpActions();
            }
        }

        public get name(): string {
            return this.raw.name;
        }

        public get viewPath(): string {
            return this.data.routes.getMeshAppServiceViewPath(this.parent.name, this.raw.name);
        }

        // public addHealthStateFiltersForChildren(clusterHealthChunkQueryDescription: IClusterHealthChunkQueryDescription): IServiceHealthStateFilter {
        //     let appFilter = this.parent.addHealthStateFiltersForChildren(clusterHealthChunkQueryDescription);
        //     let serviceFilter = _.find(appFilter.ServiceFilters, filter => filter.ServiceNameFilter === this.name);
        //     if (!serviceFilter) {
        //         serviceFilter = {
        //             ServiceNameFilter: this.name,
        //             PartitionFilters: []
        //         };
        //         appFilter.ServiceFilters.push(serviceFilter);
        //     }
        //     if (_.isEmpty(serviceFilter.PartitionFilters)) {
        //         serviceFilter.PartitionFilters = [{
        //             HealthStateFilter: HealthStateFilterFlags.All
        //         }];
        //     }
        //     return serviceFilter;
        // }

        // public updateService(updateServiceDescription: IRawUpdateServiceDescription): angular.IPromise<any> {
        //     return this.data.restClient.updateService(this.parent.id, this.id, updateServiceDescription);
        // }

        // protected retrieveNewData(messageHandler?: IResponseMessageHandler): angular.IPromise<IRawService> {
        //     return Utils.getHttpResponseData(this.data.restClient.getService(this.parent.id, this.id, messageHandler));
        // }

        private setUpActions(): void {
            // if (this.parent.raw.TypeName === Constants.SystemAppTypeName) {
            //     return;
            // }

            // this.actions.add(new ActionWithConfirmationDialog(
            //     this.data.$uibModal,
            //     this.data.$q,
            //     "deleteService",
            //     "Delete Service",
            //     "Deleting",
            //     () => this.delete(),
            //     () => true,
            //     "Confirm Service Deletion",
            //     `Delete service ${this.name} from cluster ${this.data.$location.host()}?`,
            //     this.name
            // ));

            // if (this.isStatelessService) {
            //     this.actions.add(new ActionScaleService(this.data.$uibModal, this.data.$q, this));
            // }
        }

    }
}

