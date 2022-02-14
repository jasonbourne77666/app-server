import Koa from 'koa';
import path from 'path';
import winston from 'winston';
import serve from 'koa-static';
import { createProxyMiddleware } from 'http-proxy-middleware';
const k2c = require('koa2-connect');
import { logger } from './logger';

const app = new Koa();
// Logger middleware -> use winston as logger (logging.ts with config)
app.use(logger(winston));

app.use(async (ctx, next) => {
  const url = ctx.path;
  if (url.startsWith('/api')) {
    ctx.respond = false;
    await k2c(
      createProxyMiddleware({
        target: '', //# 后端的接口地址
        changeOrigin: true,
        secure: false
      })
    )(ctx, next);
  }
  return await next();
});

app.use(serve(path.join(__dirname, '..', '/public')));

app.listen(4000);
