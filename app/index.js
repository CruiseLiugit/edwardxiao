import Koa from 'koa';
import session from 'koa-generic-session';
import csrf from 'koa-csrf';
import views from 'koa-views';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';

import ENV from '../.env';
import router from './routes';
import koaRedis from 'koa-redis';
import models from './models';
import middlewares from './middlewares';
import cacheMiddle from './middlewares/cache';

const redisStore = koaRedis({
  url: ENV.REDIS_URL
});

const app = new Koa();
app.use(bodyParser());
app.use(convert(json()));
app.use(convert(logger()));

if(ENV.SERVE_STATIC){
  app.use(convert(require('koa-static')(__dirname + '/../public')));
}

app.keys = ['secret', 'key'];
app.use(convert(session({
  store: redisStore,
  prefix: `${ENV.APP_NAME}:sess:`,
  key: `${ENV.APP_NAME}.sid`
})));

app.use(cacheMiddle({
  redis: { url: ENV.REDIS_URL }
}));

//views with pug
app.use(views(__dirname + '/views', { extension: 'pug' }));
// catch error
app.use(middlewares.catchError);
// csrf
app.use(convert(csrf()));
// add helpers for views
app.use(middlewares.addHelper);
app.use(router.routes(), router.allowedMethods());
app.listen(ENV.PORT);
export default app;