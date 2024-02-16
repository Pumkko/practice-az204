import { Configuration, EventType, LogLevel, PublicClientApplication } from "@azure/msal-browser";



export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
        authority: `https://${import.meta.env.VITE_B2C_TENANT_NAME}.b2clogin.com/${import.meta.env.VITE_B2C_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_USER_FLOW_NAME}`,
        knownAuthorities: [`${import.meta.env.VITE_B2C_TENANT_NAME}.b2clogin.com`],
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
}

export const msalInstance = new PublicClientApplication(msalConfig)

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}



msalInstance.addEventCallback((event) => {
    if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
            event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
            event.eventType === EventType.SSO_SILENT_SUCCESS) &&
        event.payload !== null &&
        "account" in event.payload &&
        event.payload.account
    ) {
        msalInstance.setActiveAccount(event.payload.account);
    }
});



export const protectedResources = {
    api: {
        weatherForecast: `WeatherForecast`,
        bookAppointment: 'BookAppointment',
        scopes: {
            write: [import.meta.env.VITE_WRITE_SCOPE],
            read: [import.meta.env.VITE_READ_SCOPE],
        },
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [...protectedResources.api.scopes.read, ...protectedResources.api.scopes.write],
};