/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IWelcomeBanner, IWorkbenchConstructionOptions, IWorkspace, UriComponents } from 'vs/workbench/workbench.web.main';

export type RunCommand = { command: string; args: any[] };

export interface IPostWorkbenchCreationActions {
    readonly openUri?: UriComponents;
    runCommands?: RunCommand[];
}

export interface IPreWorkbenchDisposalActions {
    readonly runCommands?: RunCommand[];
}

export interface IRouteResult {
    workspace: IWorkspace;
    workbenchOptions?: IWorkbenchConstructionOptions;
    readonly onDidCreateWorkbench?: IPostWorkbenchCreationActions;
    readonly onWillDisposeWorkbench?: IPreWorkbenchDisposalActions;
    welcomeBanner?: IWelcomeBanner;
    suppressDefaultRemoteExtensions?: true;
}

// https://github.com/microsoft/vscode/blob/ae0f691839eff7dc0354224f7cff9ed3a128cf54/src/vscode-dts/vscode.d.ts#L14530
export interface AuthenticationSession {
    readonly id: string;
    readonly accessToken: string;
    readonly account: {
        label: string;
        id: string;
    };
    readonly scopes: readonly string[];
}

export interface MicrosoftAuthenticationSession {
    readonly id: string;
    readonly account: {
        label: string;
        id: string;
    };
    readonly scopes: readonly string[];
    getAccessToken(): Promise<string>;
}

export interface IMicrosoftAuthentication {
    getSessions(scopes: string[], options?: { clientId?: string; forceNewSession?: boolean }): Promise<MicrosoftAuthenticationSession[]>;
}

/**
 * The VSCode client configuration
 */
export interface IProductInfo {
    readonly commit?: string;
    readonly quality: 'stable' | 'insider';
}

export interface ExecuteCommand {
    (command: string, ...args: any[]): Promise<unknown>;
}

export interface IConnectionInfo {
    tunnel: IServerTunnel;
    port: number;
}

export interface IServeParams {
    socket_id: number;
    commit_id?: string;
    quality: 'stable' | 'insider';
    telemetry_level: string;
    extensions: string[];
}

export interface IServerMessage {
    i: number;
    body: Uint8Array;
}

export interface IJsonRpcNotification<T> {
    method: string;
    params: T;
}

export interface IJsonRpcRequest<T> extends IJsonRpcNotification<T> {
    id: number;
}

export type RPCServer = {
    serve: {
        request: IServeParams;
        response: IServeSuccess;
    };
    update: {
        request: IUpdateParams;
        response: IUpdateResponse;
    };
    servermsg: {
        request: IServerMessage;
    };
};

export type RPCClient = {
    servermsg: {
        request: IServerMessage;
    };
};

export type OnlyMethods<T> = { [K in keyof T]: T[K] extends { request: object; response: object } ? T[K] : never };
export type OnlyNotifications<T> = { [K in keyof T]: T[K] extends { request: object; response: never } ? T[K] : never };

export type IJsonRpcResponse<T> = {
    id: number;
} & ({ result: T } | { error: { code: number; message: string } });

export type IJsonRpcMessage<T> = IJsonRpcRequest<T> | IJsonRpcResponse<T> | IJsonRpcNotification<T>;

export interface IServeResponse {
    id: number;
    result: IServeSuccess;
}

export interface IServeRequest extends IJsonRpcRequest<IServeParams> {
    method: 'serve';
}

export interface IServerTunnel {
    id: string;
    token: string;
    cluster: string;
}

export interface IServeSuccess {
    listening_port: number;
    connection_token: string;
    tunnel: IServerTunnel | undefined;
}

export interface IUpdateResponse {
    up_to_date: boolean;
    did_update: boolean;
}

export interface IUpdateParams {
    do_update: boolean;
}

export interface IUpdateRequest extends IJsonRpcRequest<IUpdateParams> {
    method: 'update';
}
