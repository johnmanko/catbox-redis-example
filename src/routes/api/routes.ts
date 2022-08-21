import Hapi from '@hapi/hapi';
import APIv1Routes from './v1.0/routes';

const routes:Hapi.ServerRoute[] = [].concat(APIv1Routes);

export default routes;