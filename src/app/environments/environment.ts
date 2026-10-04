export const environment = {
  production: false,
  apiUrls: {
    baseUrl: 'http://localhost:3000',
    authUrl: 'api/auth',
  },
  apps: {
    profile: {
      route: 'profile',
      name: 'Profile',
      icon: 'face',
    },
    searchstudents: {
      route: 'searchpersons',
      name: 'Search Persons',
      icon: 'search',
    },
    registration: {
      route: 'register',
      name: 'Registration',
      icon: 'app_registration',
    },
  },
};
