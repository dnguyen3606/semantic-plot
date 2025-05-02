import { Suspense, lazy } from "react";
import LoadingScreen from "./loading-screen/LoadingScreen";

const LeftSideBar = lazy(() => import("./layout/LeftNavBar"));
const Views = lazy(() => import("./Views"));
const RightSideBar = lazy(() => import("./layout/RightSideBar"));

const AppLayout: React.FC = () => {
    return (
    <div
        style={{
        overflow: 'hidden',
        backgroundColor: 'rgb(236,236,236)',
        display: 'flex',
        flex: '1 1 auto',
        height: '100vh',
        }}
    >
        <LeftSideBar/>
        <Views/>
        <RightSideBar/>
    </div>
    )

}

export function Layout() {
    return (
        <Suspense
            fallback={
                <div>
                    <LoadingScreen/>
                </div>
            }
        >
            <AppLayout/>
        </Suspense>
    )
}
