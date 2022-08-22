// Extension ID: ms-vscode.vscode-ai-remote-web
// http://localhost:3000/+aHR0cDovL2xvY2FsaG9zdDo1MDAw/L3N1YnNjcmlwdGlvbnMvYjg1NmZmODctMDBkMS00MjA1LWFmNTYtM2FmNTQzNWFlNDAxL3Jlc291cmNlR3JvdXBzL3NldmlsbGFsX3dzX3JnL3Byb3ZpZGVycy9NaWNyb3NvZnQuTWFjaGluZUxlYXJuaW5nU2VydmljZXMvd29ya3NwYWNlcy9zZXZpbGxhbF93cy9jb21wdXRlcy9zZXZpbGxhbC1jaS10ZXN0/home/azureuser/cloudfiles/code

import * as vscode from 'vscode';
import { checkForUpdates } from './web/launcher';

export async function activate(context: vscode.ExtensionContext) {
    function getMyWebviewContent(webview: vscode.Webview, context: any): string { 
        let html: string = ``;
        
        // construct your HTML code
        html += `
                <!DOCTYPE html>
                <html>
                    <head>
                      <link rel="stylesheet" />    
                    </head>
                    <body>
                      <div class="main"> 
                          <div>Welcome to Project Limelight!</div>
                          <div>1. Create a new function app!<div>
                          <div>2. Edit an existing funtion app<div>
                          <br></br>
                          <div>Create or edit a function app, and hit deploy once you're ready. Your app will show up in your storage account in your user-specific folder<div>
                      </div>
                    </body>
                 </html>
        `;
        // -----------------------
        return html;
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('mypanel.start', (new_func_app: Boolean) => {
            // Create and show panel
            if (new_func_app == true) {
                const panel = vscode.window.createWebviewPanel(
                    'mypanel',  // <--- identifier
                    'Limelight Welcome', // <--- title
                    vscode.ViewColumn.One,
                    {}
                );
            
                // And set its HTML content
                panel.webview.html = getMyWebviewContent(panel.webview, context);   // <--- HTML
            }
        })
    );
}

export function deactivate() {}
