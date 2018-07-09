//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

import {
    RequestAsyncProcessor,
    ResponseAsyncHandler,
    IRequestOptions
} from "sfx.http";

import { ILog } from "sfx.logging";
import {
    ICertificateLoader,
    IPemCertificate,
    IPfxCertificate,
    ICertificateInfo
} from "sfx.cert";

import * as https from "https";
import * as http from "http";
import * as url from "url";
import * as crypto from "crypto";
import { PeerCertificate } from "tls";

import { HttpProtocols, SslProtocols } from "./common";
import * as utils from "../../utilities/utils";
import HttpClientBase from "./http-client-base";

function objectToString(obj: any): string {
    const propertyNames = Object.getOwnPropertyNames(obj);
    let str = "";

    for (const propertyName of propertyNames) {
        str += `${propertyName}=${obj[propertyName]}, `;
    }

    return str.substr(0, str.length - 2);
}

function toCertificateInfo(cert: PeerCertificate): ICertificateInfo {
    const sha1 = crypto.createHash("sha1");

    sha1.update(cert.raw);

    return {
        subjectName: objectToString(cert.subject),
        issuerName: objectToString(cert.issuer),
        serialNumber: cert.serialNumber,
        validStart: new Date(cert.valid_from),
        validExpiry: new Date(cert.valid_to),
        thumbprint: sha1.digest("hex")
    };
}

export default class HttpClient extends HttpClientBase<http.RequestOptions> {
    private readonly certLoader: ICertificateLoader;

    constructor(
        log: ILog,
        certLoader: ICertificateLoader,
        protocol: string,
        requestAsyncProcessor: RequestAsyncProcessor,
        responseAsyncHandler: ResponseAsyncHandler) {
        super(log, protocol, requestAsyncProcessor, responseAsyncHandler);

        if (!Object.isObject(certLoader)) {
            throw new Error("certLoader must be supplied.");
        }

        this.certLoader = certLoader;
    }

    protected generateHttpRequestOptions(requestOptions: IRequestOptions): https.RequestOptions {
        const options: https.RequestOptions = Object.create(this.httpRequestOptions);

        Object.assign(options, url.parse(requestOptions.url));

        options.method = requestOptions.method;

        if (Object.isObject(requestOptions.headers)) {
            options.headers = Object.assign(Object.create(null), options.headers, requestOptions.headers);
        } else if (!utils.isNullOrUndefined(requestOptions.headers)) {
            throw new Error("requestOptions.headers must be an object or null/undefined.");
        }

        if (String.isString(requestOptions.sslProtocol)) {
            if (!Object.values(SslProtocols).includes(requestOptions.sslProtocol)) {
                throw new Error(`Unknown sslProtocol: ${requestOptions.sslProtocol}`);
            }

            options.secureProtocol = requestOptions.sslProtocol;
        }

        if (requestOptions.clientCert) {
            requestOptions.clientCert = this.certLoader.load(requestOptions.clientCert);

            if (requestOptions.clientCert.type === "pfx") {
                options.pfx = (<IPfxCertificate>requestOptions.clientCert).pfx;
                options.passphrase = (<IPfxCertificate>requestOptions.clientCert).password;

            } else if (requestOptions.clientCert.type === "pem") {
                options.key = (<IPemCertificate>requestOptions.clientCert).key;
                options.cert = (<IPemCertificate>requestOptions.clientCert).cert;
                options.passphrase = (<IPemCertificate>requestOptions.clientCert).password;

            } else {
                throw new Error("Invalid clientCert: " + utils.defaultStringifier(requestOptions.clientCert));
            }
        }

        if (Function.isFunction(requestOptions.serverCertValidator)) {
            options.rejectUnauthorized = false;
            options["checkServerIdentity"] =
                (serverName, cert) => requestOptions.serverCertValidator(serverName, toCertificateInfo(cert));
        }

        return options;
    }

    protected makeRequest(options: http.RequestOptions): http.ClientRequest {
        let protocol: string;

        if (this.protocol === HttpProtocols.any) {
            protocol = options.protocol;
        } else {
            protocol = this.protocol;
        }

        try {
            if (protocol === "http:" || protocol === "http") {
                return http.request(options);
            } else if (protocol === "https:" || protocol === "https") {
                return https.request(options);
            } else {
                throw new Error(`unsupported protocol: ${protocol}`);
            }
        } catch (exception) {
            this.log.writeException(exception);
            throw exception;
        }
    }
}