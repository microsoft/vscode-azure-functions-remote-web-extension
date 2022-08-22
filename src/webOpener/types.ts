import {
    IProgress,
    IProgressCompositeOptions,
    IProgressDialogOptions,
    IProgressNotificationOptions,
    IProgressOptions,
    IProgressStep,
    IProgressWindowOptions,
    IWelcomeBanner,
    IWorkbenchConstructionOptions,
    IWorkspace,
    LogLevel,
    UriComponents
} from 'vs/workbench/workbench.web.main';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type RunCommand = { command: string; args: any[] };

export interface IPostWorkbenchCreationActions {
    readonly openUri?: UriComponents;
    readonly runCommands?: RunCommand[];
}

export interface IPreWorkbenchDisposalActions {
    readonly runCommands?: RunCommand[];
}

export interface IRouteResult {
    workspace: IWorkspace;
    workbenchOptions?: IWorkbenchConstructionOptions;
    readonly onDidCreateWorkbench: Writeable<IPostWorkbenchCreationActions>;
    readonly onWillDisposeWorkbench?: IPreWorkbenchDisposalActions;
    welcomeBanner?: IWelcomeBanner;
    suppressDefaultRemoteExtensions?: true;
}

export interface IRouterWorkbench {
    commands: {
        executeCommand(command: string, ...args: any[]): Promise<unknown>;
    };
    logger: {
        log(level: LogLevel, message: string): Promise<void>;
    };
    window: {
        withProgress<R>(
            options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
            task: (progress: IProgress<IProgressStep>) => Promise<R>
        ): Promise<R>;
    };
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
