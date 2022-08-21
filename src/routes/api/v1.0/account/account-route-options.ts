import { Routes as AuthRoutes } from './auth/auth-route-options';
import ProfilePostOptions from './profile-post';
import { RouteBuilder } from '../../../../lib/interfaces/route-builder.interface';

const basePath: string = "/account"

const routes: RouteBuilder = new RouteBuilder([
    {
        method: 'POST',
        path: "/profile",
        options: ProfilePostOptions
    }
]);

export const Routes: RouteBuilder = RouteBuilder.merge(basePath, routes, AuthRoutes);
