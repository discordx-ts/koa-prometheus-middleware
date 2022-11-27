import Router from "@koa/router";
import Koa from "koa";
import Prometheus from "prom-client";

import PrometheusMiddleware from "../src/index.js";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Metric available at /metrics";
});

router.get("/hello", (ctx) => {
  ctx.body = "Hello there";
});

router.get("/metrics", async (ctx) => {
  ctx.set("Content-Type", Prometheus.register.contentType);
  return ctx.res.end(await Prometheus.register.metrics());
});

function start() {
  app.use(
    PrometheusMiddleware({
      customLabels: ["app"],
      defaultMetricsCollectorConfiguration: { labels: { app: "myApp" } },
      ignorePaths: ["/metrics"],
      transformLabels: (labels) => {
        labels["app"] = "myApp";
      },
    })
  );

  app.use(router.routes());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

start();
