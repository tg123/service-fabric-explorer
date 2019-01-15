//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export interface IHelpTextEntry {
        text: string;
        externalLink: string;
    }

    export interface IHelpTextServiceEntry {
        serviceName: string;
        description: string;
        externalLink: string;
    }

    export class HelpText {
        static essentialsDescriptions = {
            upgradeDomain : {
                text : "Defines sets of nodes that are upgraded at the same time. Help the Cluster resource manager with management operations like upgrades.",
                externalLink: "https://aka.ms/sfhelpupgradedomain"
            },
            faultDomain : {
                text : "An area of coordinated failure. I,e Machines sharing a single power source.",
                externalLink: "https://aka.ms/sfhelpfaultdomain"
            },
            seedNode : {
                text : "Seed nodes maintain the availability of the underlying cluster by establishing leases with other nodes and serve as tiebreakers during certain kinds of network failures.",
                externalLink: "https://aka.ms/sfhelpseednode"
            },
            minReplicaSize : {
                text : "The number of replicas necessary for the service.",
                externalLink: "https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-cluster-description"
            },
            targetReplicaSize : {
                text : "The ideal number of replicas for the service to be considered healthy.",
                externalLink: "https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-cluster-description"
            },
            unhealthyEvaluation : {
                text : "Users and automated services can evaluate health for any entity at any time.",
                externalLink: "aka.ms/sfhelpunhealthyevaluation"
            }
        };

        static serviceDescriptions: IHelpTextServiceEntry[] = [
            {
                serviceName: "system/dnsservice",
                description: "Optional service that allows the cluster to discover other services using the DNS protocol.",
                externalLink: "https://aka.ms/sfhelpdns"
            },
            {
                serviceName: "system/eventstoreservice",
                description: "A service that maintains events from the cluster.",
                externalLink: "https://aka.ms/sfhelpeventstore"
            },
            {
                serviceName: "system/failovermanagerservice",
                description: "Ensures when nodes are added or removed from the cluster, the load is redistributed across the available nodes.",
                externalLink: "https://aka.ms/sfhelpfailover"
            },
            {
                serviceName: "system/faultanalysisservice",
                description: "Lets you induce meaningful faults and run test scenarios against your application.",
                externalLink: "https://aka.ms/sfhelpfaultanalysis"
            },
            {
                serviceName: "system/namingservice",
                description: "resolves service names to a location in the cluster.",
                externalLink: "https://aka.ms/sfhelpNaming"
            },
            {
                serviceName: "system/repairmanagerservice",
                description: "optional service that can provide repairs for Patch Orchestration Application and azure maintenance repairs for silver and gold durability clusters.",
                externalLink: "https://aka.ms/sfhelprepairmanager"
            }
        ];

        static getServiceDescription(name: string): IHelpTextServiceEntry {
            name = name.toLowerCase();
            let index = -1;
            HelpText.serviceDescriptions.forEach( (entry: IHelpTextServiceEntry, i: number) => {
                if (entry.serviceName === name) {
                    index = i;
                    return;
                }
            });
            return index > -1 ? HelpText.serviceDescriptions[index] : null;
        };
    }

}
