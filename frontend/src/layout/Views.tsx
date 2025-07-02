import { Suspense } from 'react'
//import appConfig from '../configs/app.config'
import { Routes, Route } from 'react-router-dom'
import {/*protectedRoutes,*/ publicRoutes} from "../configs/routes.config";
//import ProtectedRoute from "../route/ProtectedRoute";
import AppRoute from "../routes/AppRoute";
import PublicRoute from "../routes/PublicRoute";
import LoadingScreen from "./loading-screen/LoadingScreen";
import classes from "./Views.module.css";

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  // layout?: LayoutType
}

type AllRoutesProps = ViewsProps

//const { authenticatedEntryPath } = appConfig

const AllRoutes = (_props: AllRoutesProps) => {

  return (
    <Routes>
        {/* PROTECTED ROUTES, UNIMPLEMENTED UNTIL WE NEED AUTH */}
      {/* <Route path="/" element={<ProtectedRoute />}> 
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />
        {protectedRoutes.map((route, index) => {
          return <Route
            key={route.key + index}
            path={route.path}
            element={
              <AuthorityGuard
                userAuthority={userAuthority}
                authority={route.authority}
              >
                  <AppRoute
                    routeKey={route.key}
                    component={route.component}
                    {...route.authority}
                  />
              </AuthorityGuard>
            }
          />
        })}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route> */}
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  )
}

const Views = (props: ViewsProps) => {
  return (
    <div
      className={classes.viewsContainer}
    >
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <AllRoutes {...props} />
      </Suspense>
    </div>
  )
}

export default Views