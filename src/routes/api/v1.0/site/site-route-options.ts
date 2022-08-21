import { Routes as ProfileRoutes } from './profile/profile-route-options';
import { RouteBuilder } from '../../../../lib/interfaces/route-builder.interface';

const basePath: string = "/site"

export const Routes: RouteBuilder = RouteBuilder.merge(basePath, ProfileRoutes);