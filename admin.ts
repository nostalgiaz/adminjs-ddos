import AdminJSExpress from '@adminjs/express';
import {Database, getModelByName, Resource} from '@adminjs/prisma';
import {type PrismaClient} from '@prisma/client';
import {AdminJS, type AdminJSOptions} from 'adminjs';

const ADMIN_BASE_URL = 'http://localhost:8080';
const ADMIN_BASE_PATH = '/admin';

const ADMINJS_SESSION_SECRET = 'adminjs_session_secret_1234567891234'

export const buildAdmin = (prismaClient: PrismaClient) => {
  const authenticate = async (email: string, password: string) => {
    return true;
  };

  AdminJS.registerAdapter({Resource, Database});

  const adminOptions: AdminJSOptions = {
    branding: {companyName: 'Admin JS DDoS Admin'},
    rootPath: new URL(ADMIN_BASE_URL + ADMIN_BASE_PATH).pathname,
    loginPath: new URL(ADMIN_BASE_URL + ADMIN_BASE_PATH + '/login').pathname,
    logoutPath: new URL(ADMIN_BASE_URL + ADMIN_BASE_PATH + '/logout').pathname,
    resources: [
      {
        resource: {
          model: getModelByName('TestModel'),
          client: prismaClient,
        },
        options: {
          properties: {
            previewData: {
              type: 'key-value',
            },
          },
        },
      },
    ],
  };

  const admin = new AdminJS(adminOptions);
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    admin.initialize();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    admin.watch();
  }

  const COOKIE_NAME = 'adminjs';
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: COOKIE_NAME,
      cookiePassword: ADMINJS_SESSION_SECRET,
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      cookieName: COOKIE_NAME,
      name: COOKIE_NAME,
      secret: ADMINJS_SESSION_SECRET,
    },
  );

  return [ADMIN_BASE_PATH, adminRouter] as const;
};
