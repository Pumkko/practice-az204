
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import './App.css'

function App() {

  const { instance } = useMsal();

  const activeAccount = instance.getActiveAccount();

  return (
    <>
      <UnauthenticatedTemplate>
        <button onClick={() => {
          instance.loginRedirect();
        }}>Sign In</button>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <p>
          Morning {activeAccount?.name ?? "Unknown"}
          <button onClick={() => {
            instance.logoutRedirect()
          }}>
            Logout
          </button>
        </p>
      </AuthenticatedTemplate>
    </>
  )
}

export default App
