import {
  IRacingDataClient,
  IRacingError,
  DEFAULT_RETRY_OPTIONS,
  type AuthConfig,
  type CarGetResponse,
  type HttpClientEvent,
  type IRacingClientOptions,
  type RetryOptions,
} from 'iracing-data-client';

function accepts<T>(_value: T): void {}

const auth = {
  type: 'authorization-code',
  clientId: 'package-test',
  clientSecret: 'package-test',
  tokens: { accessToken: 'package-test' },
} satisfies AuthConfig;

const options = {
  auth,
  retry: DEFAULT_RETRY_OPTIONS,
} satisfies IRacingClientOptions;

const client = new IRacingDataClient(options);
accepts<Promise<CarGetResponse>>(client.car.get());
accepts<Promise<unknown>>(client.member.get({ custIds: [123] }));
accepts<number>(client.getPendingRequestCount());
accepts<RetryOptions>(DEFAULT_RETRY_OPTIONS);

declare const cars: CarGetResponse;
accepts<number>(cars[0].carId);
declare const event: HttpClientEvent;
accepts<string>(event.type);
declare const error: IRacingError;
accepts<Error>(error);
accepts<boolean>(error.isRateLimited);

// @ts-expect-error Authentication options are required.
new IRacingDataClient({});
// @ts-expect-error Customer IDs must be numbers.
void client.member.get({ custIds: ['invalid'] });
// @ts-expect-error Generated car IDs must retain their numeric type.
accepts<string>(cars[0].carId);
