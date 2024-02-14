/// <reference types="vite/client" />
interface ImportMetaEnv {

    // Client Id of the app created in the B2C Directory (not the default one)
    readonly VITE_MSAL_CLIENT_ID: string

    // The tenant name can be found in the B2C tenant created in the original directory 
    // (usually default). the tenant name will be displayed in the resource under the format : [name].onmicrosoft.com
    readonly VITE_B2C_TENANT_NAME: string

    // Name of the created user flow (see readme about creating a userflow)
    readonly VITE_USER_FLOW_NAME: string

    // full URI of both scope declared in the API (App registration is in the AZ B2C Directory not the default one)
    readonly VITE_WRITE_SCOPE: string
    readonly VITE_READ_SCOPE: string

    readonly VITE_API_ROOT: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }