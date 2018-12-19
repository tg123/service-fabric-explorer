//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class TelemetrySettingsController extends ControllerWithResolver {
        constructor($injector: angular.auto.IInjectorService, public telemetrySvc: TelemetryService) {
            super($injector);
        }

        public setTelemetry() {
            // this.telemetrySvc.isEnabled = !this.telemetrySvc.isEnabled;
            console.log(this.telemetrySvc)
            this.telemetrySvc.setEnabledTelemetry(!this.telemetrySvc.isEnabled);
        }
    }

    (function () {

        let module = angular.module("TelemetrySettingsController", ["telemetryService"]);
        module.controller("TelemetrySettingsController", ["$injector", "telemetry", TelemetrySettingsController]);

    })();
}
