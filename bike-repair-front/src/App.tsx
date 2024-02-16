
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import WeatherForecast from './appointments/components/WeatherForecast';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosConfig';
import { protectedResources } from './msalConfig';

function App() {

  const { instance } = useMsal();

  const activeAccount = instance.getActiveAccount();

  const { mutate } = useMutation({
    mutationKey: ["bookAppointment"],
    mutationFn: () => {
      return axiosInstance.post(protectedResources.api.bookAppointment, {
        date: new Date()
      });
    }

  })

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
        <button onClick={() => {
          mutate();
        }}>
          Book
        </button>
      </AuthenticatedTemplate >
    </>
  )
}

export default App
