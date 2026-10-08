export const environment = {
  production: true,
  apiUrls: {
    baseUrl: 'http://localhost:3000',
    authUrl: 'api/auth',
    usersUrl: 'api/users',
  },
  apps: {
    profile: {
      route: 'profile',
      name: 'Profile',
      icon: 'person',
    },
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
  },
};
