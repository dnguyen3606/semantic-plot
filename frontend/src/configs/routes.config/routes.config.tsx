import authRoutes from './authRoutes'
import publicRoutes_ from './publicRoutes'
import type { Routes } from '../../@types/routes'

export const publicRoutes: Routes = [...authRoutes, ...publicRoutes_]

export const protectedRoutes = [
    //to-do
]