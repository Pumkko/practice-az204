
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import WeatherForecast from './appointments/components/WeatherForecast';

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

        <WeatherForecast />
      </AuthenticatedTemplate>
    </>
  )
}

export default App
