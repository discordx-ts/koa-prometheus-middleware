export type Options = {
  /*
   * Whether or not to collect prom-client default metrics. These metrics are useful for
   * collecting saturation metrics, for example.
   */
  collectDefaultMetrics?: boolean;

  /*
   * Optional Array containing extra labels, used together with transformLabels
   */
  customLabels?: string[];

  /*
   * Optional, list of regex to be used as argument to url-value-parser, this will
   * cause extra route params, to be replaced with a #val placeholder.
   */
  extraMasks?: RegExp[];

  /*
   * List of ignored routes, default: /metrics
   */
  ignorePaths?: string[];

  /*
   * Optional parameter to disable normalization of the status code. Example of
   * normalized and non-normalized status code respectively: 4xx and 422.
   */
  normalizeStatus?: boolean;

  /*
   * Optional prefix for the metrics name
   */
  prefix?: string;

  /*
   * Buckets for the request duration metrics (in seconds) histogram
   */
  requestDurationBuckets?: number[];

  /*
   * Buckets for the request length metrics (in bytes) histogram
   */
  requestLengthBuckets?: number[];

  /*
   * Buckets for the response length metrics (in bytes) histogram
   */
  responseLengthBuckets?: number[];
};
