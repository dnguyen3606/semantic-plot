import {lazy} from 'react'
import type {Routes} from '../../@types/routes'

const publicRoutes: Routes = [
    {
        key: 'home',
        path: `/home`,
        component: lazy(() => import('../../pages/Home')),
        authority: []
    }
]

export default publicRoutes;