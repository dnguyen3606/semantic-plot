import { Navigate } from 'react-router-dom'
import appConfig from '../configs/app.config'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
  //const { authenticated } = useAuth()

  //return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
  return <Navigate to={authenticatedEntryPath}/>
}

export default PublicRoute