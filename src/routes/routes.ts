import Hapi from '@hapi/hapi';
import APIRoutes from './api/routes';

const routes:Hapi.ServerRoute[] = [].concat(APIRoutes);

export default routes;