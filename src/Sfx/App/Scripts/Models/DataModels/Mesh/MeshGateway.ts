//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class MeshGateway extends DataModelBase<IRawMeshGateway> {

        public constructor(data: DataService, raw: IRawMeshGateway) {
            super(data, raw);
            console.log(this);

            this.updateInternal();

            if (this.data.actionsEnabled()) {
                this.setUpActions();
            }
        }

        public get name(): string {
            return this.raw.name;
        }

        public flattenedHttp(): any[] {
            let l = [];
            if(this.raw.properties.http){
                this.raw.properties.http.forEach(http => {
                    http.hosts.forEach(
                        host => {
                            host.routes.forEach(route => {
                                l.push({
                                    name : http.name,
                                    port: http.port,
    
                                    hostName: host.name,
                                    ...route.destination,
                                    ...route.match.path,
                                    routeName: route.name
                                })
                        })
                    })
                })
            }
            console.log(l);
            return l;
        }

        public get viewPath(): string {
            return this.data.routes.getMeshGatewayViewPath(this.raw.name);
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

