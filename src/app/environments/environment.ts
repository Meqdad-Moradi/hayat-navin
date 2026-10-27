export const environment = {
  production: false,
  apiUrls: {
    baseUrl: 'http://localhost:3000',
    authUrl: 'api/auth',
    usersUrl: 'api/users',
  },
  apps: {
    searchstudents: {
      route: 'searchpersons',
      name: 'Search Persons',
      icon: 'search',
    },
    registration: {
      route: 'registration',
      name: 'Registration',
      icon: 'app_registration',
    },
    neoncore: {
      route: 'neoncore',
      name: 'Neon Core',
      icon: 'touch_app',
    },
  },
};
