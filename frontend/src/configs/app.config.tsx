export type AppConfig = {
  apiPrefix: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  locale: string
}

const appConfig: AppConfig = {
  apiPrefix: '',
  authenticatedEntryPath: '/home',
  unAuthenticatedEntryPath: '/home',
  locale: 'en',
}

export default appConfig