# What Did I Learn

Oh boy
Sooooo to setup an Azure BC2 Tenant it was pretty easy just followed this doc

https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant

Then this one to register a SPA: 
https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-spa

NOTE : the previous page states that MSAL.JS 2.0 does not need implicit flow enabled, 
well maybe but the user flow we are configuring on the next page : 
https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-user-flow
is currently (February 2024) does not support SPA


So then create UserFlow : https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-user-flow
and then I used this sample to build this very very schmoll react app 
https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c
