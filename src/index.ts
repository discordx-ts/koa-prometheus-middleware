import type { Middleware } from "koa";
import Prometheus from "prom-client";

import {
  requestCountGenerator,
  requestDurationGenerator,
  requestLengthGenerator,
  responseLengthGenerator,
} from "./metrics.js";
import { normalizePath, normalizeStatusCode } from "./normalizer.js";
import type { Options } from "./types.js";

const PrometheusMiddleware = (options?: Options): Middleware => {
  const opts = {
    collectDefaultMetrics: options?.collectDefaultMetrics ?? true,
    customLabels: options?.customLabels
      ? ["method", "route", "status", ...options.customLabels]
      : ["method", "route", "status"],
    defaultMetricsCollectorConfiguration:
      options?.defaultMetricsCollectorConfiguration,
    extraMasks: options?.extraMasks ?? [],
    ignorePaths: options?.ignorePaths ?? ["/metrics"],
    normalizeStatus: options?.normalizeStatus ?? true,
    prefix: options?.prefix,
    requestDurationBuckets:
      options?.requestDurationBuckets ??
      Prometheus.exponentialBuckets(0.05, 1.75, 8),
    requestLengthBuckets: options?.requestLengthBuckets ?? [
      512, 1024, 5120, 10240, 51200, 102400,
    ],
    responseLengthBuckets: options?.responseLengthBuckets ?? [
      512, 1024, 5120, 10240, 51200, 102400,
    ],
    transformLabels: options?.transformLabels,
  };

  // collect default metrics
  if (opts.collectDefaultMetrics) {
    Prometheus.collectDefaultMetrics({
      prefix: opts.prefix,
      ...opts.defaultMetricsCollectorConfiguration,
    });
  }

  const requestCount = requestCountGenerator(opts.customLabels, opts.prefix);

  const requestDuration = requestDurationGenerator(
    opts.customLabels,
    opts.requestDurationBuckets,
    opts.prefix
  );

  const requestLength = requestLengthGenerator(
    opts.customLabels,
    opts.requestLengthBuckets,
    opts.prefix
  );

  const responseLength = responseLengthGenerator(
    opts.customLabels,
    opts.responseLengthBuckets,
    opts.prefix
  );

  /**
   * Corresponds to the R(request rate), E(error rate), and D(duration of requests),
   * of the RED metrics.
   */
  const collectMetrics: Middleware = async (ctx, next) => {
    const time = requestDuration.startTimer();

    await next();

    const { originalUrl, method } = ctx.request;
    // will replace ids from the route with `#val` placeholder this serves to
    // measure the same routes, e.g., /image/id1, and /image/id2, will be
    // treated as the same route
    const route = normalizePath({ extraMasks: opts.extraMasks, originalUrl });

    if (!opts.ignorePaths.includes(route)) {
      const status = opts.normalizeStatus
        ? normalizeStatusCode(ctx.res.statusCode)
        : ctx.res.statusCode.toString();

      const labels = { method, route, status };
      if (typeof opts.transformLabels === "function") {
        opts.transformLabels(labels, ctx);
      }

      // request count
      requestCount.inc(labels);

      // Observes and returns the value to request duration in seconds
      time(labels);

      // observe request length
      if (opts.requestLengthBuckets.length) {
        const reqLength = ctx.request.get("Content-Length");
        if (reqLength) {
          requestLength.observe(labels, Number(reqLength));
        }
      }

      // observe response length
      if (opts.responseLengthBuckets.length) {
        const resLength = ctx.response.get("Content-Length");
        if (resLength) {
          responseLength.observe(labels, Number(resLength));
        }
      }
    }
  };

  return collectMetrics;
};

export default PrometheusMiddleware;
