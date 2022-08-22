/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vs/workbench/workbench.web.main' {
    interface UriComponents {
        scheme?: string;
        authority?: string;
        path?: string;
        query?: string;
        fragment?: string;
    }

    class URI implements UriComponents {
        /**
         * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
         * The part before the first colon.
         */
        readonly scheme: string;

        /**
         * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
         * The part between the first double slashes and the next slash.
         */
        readonly authority: string;

        /**
         * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        readonly path: string;

        /**
         * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        readonly query: string;

        /**
         * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        readonly fragment: string;

        /**
		 * Returns a string representing the corresponding file system path of this URI.
		 * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
		 * platform specific path separator.
		 *
		 * * Will *not* validate the path for invalid characters and semantics.
		 * * Will *not* look at the scheme of this URI.
		 * * The result shall *not* be used for display purposes but for accessing a file on disk.
		 *
		 *
		 * The *difference* to `URI#path` is the use of the platform specific separator and the handling
		 * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
		 *
		 * ```ts
				const u = URI.parse('file://server/c$/folder/file.txt')
				u.authority === 'server'
				u.path === '/shares/c$/file.txt'
				u.fsPath === '\\server\c$\folder\file.txt'
			```
			*
			* Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
			* namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
			* with URIs that represent files on disk (`file` scheme).
			*/
        readonly fsPath: string;

        with(change: { scheme?: string; authority?: string | null; path?: string | null; query?: string | null; fragment?: string | null }): URI;

        /**
         * Creates a new URI from a string, e.g. `http://www.msft.com/some/path`,
         * `file:///usr/home`, or `scheme:with/path`.
         *
         * @param value A string which represents an URI (see `URI#toString`).
         */
        static parse(value: string, _strict?: boolean): URI;

        /**
		 * Creates a new URI from a file system path, e.g. `c:\my\files`,
		 * `/usr/home`, or `\\server\share\some\path`.
		 *
		 * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
		 * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
		 * `URI.parse('file://' + path)` because the path might contain characters that are
		 * interpreted (# and ?). See the following sample:
		 * ```ts
			const good = URI.file('/coding/c#/project1');
			good.scheme === 'file';
			good.path === '/coding/c#/project1';
			good.fragment === '';
			const bad = URI.parse('file://' + '/coding/c#/project1');
			bad.scheme === 'file';
			bad.path === '/coding/c'; // path is now broken
			bad.fragment === '/project1';
			```
			*
			* @param path A file system path (see `URI#fsPath`)
			*/
        static file(path: string): URI;

        static from(components: { scheme: string; authority?: string; path?: string; query?: string; fragment?: string }): URI;

        /**
         * Join a URI path with path fragments and normalizes the resulting path.
         *
         * @param uri The input URI.
         * @param pathFragment The path fragment to add to the URI path.
         * @returns The resulting URI.
         */
        static joinPath(uri: URI, ...pathFragment: string[]): URI;

        /**
         * Creates a string representation for this URI. It's guaranteed that calling
         * `URI.parse` with the result of this function creates an URI which is equal
         * to this URI.
         *
         * * The result shall *not* be used for display purposes but for externalization or transport.
         * * The result will be encoded using the percentage encoding and encoding happens mostly
         * ignore the scheme-specific encoding rules.
         *
         * @param skipEncoding Do not encode the result, default is `false`
         */
        toString(skipEncoding?: boolean): string;
        toJSON(): UriComponents;

        static revive(data: UriComponents | URI): URI;
        static revive(data: UriComponents | URI | undefined): URI | undefined;
        static revive(data: UriComponents | URI | null): URI | null;
        static revive(data: UriComponents | URI | undefined | null): URI | undefined | null;
        static revive(data: UriComponents | URI | undefined | null): URI | undefined | null;
    }

    type ExtensionKind = 'ui' | 'workspace' | 'web';
    type ExtensionWorkspaceTrustRequestType = 'never' | 'onStart' | 'onDemand';
    type ExtensionWorkspaceTrust = { request: 'never' } | { request: 'onStart'; description: string } | { request: 'onDemand'; description: string; requiredForConfigurations?: string[] };

    interface IConfigurationProperty {
        description: string;
        type: string | string[];
        default?: any;
    }

    interface IConfiguration {
        properties: { [key: string]: IConfigurationProperty };
    }

    interface IDebugger {
        label?: string;
        type: string;
        runtime?: string;
    }

    interface IGrammar {
        language: string;
    }

    interface IJSONValidation {
        fileMatch: string | string[];
        url: string;
    }

    interface IKeyBinding {
        command: string;
        key: string;
        when?: string;
        mac?: string;
        linux?: string;
        win?: string;
    }

    interface ILanguage {
        id: string;
        extensions: string[];
        aliases: string[];
    }

    interface IMenu {
        command: string;
        alt?: string;
        when?: string;
        group?: string;
    }

    interface ISnippet {
        language: string;
    }

    interface ITheme {
        label: string;
    }

    interface IViewContainer {
        id: string;
        title: string;
    }

    interface IView {
        id: string;
        name: string;
    }

    interface IColor {
        id: string;
        description: string;
        defaults: { light: string; dark: string; highContrast: string };
    }

    interface ITranslation {
        id: string;
        path: string;
    }

    interface ILocalization {
        languageId: string;
        languageName?: string;
        localizedLanguageName?: string;
        translations: ITranslation[];
        minimalTranslations?: { [key: string]: string };
    }

    interface IWebviewEditor {
        readonly viewType: string;
        readonly priority: string;
        readonly selector: readonly {
            readonly filenamePattern?: string;
        }[];
    }

    interface IAction extends IDisposable {
        readonly id: string;
        label: string;
        tooltip: string;
        class: string | undefined;
        enabled: boolean;
        checked?: boolean;
        run(event?: unknown): unknown;
    }

    interface ICodeActionContributionAction {
        readonly kind: string;
        readonly title: string;
        readonly description?: string;
    }

    interface ICodeActionContribution {
        readonly languages: readonly string[];
        readonly actions: readonly ICodeActionContributionAction[];
    }

    interface IAuthenticationContribution {
        readonly id: string;
        readonly label: string;
    }

    interface IWalkthroughTask {
        readonly id: string;
        readonly title: string;
        readonly description: string;
        readonly media: { path: string; altText: string };
        readonly doneOn?: { command: string };
        readonly when?: string;
    }

    interface IWalkthrough {
        readonly id: string;
        readonly title: string;
        readonly description: string;
        readonly tasks: IWalkthroughTask[];
        readonly primary?: boolean;
        readonly when?: string;
    }

    interface IExtensionContributions {
        commands?: ICommand[];
        configuration?: IConfiguration | IConfiguration[];
        debuggers?: IDebugger[];
        grammars?: IGrammar[];
        jsonValidation?: IJSONValidation[];
        keybindings?: IKeyBinding[];
        languages?: ILanguage[];
        menus?: { [context: string]: IMenu[] };
        snippets?: ISnippet[];
        themes?: ITheme[];
        iconThemes?: ITheme[];
        productIconThemes?: ITheme[];
        viewsContainers?: { [location: string]: IViewContainer[] };
        views?: { [location: string]: IView[] };
        colors?: IColor[];
        localizations?: ILocalization[];
        readonly customEditors?: readonly IWebviewEditor[];
        readonly codeActions?: readonly ICodeActionContribution[];
        authentication?: IAuthenticationContribution[];
        walkthroughs?: IWalkthrough[];
    }

    interface IExtensionManifest {
        readonly name: string;
        readonly displayName?: string;
        readonly publisher: string;
        readonly version: string;
        readonly engines: { readonly vscode: string };
        readonly description?: string;
        readonly main?: string;
        readonly browser?: string;
        readonly icon?: string;
        readonly categories?: string[];
        readonly keywords?: string[];
        readonly activationEvents?: string[];
        readonly extensionDependencies?: string[];
        readonly extensionPack?: string[];
        readonly extensionKind?: ExtensionKind | ExtensionKind[];
        readonly contributes?: IExtensionContributions;
        readonly repository?: { url: string };
        readonly bugs?: { url: string };
        readonly enableProposedApi?: boolean;
        readonly api?: string;
        readonly scripts?: { [key: string]: string };
        readonly workspaceTrust?: ExtensionWorkspaceTrust;
    }

    interface TunnelProviderFeatures {
        elevation: boolean;
        public: boolean;
    }

    interface IDisposable {
        dispose(): void;
    }

    abstract class Disposable implements IDisposable {
        static readonly None: IDisposable;
        constructor();
        dispose(): void;
    }

    /**
     * To an event a function with one or zero parameters
     * can be subscribed. The event is the subscriber function itself.
     */
    interface Event<T> {
        (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
    }

    interface EmitterOptions {
        onFirstListenerAdd?: Function;
        onFirstListenerDidAdd?: Function;
        onListenerDidAdd?: Function;
        onLastListenerRemove?: Function;
    }

    class Emitter<T> {
        constructor(options?: EmitterOptions);
        readonly event: Event<T>;
        fire(event: T): void;
        dispose(): void;
    }

    interface IWebSocket {
        readonly onData: Event<ArrayBuffer>;
        readonly onOpen: Event<void>;
        readonly onClose: Event<void>;
        readonly onError: Event<any>;

        send(data: ArrayBuffer | ArrayBufferView): void;
        close(): void;
    }

    interface IWebSocketFactory {
        create(url: string): IWebSocket;
    }

    /**
     * A workspace to open in the workbench can either be:
     * - a workspace file with 0-N folders (via `workspaceUri`)
     * - a single folder (via `folderUri`)
     * - empty (via `undefined`)
     */
    type IWorkspace = { workspaceUri: URI } | { folderUri: URI } | undefined;

    interface IWorkspaceProvider {
        /**
         * The initial workspace to open.
         */
        readonly workspace: IWorkspace;

        /**
         * Arbitrary payload from the `IWorkspaceProvider.open` call.
         */
        readonly payload?: object;

        /**
         * Return `true` if the provided [workspace](#IWorkspaceProvider.workspace) is trusted, `false` if not trusted, `undefined` if unknown.
         */
        readonly trusted: boolean | undefined;

        /**
         * Asks to open a workspace in the current or a new window.
         *
         * @param workspace the workspace to open.
         * @param options optional options for the workspace to open.
         * - `reuse`: whether to open inside the current window or a new window
         * - `payload`: arbitrary payload that should be made available
         * to the opening window via the `IWorkspaceProvider.payload` property.
         * @param payload optional payload to send to the workspace to open.
         */
        open(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<boolean>;
    }

    const enum FileSystemProviderCapabilities {
        /**
         * Provider supports unbuffered read/write.
         */
        FileReadWrite = 1 << 1,

        /**
         * Provider supports open/read/write/close low level file operations.
         */
        FileOpenReadWriteClose = 1 << 2,

        /**
         * Provider supports stream based reading.
         */
        FileReadStream = 1 << 4,

        /**
         * Provider supports copy operation.
         */
        FileFolderCopy = 1 << 3,

        /**
         * Provider is path case sensitive.
         */
        PathCaseSensitive = 1 << 10,

        /**
         * All files of the provider are readonly.
         */
        Readonly = 1 << 11,

        /**
         * Provider supports to delete via trash.
         */
        Trash = 1 << 12,

        /**
         * Provider support to unlock files for writing.
         */
        FileWriteUnlock = 1 << 13
    }

    /**
     * Possible changes that can occur to a file.
     */
    const enum FileChangeType {
        UPDATED,
        ADDED,
        DELETED
    }

    /**
     * Identifies a single change in a file.
     */
    interface IFileChange {
        /**
         * The type of change that occurred to the file.
         */
        readonly type: FileChangeType;

        /**
         * The unified resource identifier of the file that changed.
         */
        readonly resource: URI;
    }

    interface IWatchOptions {
        /**
         * Set to `true` to watch for changes recursively in a folder
         * and all of its children.
         */
        recursive: boolean;

        /**
         * A set of paths to exclude from watching.
         */
        excludes: string[];
    }

    enum FileType {
        /**
         * File is unknown (neither file, directory nor symbolic link).
         */
        Unknown = 0,

        /**
         * File is a normal file.
         */
        File = 1,

        /**
         * File is a directory.
         */
        Directory = 2,

        /**
         * File is a symbolic link.
         *
         * Note: even when the file is a symbolic link, you can test for
         * `FileType.File` and `FileType.Directory` to know the type of
         * the target the link points to.
         */
        SymbolicLink = 64
    }

    interface IStat {
        /**
         * The file type.
         */
        type: FileType;

        /**
         * The last modification date represented as millis from unix epoch.
         */
        mtime: number;

        /**
         * The creation date represented as millis from unix epoch.
         */
        ctime: number;

        /**
         * The size of the file in bytes.
         */
        size: number;
    }

    interface FileOverwriteOptions {
        /**
         * Set to `true` to overwrite a file if it exists. Will
         * throw an error otherwise if the file does exist.
         */
        overwrite: boolean;
    }

    interface FileUnlockOptions {
        /**
         * Set to `true` to try to remove any write locks the file might
         * have. A file that is write locked will throw an error for any
         * attempt to write to unless `unlock: true` is provided.
         */
        unlock: boolean;
    }

    interface FileReadStreamOptions {
        /**
         * Is an integer specifying where to begin reading from in the file. If position is undefined,
         * data will be read from the current file position.
         */
        readonly position?: number;

        /**
         * Is an integer specifying how many bytes to read from the file. By default, all bytes
         * will be read.
         */
        readonly length?: number;

        /**
         * If provided, the size of the file will be checked against the limits.
         */
        limits?: {
            readonly size?: number;
            readonly memory?: number;
        };
    }

    interface FileWriteOptions extends FileOverwriteOptions, FileUnlockOptions {
        /**
         * Set to `true` to create a file when it does not exist. Will
         * throw an error otherwise if the file does not exist.
         */
        create: boolean;
    }

    type FileOpenOptions = FileOpenForReadOptions | FileOpenForWriteOptions;

    function isFileOpenForWriteOptions(options: FileOpenOptions): options is FileOpenForWriteOptions;

    interface FileOpenForReadOptions {
        /**
         * A hint that the file should be opened for reading only.
         */
        create: false;
    }

    interface FileOpenForWriteOptions extends FileUnlockOptions {
        /**
         * A hint that the file should be opened for reading and writing.
         */
        create: true;
    }

    interface FileDeleteOptions {
        /**
         * Set to `true` to recursively delete any children of the file. This
         * only applies to folders and can lead to an error unless provided
         * if the folder is not empty.
         */
        recursive: boolean;

        /**
         * Set to `true` to attempt to move the file to trash
         * instead of deleting it permanently from disk. This
         * option maybe not be supported on all providers.
         */
        useTrash: boolean;
    }

    interface CancellationToken {
        /**
         * A flag signalling is cancellation has been requested.
         */
        readonly isCancellationRequested: boolean;

        /**
         * An event which fires when cancellation is requested. This event
         * only ever fires `once` as cancellation can only happen once. Listeners
         * that are registered after cancellation will be called (next event loop run),
         * but also only once.
         *
         * @event
         */
        readonly onCancellationRequested: (listener: (e: any) => any, thisArgs?: any, disposables?: IDisposable[]) => IDisposable;
    }

    namespace CancellationToken {
        function isCancellationToken(thing: unknown): thing is CancellationToken;
        const None: CancellationToken;
        const Cancelled: CancellationToken;
    }

    interface ReadableStreamEvents<T> {
        /**
         * The 'data' event is emitted whenever the stream is
         * relinquishing ownership of a chunk of data to a consumer.
         *
         * NOTE: PLEASE UNDERSTAND THAT ADDING A DATA LISTENER CAN
         * TURN THE STREAM INTO FLOWING MODE. IT IS THEREFOR THE
         * LAST LISTENER THAT SHOULD BE ADDED AND NOT THE FIRST
         *
         * Use `listenStream` as a helper method to listen to
         * stream events in the right order.
         */
        on(event: 'data', callback: (data: T) => void): void;

        /**
         * Emitted when any error occurs.
         */
        on(event: 'error', callback: (err: Error) => void): void;

        /**
         * The 'end' event is emitted when there is no more data
         * to be consumed from the stream. The 'end' event will
         * not be emitted unless the data is completely consumed.
         */
        on(event: 'end', callback: () => void): void;
    }

    interface IFileSystemProvider {
        readonly capabilities: FileSystemProviderCapabilities;
        readonly onDidChangeCapabilities: Event<void>;

        readonly onDidErrorOccur?: Event<string>; // TODO@bpasero remove once file watchers are solid

        readonly onDidChangeFile: Event<readonly IFileChange[]>;
        watch(resource: URI, opts: IWatchOptions): IDisposable;

        stat(resource: URI): Promise<IStat>;
        mkdir(resource: URI): Promise<void>;
        readdir(resource: URI): Promise<[string, FileType][]>;
        delete(resource: URI, opts: FileDeleteOptions): Promise<void>;

        rename(from: URI, to: URI, opts: FileOverwriteOptions): Promise<void>;
        copy?(from: URI, to: URI, opts: FileOverwriteOptions): Promise<void>;

        readFile?(resource: URI): Promise<Uint8Array>;
        writeFile?(resource: URI, content: Uint8Array, opts: FileWriteOptions): Promise<void>;

        readFileStream?(resource: URI, opts: FileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array>;

        open?(resource: URI, opts: FileOpenOptions): Promise<number>;
        close?(fd: number): Promise<void>;
        read?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
        write?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
    }

    interface ICredentialsProvider {
        getPassword(service: string, account: string): Promise<string | null>;
        setPassword(service: string, account: string, password: string): Promise<void>;
        deletePassword(service: string, account: string): Promise<boolean>;
        findPassword(service: string): Promise<string | null>;
        findCredentials(service: string): Promise<Array<{ account: string; password: string }>>;
        clear?(): Promise<void>;
    }

    interface IURLCallbackProvider {
        /**
         * Indicates that a Uri has been opened outside of VSCode. The Uri
         * will be forwarded to all installed Uri handlers in the system.
         */
        readonly onCallback: Event<URI>;

        /**
         * Creates a Uri that - if opened in a browser - must result in
         * the `onCallback` to fire.
         *
         * The optional `Partial<UriComponents>` must be properly restored for
         * the Uri passed to the `onCallback` handler.
         *
         * For example: if a Uri is to be created with `scheme:"vscode"`,
         * `authority:"foo"` and `path:"bar"` the `onCallback` should fire
         * with a Uri `vscode://foo/bar`.
         *
         * If there are additional `query` values in the Uri, they should
         * be added to the list of provided `query` arguments from the
         * `Partial<UriComponents>`.
         */
        create(options?: Partial<UriComponents>): URI;
    }

    interface IUpdate {
        version: string;
    }

    interface IUpdateProvider {
        /**
         * Should return with the `IUpdate` object if an update is
         * available or `null` otherwise to signal that there are
         * no updates.
         */
        checkForUpdate(): Promise<IUpdate | null>;
    }

    interface IBuiltInExtension {
        readonly name: string;
        readonly version: string;
        readonly repo: string;
        readonly metadata: any;
    }

    type ImportantExtensionTip = {
        name: string;
        languages?: string[];
        pattern?: string;
        isExtensionPack?: boolean;
    };

    interface IConfigBasedExtensionTip {
        configPath: string;
        configName: string;
        recommendations: Record<
            string,
            {
                name: string;
                remotes?: string[];
                important?: boolean;
                isExtensionPack?: boolean;
            }
        >;
    }

    interface IExeBasedExtensionTip {
        friendlyName: string;
        windowsPath?: string;
        important?: boolean;
        recommendations: Record<string, { name: string; important?: boolean; isExtensionPack?: boolean }>;
    }

    interface IRemoteExtensionTip {
        friendlyName: string;
        extensionId: string;
    }

    interface ISurveyData {
        surveyId: string;
        surveyUrl: string;
        languageId: string;
        editCount: number;
        userProbability: number;
    }

    interface IAppCenterConfiguration {
        readonly 'win32-ia32': string;
        readonly 'win32-x64': string;
        readonly 'linux-x64': string;
        readonly darwin: string;
    }

    type ExtensionWorkspaceTrustRequest = {
        readonly default?: 'never' | 'onStart' | 'onDemand';
        readonly override?: 'never' | 'onStart' | 'onDemand';
    };

    type ConfigurationSyncStore = {
        url: string;
        insidersUrl: string;
        stableUrl: string;
        canSwitch: boolean;
        authenticationProviders: Record<string, { scopes: string[] }>;
    };

    interface IProductConfiguration {
        readonly version: string;
        readonly date?: string;
        readonly quality?: string;
        readonly commit?: string;

        readonly nameShort: string;
        readonly nameLong: string;

        readonly win32AppUserModelId?: string;
        readonly win32MutexName?: string;
        readonly applicationName: string;
        readonly embedderIdentifier?: string;

        readonly urlProtocol: string;
        readonly dataFolderName: string; // location for extensions (e.g. ~/.vscode-insiders)

        readonly builtInExtensions?: IBuiltInExtension[];

        readonly downloadUrl?: string;
        readonly updateUrl?: string;
        readonly webEndpointUrl?: string;
        readonly target?: string;

        readonly settingsSearchBuildId?: number;
        readonly settingsSearchUrl?: string;

        readonly tasConfig?: {
            endpoint: string;
            telemetryEventName: string;
            featuresTelemetryPropertyName: string;
            assignmentContextTelemetryPropertyName: string;
        };

        readonly experimentsUrl?: string;

        readonly extensionsGallery?: {
            readonly serviceUrl: string;
            readonly cacheUrl: string;
            readonly itemUrl: string;
            readonly resourceUrlTemplate: string;
            readonly controlUrl: string;
            readonly recommendationsUrl: string;
        };

        readonly extensionTips?: { [id: string]: string };
        readonly extensionImportantTips?: Record<string, ImportantExtensionTip>;
        readonly configBasedExtensionTips?: { [id: string]: IConfigBasedExtensionTip };
        readonly exeBasedExtensionTips?: { [id: string]: IExeBasedExtensionTip };
        readonly remoteExtensionTips?: { [remoteName: string]: IRemoteExtensionTip };
        readonly extensionKeywords?: { [extension: string]: readonly string[] };
        readonly keymapExtensionTips?: readonly string[];
        readonly trustedExtensionUrlPublicKeys?: { [id: string]: string[] };

        readonly crashReporter?: {
            readonly companyName: string;
            readonly productName: string;
        };

        readonly enableTelemetry?: boolean;
        readonly aiConfig?: {
            readonly asimovKey: string;
        };

        readonly sendASmile?: {
            readonly reportIssueUrl: string;
            readonly requestFeatureUrl: string;
        };

        readonly documentationUrl?: string;
        readonly releaseNotesUrl?: string;
        readonly keyboardShortcutsUrlMac?: string;
        readonly keyboardShortcutsUrlLinux?: string;
        readonly keyboardShortcutsUrlWin?: string;
        readonly introductoryVideosUrl?: string;
        readonly tipsAndTricksUrl?: string;
        readonly newsletterSignupUrl?: string;
        readonly twitterUrl?: string;
        readonly requestFeatureUrl?: string;
        readonly reportIssueUrl?: string;
        readonly reportMarketplaceIssueUrl?: string;
        readonly licenseUrl?: string;
        readonly privacyStatementUrl?: string;
        readonly telemetryOptOutUrl?: string;

        readonly openToWelcomeMainPage?: boolean;

        readonly npsSurveyUrl?: string;
        readonly cesSurveyUrl?: string;
        readonly surveys?: readonly ISurveyData[];

        readonly checksums?: { [path: string]: string };
        readonly checksumFailMoreInfoUrl?: string;

        readonly appCenter?: IAppCenterConfiguration;

        readonly portable?: string;

        readonly extensionKind?: { readonly [extensionId: string]: ('ui' | 'workspace' | 'web')[] };
        readonly extensionSyncedKeys?: { readonly [extensionId: string]: string[] };
        readonly extensionAllowedProposedApi?: readonly string[];
        readonly extensionEnabledApiProposals?: { readonly [extensionId: string]: string[] };
        readonly extensionWorkspaceTrustRequest?: { readonly [extensionId: string]: ExtensionWorkspaceTrustRequest };

        readonly msftInternalDomains?: string[];
        readonly linkProtectionTrustedDomains?: readonly string[];

        readonly 'configurationSync.store'?: ConfigurationSyncStore;

        readonly darwinUniversalAssetId?: string;
    }

    const enum LogLevel {
        Trace,
        Debug,
        Info,
        Warning,
        Error,
        Critical,
        Off
    }

    interface IResourceUriProvider {
        (uri: URI): URI;
    }

    interface IStaticExtension {
        packageJSON: IExtensionManifest;
        extensionLocation: URI;
        isBuiltin?: boolean;
    }

    /**
     * The identifier of an extension in the format: `PUBLISHER.NAME`.
     * For example: `vscode.csharp`
     */
    type ExtensionId = string;

    type MarketplaceExtension = ExtensionId | { readonly id: ExtensionId; preRelease?: boolean };

    interface ICommonTelemetryPropertiesResolver {
        (): { [key: string]: any };
    }
    interface IExternalUriResolver {
        (uri: URI): Promise<URI>;
    }

    /**
     * External URL opener
     */
    interface IExternalURLOpener {
        /**
         * Overrides the behavior when an external URL is about to be opened.
         * Returning false means that the URL wasn't handled, and the default
         * handling behavior should be used: `window.open(href, '_blank', 'noopener');`
         *
         * @returns true if URL was handled, false otherwise.
         */
        openExternal(href: string): boolean | Promise<boolean>;
    }

    interface ITunnelProvider {
        /**
         * Support for creating tunnels.
         */
        tunnelFactory?: ITunnelFactory;

        /**
         * Support for filtering candidate ports.
         */
        showPortCandidate?: IShowPortCandidate;

        /**
         * The features that the tunnel provider supports.
         */
        features?: TunnelProviderFeatures;
    }

    interface ITunnelFactory {
        (tunnelOptions: ITunnelOptions, tunnelCreationOptions: TunnelCreationOptions): Promise<ITunnel> | undefined;
    }

    interface ITunnelOptions {
        remoteAddress: { port: number; host: string };

        /**
         * The desired local port. If this port can't be used, then another will be chosen.
         */
        localAddressPort?: number;

        label?: string;

        public?: boolean;
    }

    interface TunnelCreationOptions {
        /**
         * True when the local operating system will require elevation to use the requested local port.
         */
        elevationRequired?: boolean;
    }

    interface ITunnel {
        remoteAddress: { port: number; host: string };

        /**
         * The complete local address(ex. localhost:1234)
         */
        localAddress: string;

        public?: boolean;

        /**
         * Implementers of Tunnel should fire onDidDispose when dispose is called.
         */
        onDidDispose: Event<void>;

        dispose(): Promise<void> | void;
    }

    interface IShowPortCandidate {
        (host: string, port: number, detail: string): Promise<boolean>;
    }

    enum Menu {
        CommandPalette,
        StatusBarWindowIndicatorMenu
    }

    interface ICommand {
        /**
         * An identifier for the command. Commands can be executed from extensions
         * using the `vscode.commands.executeCommand` API using that command ID.
         */
        id: string;

        /**
         * The optional label of the command. If provided, the command will appear
         * in the command palette.
         */
        label?: string;

        /**
         * The optional menus to append this command to. Only valid if `label` is
         * provided as well.
         * @default Menu.CommandPalette
         */
        menu?: Menu | Menu[];

        /**
         * A function that is being executed with any arguments passed over. The
         * return type will be send back to the caller.
         *
         * Note: arguments and return type should be serializable so that they can
         * be exchanged across processes boundaries.
         */
        handler: (...args: any[]) => unknown;
    }

    interface IHomeIndicator {
        /**
         * The link to open when clicking the home indicator.
         */
        href: string;

        /**
         * The icon name for the home indicator. This needs to be one of the existing
         * icons from our Codicon icon set. For example `sync`.
         */
        icon: string;

        /**
         * A tooltip that will appear while hovering over the home indicator.
         */
        title: string;
    }

    interface IWelcomeBanner {
        /**
         * Welcome banner message to appear as text.
         */
        message: string;

        /**
         * Optional icon for the banner. This needs to be one of the existing
         * icons from our Codicon icon set. For example `code`. If not provided,
         * a default icon will be used.
         */
        icon?: string;

        /**
         * Optional actions to appear as links after the welcome banner message.
         */
        actions?: IWelcomeBannerAction[];
    }

    interface IWelcomeBannerAction {
        /**
         * The link to open when clicking. Supports command invocation when
         * using the `command:<commandId>` value.
         */
        href: string;

        /**
         * The label to show for the action link.
         */
        label: string;

        /**
         * A tooltip that will appear while hovering over the action link.
         */
        title?: string;
    }

    interface IWindowIndicator {
        /**
         * Triggering this event will cause the window indicator to update.
         */
        onDidChange: Event<void>;

        /**
         * Label of the window indicator may include octicons
         * e.g. `$(remote) label`
         */
        label: string;

        /**
         * Tooltip of the window indicator should not include
         * octicons and be descriptive.
         */
        tooltip: string;

        /**
         * If provided, overrides the default command that
         * is executed when clicking on the window indicator.
         */
        command?: string;
    }

    enum ColorScheme {
        DARK = 'dark',
        LIGHT = 'light',
        HIGH_CONTRAST = 'hc'
    }

    interface IInitialColorTheme {
        /**
         * Initial color theme type.
         */
        themeType: ColorScheme;

        /**
         * A list of workbench colors to apply initially.
         */
        colors?: { [colorId: string]: string };
    }

    interface IDevelopmentOptions {
        /**
         * Current logging level. Default is `LogLevel.Info`.
         */
        readonly logLevel?: LogLevel;

        /**
         * Location of a module containing extension tests to run once the workbench is open.
         */
        readonly extensionTestsPath?: UriComponents;

        /**
         * Add extensions under development.
         */
        readonly extensions?: readonly UriComponents[];

        /**
         * Whether to enable the smoke test driver.
         */
        readonly enableSmokeTestDriver?: boolean;
    }

    interface IDefaultView {
        readonly id: string;
    }

    interface IPosition {
        readonly line: number;
        readonly column: number;
    }

    interface IRange {
        /**
         * The start position. It is before or equal to end position.
         */
        readonly start: IPosition;

        /**
         * The end position. It is after or equal to start position.
         */
        readonly end: IPosition;
    }

    enum EditorActivation {
        /**
         * Activate the editor after it opened. This will automatically restore
         * the editor if it is minimized.
         */
        ACTIVATE = 1,

        /**
         * Only restore the editor if it is minimized but do not activate it.
         *
         * Note: will only work in combination with the `preserveFocus: true` option.
         * Otherwise, if focus moves into the editor, it will activate and restore
         * automatically.
         */
        RESTORE,

        /**
         * Preserve the current active editor.
         *
         * Note: will only work in combination with the `preserveFocus: true` option.
         * Otherwise, if focus moves into the editor, it will activate and restore
         * automatically.
         */
        PRESERVE
    }

    enum EditorResolution {
        /**
         * Displays a picker and allows the user to decide which editor to use.
         */
        PICK,

        /**
         * Disables editor resolving.
         */
        DISABLED,

        /**
         * Only exclusive editors are considered.
         */
        EXCLUSIVE_ONLY
    }

    enum EditorOpenSource {
        /**
         * Default: the editor is opening via a programmatic call
         * to the editor service API.
         */
        API,

        /**
         * Indicates that a user action triggered the opening, e.g.
         * via mouse or keyboard use.
         */
        USER
    }

    interface IEditorOptions {
        /**
         * Tells the editor to not receive keyboard focus when the editor is being opened.
         *
         * Will also not activate the group the editor opens in unless the group is already
         * the active one. This behaviour can be overridden via the `activation` option.
         */
        preserveFocus?: boolean;

        /**
         * This option is only relevant if an editor is opened into a group that is not active
         * already and allows to control if the inactive group should become active, restored
         * or preserved.
         *
         * By default, the editor group will become active unless `preserveFocus` or `inactive`
         * is specified.
         */
        activation?: EditorActivation;

        /**
         * Tells the editor to reload the editor input in the editor even if it is identical to the one
         * already showing. By default, the editor will not reload the input if it is identical to the
         * one showing.
         */
        forceReload?: boolean;

        /**
         * Will reveal the editor if it is already opened and visible in any of the opened editor groups.
         *
         * Note that this option is just a hint that might be ignored if the user wants to open an editor explicitly
         * to the side of another one or into a specific editor group.
         */
        revealIfVisible?: boolean;

        /**
         * Will reveal the editor if it is already opened (even when not visible) in any of the opened editor groups.
         *
         * Note that this option is just a hint that might be ignored if the user wants to open an editor explicitly
         * to the side of another one or into a specific editor group.
         */
        revealIfOpened?: boolean;

        /**
         * An editor that is pinned remains in the editor stack even when another editor is being opened.
         * An editor that is not pinned will always get replaced by another editor that is not pinned.
         */
        pinned?: boolean;

        /**
         * An editor that is sticky moves to the beginning of the editors list within the group and will remain
         * there unless explicitly closed. Operations such as "Close All" will not close sticky editors.
         */
        sticky?: boolean;

        /**
         * The index in the document stack where to insert the editor into when opening.
         */
        index?: number;

        /**
         * An active editor that is opened will show its contents directly. Set to true to open an editor
         * in the background without loading its contents.
         *
         * Will also not activate the group the editor opens in unless the group is already
         * the active one. This behaviour can be overridden via the `activation` option.
         */
        inactive?: boolean;

        /**
         * Will not show an error in case opening the editor fails and thus allows to show a custom error
         * message as needed. By default, an error will be presented as notification if opening was not possible.
         */

        /**
         * In case of an error opening the editor, will not present this error to the user (e.g. by showing
         * a generic placeholder in the editor area). So it is up to the caller to provide error information
         * in that case.
         *
         * By default, an error when opening an editor will result in a placeholder editor that shows the error.
         * In certain cases a modal dialog may be presented to ask the user for further action.
         */
        ignoreError?: boolean;

        /**
         * Allows to override the editor that should be used to display the input:
         * - `undefined`: let the editor decide for itself
         * - `string`: specific override by id
         * - `EditorResolution`: specific override handling
         */
        override?: string | EditorResolution;

        /**
         * A optional hint to signal in which context the editor opens.
         *
         * If configured to be `EditorOpenSource.USER`, this hint can be
         * used in various places to control the experience. For example,
         * if the editor to open fails with an error, a notification could
         * inform about this in a modal dialog. If the editor opened through
         * some background task, the notification would show in the background,
         * not as a modal dialog.
         */
        source?: EditorOpenSource;

        /**
         * An optional property to signal that certain view state should be
         * applied when opening the editor.
         */
        viewState?: object;
    }

    interface IDefaultEditor {
        readonly uri: UriComponents;
        readonly selection?: IRange;
        readonly openOnlyIfExists?: boolean;
        /**
         * @deprecated use `options.override` instead
         */
        readonly openWith?: string;
        readonly options?: IEditorOptions;
    }

    interface IDefaultLayout {
        readonly views?: IDefaultView[];
        readonly editors?: IDefaultEditor[];
        /** Forces this layout to be applied even if this isn't the first time the workspace has been opened */
        readonly force?: boolean;
    }

    interface IProductQualityChangeHandler {
        /**
         * Handler is being called when the user wants to switch between
         * `insider` or `stable` product qualities.
         */
        (newQuality: 'insider' | 'stable'): void;
    }

    /**
     * Settings sync options
     */
    interface ISettingsSyncOptions {
        /**
         * Is settings sync enabled
         */
        readonly enabled: boolean;

        /**
         * Version of extensions sync state.
         * Extensions sync state will be reset if version is provided and different from previous version.
         */
        readonly extensionsSyncStateVersion?: string;

        /**
         * Handler is being called when the user changes Settings Sync enablement.
         */
        enablementHandler?(enablement: boolean): void;
    }

    interface IWorkbenchConstructionOptions {
        //#region Connection related configuration

        /**
         * The remote authority is the IP:PORT from where the workbench is served
         * from. It is for example being used for the websocket connections as address.
         */
        readonly remoteAuthority?: string;

        /**
         * The connection token to send to the server.
         */
        readonly connectionToken?: string;

        /**
         * An endpoint to serve iframe content ("webview") from. This is required
         * to provide full security isolation from the workbench host.
         */
        readonly webviewEndpoint?: string;

        /**
         * An URL pointing to the web worker extension host <iframe> src.
         */
        readonly webWorkerExtensionHostIframeSrc?: string;

        /**
         * A factory for web sockets.
         */
        readonly webSocketFactory?: IWebSocketFactory;

        /**
         * A provider for resource URIs.
         */
        readonly resourceUriProvider?: IResourceUriProvider;

        /**
         * Resolves an external uri before it is opened.
         */
        readonly resolveExternalUri?: IExternalUriResolver;

        /**
         * Support for URL callbacks.
         */
        readonly externalURLOpener?: IExternalURLOpener;

        /**
         * A provider for supplying tunneling functionality,
         * such as creating tunnels and showing candidate ports to forward.
         */
        readonly tunnelProvider?: ITunnelProvider;

        /**
         * Endpoints to be used for proxying authentication code exchange calls in the browser.
         */
        readonly codeExchangeProxyEndpoints?: { [providerId: string]: string };

        /**
         * [TEMPORARY]: This will be removed soon.
         * Endpoints to be used for proxying repository tarball download calls in the browser.
         */
        readonly _tarballProxyEndpoints?: { [providerId: string]: string };

        //#endregion

        //#region Workbench configuration

        /**
         * A handler for opening workspaces and providing the initial workspace.
         */
        readonly workspaceProvider?: IWorkspaceProvider;

        /**
         * Enables Settings Sync by default.
         *
         * Syncs with the current authenticated user account (provided in [credentialsProvider](#credentialsProvider)) by default.
         *
         * @deprecated Instead use [settingsSyncOptions](#settingsSyncOptions) to enable/disable settings sync in the workbench.
         */
        readonly enableSyncByDefault?: boolean;

        /**
         * Settings sync options
         */
        readonly settingsSyncOptions?: ISettingsSyncOptions;

        /**
         * The credentials provider to store and retrieve secrets.
         */
        readonly credentialsProvider?: ICredentialsProvider;

        /**
         * Add static extensions that cannot be uninstalled but only be disabled.
         */
        readonly staticExtensions?: ReadonlyArray<IStaticExtension>;

        /**
         * Additional builtin extensions those cannot be uninstalled but only be disabled.
         * It can be one of the following:
         * 	- an extension in the Marketplace
         * 	- location of the extension where it is hosted.
         */
        readonly additionalBuiltinExtensions?: readonly (MarketplaceExtension | UriComponents)[];

        /**
         * List of extensions to be enabled.
         */
        readonly enabledExtensions?: readonly ExtensionId[];

        /**
         * [TEMPORARY]: This will be removed soon.
         * Enable inlined extensions.
         * Defaults to false on serverful and true on serverless.
         */
        readonly _enableBuiltinExtensions?: boolean;

        /**
         * Additional domains allowed to open from the workbench without the
         * link protection popup.
         */
        readonly additionalTrustedDomains?: string[];

        /**
         * Enable workspace trust feature for the current window
         */
        readonly enableWorkspaceTrust?: boolean;

        /**
         * Urls that will be opened externally that are allowed access
         * to the opener window. This is primarily used to allow
         * `window.close()` to be called from the newly opened window.
         */
        readonly openerAllowedExternalUrlPrefixes?: string[];

        /**
         * Allows the workbench to skip checking whether an extension was built for the web
         * and assumes they are addressable via the `Microsoft.VisualStudio.Code.WebResources`
         * asset URI.
         */
        readonly assumeGalleryExtensionsAreAddressable?: boolean;

        /**
         * Support for URL callbacks.
         */
        readonly urlCallbackProvider?: IURLCallbackProvider;

        /**
         * Support adding additional properties to telemetry.
         */
        readonly resolveCommonTelemetryProperties?: ICommonTelemetryPropertiesResolver;

        /**
         * A set of optional commands that should be registered with the commands
         * registry.
         *
         * Note: commands can be called from extensions if the identifier is known!
         */
        readonly commands?: readonly ICommand[];

        /**
         * Optional default layout to apply on first time the workspace is opened (uness `force` is specified).
         */
        readonly defaultLayout?: IDefaultLayout;

        /**
         * Optional configuration default overrides contributed to the workbench.
         */
        readonly configurationDefaults?: Record<string, any>;

        //#endregion

        //#region Update/Quality related

        /**
         * Support for update reporting
         */
        readonly updateProvider?: IUpdateProvider;

        /**
         * Support for product quality switching
         */
        readonly productQualityChangeHandler?: IProductQualityChangeHandler;

        //#endregion

        //#region Branding

        /**
         * Optional home indicator to appear above the hamburger menu in the activity bar.
         */
        readonly homeIndicator?: IHomeIndicator;

        /**
         * Optional override for the product configuration properties.
         */
        readonly productConfiguration?: Partial<IProductConfiguration>;

        /**
         * Optional welcome banner to appear above the workbench. Can be dismissed by the
         * user.
         */
        readonly welcomeBanner?: IWelcomeBanner;

        /**
         * Optional override for properties of the window indicator in the status bar.
         */
        readonly windowIndicator?: IWindowIndicator;

        /**
         * Specifies the default theme type (LIGHT, DARK..) and allows to provide initial colors that are shown
         * until the color theme that is specified in the settings (`editor.colorTheme`) is loaded and applied.
         * Once there are persisted colors from a last run these will be used.
         *
         * The idea is that the colors match the main colors from the theme defined in the `configurationDefaults`.
         */
        readonly initialColorTheme?: IInitialColorTheme;

        //#endregion

        //#region IPC

        readonly messagePorts?: ReadonlyMap<ExtensionId, MessagePort>;

        //#endregion

        //#region Development options

        readonly developmentOptions?: IDevelopmentOptions;

        //#endregion

        readonly __uniqueWebWorkerExtensionHostOrigin?: boolean;
    }

    interface IPerformanceMark {
        /**
         * The name of a performace marker.
         */
        readonly name: string;

        /**
         * The UNIX timestamp at which the marker has been set.
         */
        readonly startTime: number;
    }

    interface IObservableValue<T> {
        onDidChange: Event<T>;
        readonly value: T;
    }

    const enum TelemetryLevel {
        NONE = 0,
        CRASH = 1,
        ERROR = 2,
        USAGE = 3
    }

    const enum ProgressLocation {
        Explorer = 1,
        Scm = 3,
        Extensions = 5,
        Window = 10,
        Notification = 15,
        Dialog = 20
    }

    interface IProgressOptions {
        readonly location: ProgressLocation | string;
        readonly title?: string;
        readonly source?: string | { label: string; id: string };
        readonly total?: number;
        readonly buttons?: string[];
    }

    interface IProgressNotificationOptions extends IProgressOptions {
        readonly location: ProgressLocation.Notification;
        readonly primaryActions?: readonly IAction[];
        readonly secondaryActions?: readonly IAction[];
        readonly delay?: number;
        readonly silent?: boolean;
    }

    interface IProgressDialogOptions extends IProgressOptions {
        readonly delay?: number;
        readonly detail?: string;
        readonly sticky?: boolean;
    }

    interface IProgressWindowOptions extends IProgressOptions {
        readonly location: ProgressLocation.Window;
        readonly command?: string;
    }

    interface IProgressCompositeOptions extends IProgressOptions {
        readonly location: ProgressLocation.Explorer | ProgressLocation.Extensions | ProgressLocation.Scm | string;
        readonly delay?: number;
    }

    interface IProgressStep {
        message?: string;
        increment?: number;
        total?: number;
    }

    interface IProgress<T> {
        report(item: T): void;
    }

    interface IWorkbench {
        commands: {
            /**
             * Allows to execute any command if known with the provided arguments.
             *
             * @param command Identifier of the command to execute.
             * @param rest Parameters passed to the command function.
             * @return A promise that resolves to the returned value of the given command.
             */
            executeCommand(command: string, ...args: any[]): Promise<unknown>;
        };

        logger: {
            /**
             * Record log messages to be displayed in `Log (vscode.dev)`
             *
             * @param level The log level of the message to be printed.
             * @param message The log to be printed.
             */
            log(level: LogLevel, message: string): Promise<void>;
        };

        env: {
            /**
             * @returns the scheme to use for opening the associated desktop
             * experience via protocol handler.
             */
            readonly uriScheme: string;

            /**
             * Retrieve performance marks that have been collected during startup. This function
             * returns tuples of source and marks. A source is a dedicated context, like
             * the renderer or an extension host.
             *
             * *Note* that marks can be collected on different machines and in different processes
             * and that therefore "different clocks" are used. So, comparing `startTime`-properties
             * across contexts should be taken with a grain of salt.
             *
             * @returns A promise that resolves to tuples of source and marks.
             */
            retrievePerformanceMarks(): Promise<[string, readonly PerformanceMark[]][]>;

            /**
             * Allows to open a `URI` with the standard opener service of the
             * workbench.
             */
            openUri(target: URI): Promise<boolean>;
        };

        telemetry: {
            readonly telemetryLevel: IObservableValue<TelemetryLevel>;
        };

        window: {
            /**
             * Show progress in the editor. Progress is shown while running the given callback
             * and while the promise it returned isn't resolved nor rejected.
             *
             * @param task A callback returning a promise.
             * @return A promise that resolves to the returned value of the given task result.
             */
            withProgress<R>(
                options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
                task: (progress: IProgress<IProgressStep>) => Promise<R>
            ): Promise<R>;
        };

        /**
         * Triggers shutdown of the workbench programmatically. After this method is
         * called, the workbench is not usable anymore and the page needs to reload
         * or closed.
         *
         * This will also remove any `beforeUnload` handlers that would bring up a
         * confirmation dialog.
         *
         * The returned promise should be awaited on to ensure any data to persist
         * has been persisted.
         */
        shutdown: () => Promise<void>;
    }

    /**
     * Creates the workbench with the provided options in the provided container.
     *
     * @param domElement the container to create the workbench in
     * @param options for setting up the workbench
     */
    function create(domElement: any, options: IWorkbenchConstructionOptions): IDisposable;

    //#region API Facade

    namespace commands {
        /**
         * Allows to execute any command if known with the provided arguments.
         *
         * @param command Identifier of the command to execute.
         * @param rest Parameters passed to the command function.
         * @return A promise that resolves to the returned value of the given command.
         */
        function executeCommand(command: string, ...args: any[]): Promise<unknown>;
    }

    namespace logger {
        /**
         * Record log messages to be displayed in `Log (vscode.dev)`
         *
         * @param level The log level of the message to be printed.
         * @param message The log to be printed.
         */
        function log(level: LogLevel, message: string): Promise<void>;
    }

    namespace env {
        /**
         * Retrieve performance marks that have been collected during startup. This function
         * returns tuples of source and marks. A source is a dedicated context, like
         * the renderer or an extension host.
         *
         * *Note* that marks can be collected on different machines and in different processes
         * and that therefore "different clocks" are used. So, comparing `startTime`-properties
         * across contexts should be taken with a grain of salt.
         *
         * @returns A promise that resolves to tuples of source and marks.
         */
        function retrievePerformanceMarks(): Promise<[string, readonly IPerformanceMark[]][]>;

        function getUriScheme(): Promise<string>;
        function openUri(target: URI): Promise<boolean>;
        const telemetryLevel: Promise<IObservableValue<TelemetryLevel>>;
    }

    namespace window {
        /**
         * Show progress in the editor. Progress is shown while running the given callback
         * and while the promise it returned isn't resolved nor rejected.
         *
         * @param task A callback returning a promise.
         * @return A promise that resolves to the returned value of the given task result.
         */
        function withProgress<R>(
            options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions,
            task: (progress: IProgress<IProgressStep>) => Promise<R>
        ): Promise<R>;
    }

    export {
        create,
        IWorkbenchConstructionOptions,
        IWorkbench,
        // Basic Types
        URI,
        UriComponents,
        Event,
        Emitter,
        IDisposable,
        Disposable,
        IObservableValue,
        // Workspace
        IWorkspace,
        IWorkspaceProvider,
        // FileSystem
        IFileSystemProvider,
        FileSystemProviderCapabilities,
        IFileChange,
        FileChangeType,
        // WebSockets
        IWebSocketFactory,
        IWebSocket,
        // Resources
        IResourceUriProvider,
        // Credentials
        ICredentialsProvider,
        // Static Extensions
        IStaticExtension,
        IExtensionManifest,
        // Callbacks
        IURLCallbackProvider,
        // SettingsSync
        ISettingsSyncOptions,
        // Updates/Quality
        IUpdateProvider,
        IUpdate,
        IProductQualityChangeHandler,
        // Telemetry
        ICommonTelemetryPropertiesResolver,
        // External Uris
        IExternalUriResolver,
        // External URL Opener
        IExternalURLOpener,
        // Tunnel
        ITunnelProvider,
        ITunnelFactory,
        ITunnel,
        ITunnelOptions,
        // Ports
        IShowPortCandidate,
        // Commands
        ICommand,
        commands,
        Menu,
        // Logger
        logger,
        LogLevel,
        // Window
        window,
        // Progress
        IProgress,
        ProgressLocation,
        IProgressStep,
        IProgressOptions,
        IProgressNotificationOptions,
        IProgressDialogOptions,
        IProgressWindowOptions,
        IProgressCompositeOptions,
        // Branding
        IHomeIndicator,
        IProductConfiguration,
        IWindowIndicator,
        IInitialColorTheme,
        // Default layout
        IDefaultView,
        IDefaultEditor,
        IDefaultLayout,
        // Env
        IPerformanceMark,
        env,
        // Nav Bar
        IWelcomeBanner,
        // Telemetry
        TelemetryLevel
    };
}
