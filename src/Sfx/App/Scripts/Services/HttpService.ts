//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export class HttpClient {
        private httpClient: Promise<Standalone.http.IHttpClient>;

        constructor(private $q: angular.IQService, private $http: angular.IHttpService) {
            if (StandaloneIntegration.isStandalone()) {
                this.httpClient = StandaloneIntegration.getHttpClient();
                this.httpClient.then((client) => client.setRequestTemplateAsync({
                    method: undefined,
                    url: undefined,
                    headers: [
                        {
                            name: Constants.SfxVersionMetadataName,
                            value: VersionInfo.Version
                        },
                        {
                            name: Constants.SfxBuildMetadataName,
                            value: VersionInfo.Build
                        },
                        {
                            name: Constants.SfxTelemetryMetadataName,
                            value: Constants.SfxTelemetryHeaderValue
                        }
                    ]
                }));
            }

            this.$http.defaults.headers.common[Constants.SfxVersionMetadataName] = VersionInfo.Version;
            this.$http.defaults.headers.common[Constants.SfxBuildMetadataName] = VersionInfo.Build;
            this.$http.defaults.headers.common[Constants.SfxTelemetryMetadataName] = Constants.SfxTelemetryHeaderValue;
        }

        insertParam(url:string, key: string, value: string): string
        {
            key = encodeURI(key); value = encodeURI(value);

            var kvp = url.split('&');

            var i=kvp.length; var x; while(i--) 
            {
                x = kvp[i].split('=');

                if (x[0]==key)
                {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }

            if(i<0) {kvp[kvp.length] = [key,value].join('=');}

            //this will reload the page, it's likely better to store this until finished
            return kvp.join('&'); 
        }

        
        getapp(): string
        {

            // var url = new URL(window.location.href);
            // return url.searchParams.get("serviceapp");
            return new URLSearchParams(window.location.hash.substring(1).split('?')[1]).get('serviceapp')
        }

        public getAsync<T>(url: string): angular.IHttpPromise<T> {

            url = this.insertParam(url, "serviceapp", this.getapp())
            // console.log(url);

            return this.httpClient ? this.requestAsync({ method: "GET", url: url }) : this.$http.get(url);
        }

        public postAsync<T>(url: string, data: any): angular.IHttpPromise<T> {
            url = this.insertParam(url, "serviceapp", this.getapp())
            // console.log(url);
            return this.httpClient ? this.requestAsync({ method: "POST", url: url, body: data }) : this.$http.post(url, data);
        }

        public putAsync<T>(url: string, data: any): angular.IHttpPromise<T> {
            url = this.insertParam(url, "serviceapp", this.getapp())
            // console.log(url);
            return this.httpClient ? this.requestAsync({ method: "PUT", url: url, body: data }) : this.$http.put(url, data);
        }

        public patchAsync<T>(url: string, data: any): angular.IHttpPromise<T> {
            url = this.insertParam(url, "serviceapp", this.getapp())
            // console.log(url);
            return this.httpClient ? this.requestAsync({ method: "PATCH", url: url, body: data }) : this.$http.patch(url, data);
        }

        public deleteAsync<T>(url: string): angular.IHttpPromise<T> {
            url = this.insertParam(url, "serviceapp", this.getapp())
            // console.log(url);
            return this.httpClient ? this.requestAsync({ method: "DELETE", url: url }) : this.$http.delete(url);
        }

        public requestAsync<T>(request: Standalone.http.IHttpRequest): angular.IHttpPromise<T> {
            return this.$q<angular.IHttpPromiseCallbackArg<T>>((resolve, reject) => {
                this.httpClient
                    .then((client) => client.requestAsync(request))
                    .then(
                        (response) => resolve({
                            data: response.data,
                            status: response.statusCode,
                            statusText: response.statusMessage,
                            headers: undefined,
                            config: undefined,
                            xhrStatus: undefined
                        }),
                        (err) => reject(err));
            });
        }
    }

    (function () {
        const module = angular.module("httpService", []);

        module.factory("httpClient", ["$q", "$http", ($q, $http) => new HttpClient($q, $http)]);
    })();
}
