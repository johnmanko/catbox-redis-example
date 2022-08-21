import { RouteBuilder } from '../../../../../lib/interfaces/route-builder.interface';
import LoginOptions from './auth'
import LogoutOptions from './revoke'

const basePath: string = "/auth"

const routes: RouteBuilder = new RouteBuilder([
  {
    method: 'POST',
    path: "/auth",
    options: LoginOptions
  },
  {
    method: 'GET',
    path: "/revoke",
    options: LogoutOptions
  }
]);

export const Routes: RouteBuilder = routes.build(basePath);