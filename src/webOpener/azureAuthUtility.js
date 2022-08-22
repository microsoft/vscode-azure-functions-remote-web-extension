class AzureAuthManager {
    constructor(microsoftAuthentication) {
        this.microsoftAuthentication = microsoftAuthentication;
    }

    async getAzureAuthSession(scopes) {
        const currentSessions = await this.microsoftAuthentication.getSessions(
            scopes
        );

        if (currentSessions.length > 0) {
            const session = currentSessions[0];
            const accessToken = await session.getAccessToken();
            //Block while we're waiting for the current auth session to resolve
            return await Promise.resolve({
                id: session.id,
                accessToken: accessToken,
                account: session.account,
                scopes: session.scopes,
            });
        }
        // Create new auth sessions
        const newSessions = await this.microsoftAuthentication.getSessions(
            scopes,
            { forceNewSession: false }
        );
        if (newSessions.length === 0) {
            throw new Error(
                `Could not successfully authenticate into account. Please make sure you are logged into the correct account. You can reload and try again.`
            );
        }
        const session = newSessions[0];
        const accessToken = await session.getAccessToken();
        // Block while we're waiting for the new auth session to resolve
        return await Promise.resolve({
            id: session.id,
            accessToken: accessToken,
            account: session.account,
            scopes: session.scopes,
        });
    }


}

module.exports = AzureAuthManager;