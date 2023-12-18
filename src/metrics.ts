import Prometheus from "prom-client";

/**
 * @param prefix - metrics name prefix
 * request counter
 */
function requestCountGenerator(
  labelNames: string[],
  prefix = "",
): Prometheus.Counter {
  return new Prometheus.Counter({
    help: "Counter for total requests received",
    labelNames,
    name: `${prefix}http_requests_total`,
  });
}

/**
 * @param buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * request duration
 */
function requestDurationGenerator(
  labelNames: string[],
  buckets: number[],
  prefix = "",
): Prometheus.Histogram {
  return new Prometheus.Histogram({
    buckets,
    help: "Duration of HTTP requests in seconds",
    labelNames,
    name: `${prefix}http_request_duration_seconds`,
  });
}

/**
 * @param buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * request length
 */
function requestLengthGenerator(
  labelNames: string[],
  buckets: number[],
  prefix = "",
): Prometheus.Histogram {
  return new Prometheus.Histogram({
    buckets,
    help: "Content-Length of HTTP request",
    labelNames,
    name: `${prefix}http_request_length_bytes`,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * response length
 */
function responseLengthGenerator(
  labelNames: string[],
  buckets: number[],
  prefix = "",
): Prometheus.Histogram {
  return new Prometheus.Histogram({
    buckets,
    help: "Content-Length of HTTP response",
    labelNames,
    name: `${prefix}http_response_length_bytes`,
  });
}

export {
  requestCountGenerator,
  requestDurationGenerator,
  requestLengthGenerator,
  responseLengthGenerator,
};
