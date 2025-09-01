import {lazy} from 'react'
import type {Routes} from '../../@types/routes'

const publicRoutes: Routes = [
    {
        key: 'home',
        path: `/`,
        component: lazy(() => import('../../pages/Home')),
        authority: []
    },
    {
        key: 'demo',
        path: `/demo`,
        component: lazy(() => import('../../pages/Demo')),
        authority: []
    },
    {
        key: 'semantic-plot',
        path: `/demo/semantic-plot`,
        component: lazy(() => import('../../pages/SemanticPlot')),
        authority: []
    },
    {
        key: 'aino',
        path: `/demo/aino`,
        component: lazy(() => import('../../pages/Aino')),
        authority: []
    },
]

export default publicRoutes;