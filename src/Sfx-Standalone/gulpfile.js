//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

const gulp = require("gulp");
const cookie = require("cookie.gulp");
const dd = require("cookie.gulp/dynamic-dependency");
const { Transform, PassThrough } = require("stream");

/**
 * 
 * @param {IElectronLinuxInstallerProcessorConfig} config 
 * @param {IBuildTaget} buildTarget 
 * @param {IBuildInfos} buildInfos 
 * @param {IPackageConfig} packageJson 
 * @returns {NodeJS.ReadWriteStream}
 */
function constructProcessor(config, buildTarget, buildInfos, packageJson) {
    return new Transform({
        objectMode: true,
         /** @param {import("vinyl")} chunk */
         transform(chunk, encoding, callback) {
            console.log("Is electron-installer-debian Installed: ", dd.isModuleInstalled("electron-installer-debian"));
            this.push(chunk);
            callback();
        }
    });
}

cookie.processor("test-p", constructProcessor);

require("cookie.gulp")(gulp.registry());
