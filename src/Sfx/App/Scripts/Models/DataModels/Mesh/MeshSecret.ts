//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export class MeshSecretValue extends DataModelBase<IRawSecretValue> {

        public constructor(data: DataService, raw: IRawSecretValue, public parent: MeshSecret) {
            super(data, raw, parent);
            console.log(this);

            this.updateInternal();

        }

        public get name(): string {
            return this.raw.name;
        }

        protected retrieveNewData(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return Utils.getHttpResponseData(this.data.restClient.getMeshSecretValue(this.parent.name, this.name, messageHandler));
        }

        public getValue(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return Utils.getHttpResponseData(this.data.restClient.getMeshSecretValueValue(this.parent.name, this.name, messageHandler));
        }
    }

    export class MeshSecret extends DataModelBase<IRawMeshSecret> {

        public secretValues: MeshSecretValueCollection;


        public constructor(data: DataService, raw: IRawMeshSecret) {
            super(data, raw);
            console.log(this);
            this.secretValues = new MeshSecretValueCollection(data, this);

            this.updateInternal();

        }

        public get name(): string {
            return this.raw.name;
        }

        public get viewPath(): string {
            return this.data.routes.getMeshSecretViewPath(this.raw.name);
        }

        protected retrieveNewData(messageHandler?: IResponseMessageHandler): angular.IPromise<any> {
            return Utils.getHttpResponseData(this.data.restClient.getMeshSecret(this.name, messageHandler));
        }
    }
}

