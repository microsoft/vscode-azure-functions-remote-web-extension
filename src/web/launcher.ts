/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';

export async function checkForUpdates() {
    const { up_to_date } = await vscode.commands.executeCommand<{ up_to_date: boolean }>('azureml-remote.browser.checkForUpdates', false);
    if (up_to_date) {
        return;
    }

    const updateCli = async () => {
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Updating the VS Code CLI`,
                cancellable: false
            },
            () => vscode.commands.executeCommand('azureml-remote.browser.checkForUpdates', true)
        );

        vscode.window.showInformationMessage('VS Code CLI update complete.');
    };

    if (getAlwaysUpdateCLI()) {
        await updateCli();
        return;
    }

    const alwaysUpdate = 'Always update';
    const updateAction = 'Update';
    const actual = await vscode.window.showInformationMessage(
        "An update for the VS Code CLI on your remote server is available. Would you like to update now? Your current session won't be interrupted",
        alwaysUpdate,
        updateAction,
        'Not Now'
    );

    if (actual === alwaysUpdate) {
        setAlwaysUpdateCLI(true);
    }

    if (actual === updateAction || actual === alwaysUpdate) {
        await updateCli();
    }
}

function getAlwaysUpdateCLI(): boolean {
    return vscode.workspace.getConfiguration().get<boolean>('remote.server.alwaysUpdateCLI') ?? false;
}

function setAlwaysUpdateCLI(value: boolean) {
    return vscode.workspace.getConfiguration().update('remote.server.alwaysUpdateCLI', value);
}
