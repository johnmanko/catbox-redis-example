import { RouteBuilder } from '../../../../../lib/interfaces/route-builder.interface';
import ProfileOptions from './profile-get'

const basePath: string = "/profile";

const routes: RouteBuilder = new RouteBuilder([
  {
    method: 'GET',
    path: "/{username?}",
    options: ProfileOptions
  }
]);

export const Routes: RouteBuilder = routes.build(basePath);