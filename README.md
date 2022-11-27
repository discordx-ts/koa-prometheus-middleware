# 📟 koa-prometheus-middleware

This is a middleware for koa servers, that expose metrics for prometheus.

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install koa-prometheus-middleware

yarn add koa-prometheus-middleware
```

# Example

```ts
// add global middleware
app.use(
  PrometheusMiddleware({
    ignorePaths: ["/metrics"],
  })
);

// add router
router.get("/metrics", async (ctx) => {
  ctx.set("Content-Type", Prometheus.register.contentType);
  return ctx.res.end(await Prometheus.register.metrics());
});
```

# 📜 Credits

- [express-prometheus-middleware](https://www.npmjs.com/package/express-prometheus-middleware)

# 💖 Thank you

You can support [koa-prometheus-middleware](https://www.npmjs.com/package/koa-prometheus-middleware) by giving it a [GitHub](https://github.com/discordx-ts/koa-prometheus-middleware) star.
