//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export interface IHelpTextEntry{
        text: string;
        externalLink: string;
    }

    export class HelpText {
        static essentialsDescriptions = {
            upgradeDomain : {
                text : "Defines sets of nodes that are upgraded at the same time. Help the Cluster resource manager with management operations like upgrades",
                externalLink: "aka.ms/sfhelpupgradedomain"
            },
            faultDomain : {
                text : "An area of coordinated failure. I,e Machines sharing a single power source.",
                externalLink: "aka.ms/sfhelpfaultdomain"
            },
            seedNode : {
                text : "Seed nodes maintain the availability of the underlying cluster by establishing leases with other nodes and serve as tiebreakers during certain kinds of network failures.",
                externalLink: "aka.ms/sfhelpseednode"
            },
            minReplicaSize : {
                text : "Defines sets of nodes that are upgraded at the same time. Help the Cluster resource manager with management operations like upgrades",
                externalLink: "https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-cluster-description"
            },
            targetReplicaSize : {
                text : "Defines sets of nodes that are upgraded at the same time. Help the Cluster resource manager with management operations like upgrades",
                externalLink: "https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-cluster-description"
            }
        }

        static serviceDescriptions = [
            {
                serviceName: "DNSService",
                description: "Optional service that allows the cluster to discover other services using the DNS protocol",
                externalLink: "aka.ms/sfhelpdns"
            },
            {
                serviceName: "EventStoreService",
                description: "Optional service that allows the cluster to discover other services using the DNS protocol",
                externalLink: "aka.ms/sfhelpeventstore"
            },
            {
                serviceName: "FailoverManagerService",
                description: "Ensures when nodes are added or removed from the cluster, the load is redistributed across the available nodes.",
                externalLink: "aka.ms/sfhelpfailover"
            },
            {
                serviceName: "FaultAnalysisService",
                description: "Lets you induce meaningful faults and run test scenarios against your application.",
                externalLink: "aka.ms/sfhelpfaultanalysis"
            },
            {
                serviceName: "NamingService",
                description: "resolves service names to a location in the cluster",
                externalLink: "aka.ms/sfhelpNaming"
            },
            {
                serviceName: "RepairManagerService",
                description: "optional service that can provide repairs for Patch Orchestration Application and azure maintenance repairs for silver and gold durability clusters",
                externalLink: "aka.ms/sfhelprepairmanager"
            }
        ]
    }

}
