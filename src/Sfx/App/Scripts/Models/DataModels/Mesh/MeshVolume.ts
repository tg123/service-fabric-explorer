//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export class MeshVolume extends DataModelBase<IRawMeshSecret> {
        public constructor(data: DataService, raw: IRawMeshSecret) {
            super(data, raw);
            console.log(this);
            this.updateInternal();
        }

        public get name(): string {
            return this.raw.name;
        }

        public get viewPath(): string {
            return this.data.routes.getMeshVolumeViewPath(this.raw.name);
        }

        protected retrieveNewData(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return Utils.getHttpResponseData(this.data.restClient.getMeshVolume(this.name, messageHandler));
        }
    }
}

