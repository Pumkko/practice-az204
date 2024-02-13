import { Configuration, LogLevel } from "@azure/msal-browser";

const authSI = `https://${import.meta.env.VITE_B2C_TENANT_NAME}.b2clogin.com/${import.meta.env.VITE_B2C_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_USER_FLOW_NAME}`

console.log(authSI);

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

export const protectedResources = {
    apiAppointment: {
        endpoint: 'http://localhost:5000/api/todolist',
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
    scopes: [...protectedResources.apiAppointment.scopes.read, ...protectedResources.apiAppointment.scopes.write],
};