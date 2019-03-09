//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

const gulp = require("gulp");
const cookie = require("cookie.gulp");
const dd = require("cookie.gulp/dynamic-dependency");
const { Transform, PassThrough } = require("stream");
const log = require("cookie.gulp/log");
const fs = require("fs");
const path = require("path");

/**
 * 
 * @param {IElectronLinuxInstallerProcessorConfig} config 
 * @param {IBuildTaget} buildTarget 
 * @param {IBuildInfos} buildInfos 
 * @param {IPackageConfig} packageJson 
 * @returns {NodeJS.ReadWriteStream}
 */
function constructProcessor(config, buildTarget, buildInfos, packageJson) {

    log.info("cwd:", process.cwd());

    return new Transform({
        objectMode: true,
        /** @param {import("vinyl")} chunk */
        transform(chunk, encoding, callback) {
            const address = path.join(process.cwd(), "node_modules", "electron-installer-zip");
            log.info(address, "=>", fs.existsSync(address));

            log.info("require.cache", JSON.stringify(require.cache));

            log.info("Is electron-installer-zip Installed: ", dd.isModuleInstalled("electron-installer-zip"));
            this.push(chunk);
            callback();
        }
    });
}

cookie.processor("test-p", constructProcessor);

require("cookie.gulp")(gulp.registry());
