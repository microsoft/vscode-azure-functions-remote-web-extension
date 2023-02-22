/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { TunnelRelayTunnelClient } from "@vs/tunnels-connections";
import {
  Tunnel,
  TunnelAccessControlEntry,
  TunnelAccessControlEntryType,
} from "@vs/tunnels-contracts";
import {
  TunnelManagementHttpClient,
  TunnelRequestOptions,
} from "@vs/tunnels-management";
import { SshStream } from "@vs/vs-ssh";
import { IServerTunnel } from "./types";
import pRetry from "p-retry";

let tunnelManagementClientImpl: TunnelManagementHttpClient;

export namespace Basis {
  export async function connectToTunnel(
    accessToken: string,
    tunnel: string | IServerTunnel,
    port: number
  ): Promise<SshStream> {
    const tunnelManagementClient: TunnelManagementHttpClient =
      new TunnelManagementHttpClient("vscode.dev.azureml-remote-web", () =>
        Promise.resolve(`Bearer ${accessToken}`)
      );

    let tunnelDef =
      typeof tunnel === "string"
        ? getTunnelDefByName(tunnel)
        : getTunnelDefById(tunnel.id, tunnel.cluster);
    let tunnelInstance = await getTunnel(tunnelDef, tunnelManagementClient);
    let tunnelRelayTunnelClient = new TunnelRelayTunnelClient();

    tunnelRelayTunnelClient.trace = (
      _level: any,
      _eventId: any,
      msg: any,
      _err: any
    ) => {
      console.log(msg);
    };

    await tunnelRelayTunnelClient.connectClient(
      tunnelInstance!,
      tunnelInstance!.endpoints!
    );

    // Get stream to talk to remote
    await tunnelRelayTunnelClient.waitForForwardedPort(port);
    return await tunnelRelayTunnelClient.connectToForwardedPort(port);
  }

  function getTunnelDefById(tunnelId: string, clusterId: string): Tunnel {
    return {
      tunnelId: tunnelId,
      clusterId: clusterId,
    };
  }

  function getTunnelDefByName(tunnelName: string): Tunnel {
    return {
      name: tunnelName,
    };
  }

  async function getTunnel(
    tunnel: Tunnel,
    tunnelManagementClient: TunnelManagementHttpClient
  ): Promise<Tunnel> {
    const tunnelRequestOptions: TunnelRequestOptions = {
      includePorts: true,
      // scopes: ["host"],
      tokenScopes: ["host"],
    };

    const foundTunnel = await tunnelManagementClient.getTunnel(
      tunnel,
      tunnelRequestOptions
    );
    if (!foundTunnel) {
      throw new Error("Unable to find tunnel");
    }

    return foundTunnel;
  }

  export async function containsTunnel(
    accessToken: string,
    tunnelName: string
  ): Promise<boolean> {
    const tunnelManagementClient: TunnelManagementHttpClient =
      new TunnelManagementHttpClient("vscode.dev.azureml-remote-web", () =>
        Promise.resolve(`Bearer ${accessToken}`)
      );

    const allTunnels = await tunnelManagementClient.listTunnels();
    console.log(`AzureMLRemote: Found ${allTunnels.length} tunnels`);

    for (const tunnel of allTunnels) {
      console.log(`AzureMLRemote: Found tunnel ${tunnel.name}`);
      if (tunnel.name === tunnelName) {
        return true;
      }
    }

    return false;
  }

  export async function createTunnel(accessToken: string): Promise<Tunnel> {
    const tunnelManagementClient: TunnelManagementHttpClient =
      new TunnelManagementHttpClient("vscode.dev.azureml-remote-web", () =>
        Promise.resolve(`Bearer ${accessToken}`)
      );

    const tunnel = await tunnelManagementClient.createTunnel(
      {},
      {
        tokenScopes: ["connect", "host"],
      }
    );

    return tunnel;
  }

  function makeString(): string {
    let outString: string = "";
    let inOptions: string = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 32; i++) {
      outString += inOptions.charAt(
        Math.floor(Math.random() * inOptions.length)
      );
    }

    return outString;
  }

  export async function createTunnelWithPort(
    accessToken: string,
    tunnelName: string,
    portNumber: number
  ): Promise<any> {
    return pRetry(
      async () => {
        tunnelManagementClientImpl = tunnelManagementClientImpl
          ? tunnelManagementClientImpl
          : new TunnelManagementHttpClient(
              "vscode.dev.azurefunctions-remote-web",
              () => Promise.resolve(`Bearer ${accessToken}`)
            );
        let tunnelAccessControlEntry: TunnelAccessControlEntry = {
          type: TunnelAccessControlEntryType.Anonymous,
          subjects: [],
          scopes: ["host"],
        };

        const tunnel: Tunnel = {
          name: tunnelName || makeString(),
          ports: [{ portNumber: portNumber, protocol: "auto" }],
          accessControl: {
            entries: [tunnelAccessControlEntry],
          },
        };
        let tunnelRequestOptions: TunnelRequestOptions = {
          tokenScopes: ["host"],
          includePorts: true,
        };

        let tunnelInstance = await tunnelManagementClientImpl.createTunnel(
          tunnel,
          tunnelRequestOptions
        );

        return {
          tunnelId: tunnelInstance!.tunnelId!,
          name: tunnelInstance!.name,
          remotePort: portNumber,
          token: tunnelInstance!.accessTokens?.host,
          clusterId: tunnelInstance!.clusterId,
        };
      },
      {
        onFailedAttempt: async (error: any) => {
          //TODO: check err is limit error and delete

          if (error!.response?.status === 429) {
            console.log(error);
            console.log(
              `Deleting inactive tunnels as max tunnel count limit for user reached`
            );
            return await Basis.deleteInactiveTunnels(accessToken);
          }
        },
        retries: 3,
      }
    );
  }

  export async function isActive(
    accessToken: string,
    tunnel: Tunnel
  ): Promise<any> {
    tunnelManagementClientImpl = tunnelManagementClientImpl
      ? tunnelManagementClientImpl
      : new TunnelManagementHttpClient(
          "vscode.dev.azurefunctions-remote-web",
          () => Promise.resolve(`Bearer ${accessToken}`)
        );
    let tunnelInstance = await getTunnel(tunnel, tunnelManagementClientImpl);
    return (
      tunnelInstance!.status?.hostConnectionCount !== undefined &&
      tunnelInstance!.status?.hostConnectionCount !== 0
    );
  }

  export function isTunnelActive(tunnel: Tunnel): boolean {
    console.log(
      tunnel!.status?.hostConnectionCount !== undefined &&
        tunnel!.status?.hostConnectionCount !== 0
    );
    return (
      tunnel!.status?.hostConnectionCount !== undefined &&
      tunnel!.status?.hostConnectionCount !== 0
    );
  }

  export async function findTunnel(
    accessToken: string,
    tunnel: Tunnel
  ): Promise<any> {
    tunnelManagementClientImpl = tunnelManagementClientImpl
      ? tunnelManagementClientImpl
      : new TunnelManagementHttpClient(
          "vscode.dev.azurefunctions-remote-web",
          () => Promise.resolve(`Bearer ${accessToken}`)
        );
    let tunnelInstance = await getTunnel(tunnel, tunnelManagementClientImpl);

    return {
      tunnelId: tunnelInstance!.tunnelId!,
      name: tunnelInstance!.name,
      remotePort: 31545,
      token: tunnelInstance!.accessTokens?.host,
      clusterId: tunnelInstance!.clusterId,
    };
  }

  export async function deleteTunnel(
    accessToken: string,
    tunnel: Tunnel
  ): Promise<any> {
    tunnelManagementClientImpl = tunnelManagementClientImpl
      ? tunnelManagementClientImpl
      : new TunnelManagementHttpClient(
          "vscode.dev.azurefunctions-remote-web",
          () => Promise.resolve(`Bearer ${accessToken}`)
        );

    return await tunnelManagementClientImpl.deleteTunnel(tunnel);
  }

  export async function deleteInactiveTunnels(
    accessToken: string
  ): Promise<any> {
    tunnelManagementClientImpl = tunnelManagementClientImpl
      ? tunnelManagementClientImpl
      : new TunnelManagementHttpClient(
          "vscode.dev.azurefunctions-remote-web",
          () => Promise.resolve(`Bearer ${accessToken}`)
        );

    const tunnels = await tunnelManagementClientImpl.listTunnels();
    let inactiveTunnels: Tunnel[] = [];
    if (tunnels && tunnels.length > 0) {
      inactiveTunnels = tunnels.filter((tl) => !Basis.isTunnelActive(tl));
    }

    return await Promise.all(
      inactiveTunnels.map(async (inactiveTunnel) => {
        await tunnelManagementClientImpl.deleteTunnel(inactiveTunnel);
      })
    );
  }

  export async function listTunnels(
    accessToken: string,
    tunnel: Tunnel
  ): Promise<any> {
    tunnelManagementClientImpl = tunnelManagementClientImpl
      ? tunnelManagementClientImpl
      : new TunnelManagementHttpClient(
          "vscode.dev.azurefunctions-remote-web",
          () => Promise.resolve(`Bearer ${accessToken}`)
        );

    return await tunnelManagementClientImpl.listTunnels();
  }
}
