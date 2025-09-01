export type AppConfig = {
  apiPrefix: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  locale: string
}

const appConfig: AppConfig = {
  apiPrefix: '',
  authenticatedEntryPath: '/',
  unAuthenticatedEntryPath: '/',
  locale: 'en',
}

export default appConfig