/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { ConnectionManager } from '@vscode-internal/remote-web-tunnels';
import { Disposable, IProgress, IProgressStep, LogLevel, ProgressLocation } from 'vs/workbench/workbench.web.main';
import { IRouterWorkbench } from '../types';

export async function showProgress(workbench: IRouterWorkbench, manager: ConnectionManager, ciDisplayName: string) {
    workbench.window.withProgress(
        {
            location: ProgressLocation.Notification,
            title: `Connecting to Compute instance ${ciDisplayName}`
        },
        async (progress) => {
            await handleLogsToShowProgress(progress, manager);
        }
    );
}

async function handleLogsToShowProgress(progress: IProgress<IProgressStep>, manager: ConnectionManager): Promise<void> {
    let dispose: Disposable[] = [];
    let lastDownloadPercent = 0;
    return new Promise<void>((resolve, reject) => {
        dispose.push(
            manager.onLog((log) => {
                // if (log.level === LogLevel.Info) {
                //     progress.report({ message: log.line });
                // }

                // if (log.line.includes('Downloading VS Code server')) {
                //     progress.report({ increment: 0, total: 100 });
                // }

                // const downloadProgress = log.line.match(/.*server download progress.* \(((\d+?)\%)\)/);
                // if (downloadProgress) {
                //     const [, percentageStr] = downloadProgress;
                //     const percentage = parseInt(percentageStr);
                //     progress.report({
                //         message: 'Downloading VS Code server...',
                //         increment: percentage - lastDownloadPercent,
                //         total: 100
                //     });
                //     lastDownloadPercent = percentage;
                // }

                // if (log.line.includes('Setting up server')) {
                //     progress.report({ message: log.line, increment: undefined, total: undefined });
                // }
            })
        );

        dispose.push(
            manager.onConnected(() => {
                resolve();
            })
        );

        dispose.push(
            manager.onClose(() => {
                resolve();
            })
        );
    }).finally(() => {
        dispose.forEach((d) => d.dispose());
    });
}
