import { Suspense } from "react";
import LoadingScreen from "./loading-screen/LoadingScreen";
import LeftSideBar from "./layout/LeftSidebar"

export function Layout() {
    return (
        <Suspense
            fallback={
                <div>
                    <LoadingScreen/>
                </div>
            }
        >
            <LeftSideBar/>
        </Suspense>
    )
}
