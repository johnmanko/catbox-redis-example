import { Routes as AccountRoutes } from './account/account-route-options';
import { Routes as SiteRoutes } from './site/site-route-options';
import { RouteBuilder } from '../../../lib/interfaces/route-builder.interface';

const basePath = "/api/1";

export default RouteBuilder.buildAll(basePath, AccountRoutes, SiteRoutes);
