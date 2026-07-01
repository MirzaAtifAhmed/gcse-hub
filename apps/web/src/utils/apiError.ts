import axios from 'axios';

interface ApiErrorOptions {
  fallback: string;
  offline?: string;
}

export function getApiErrorMessage(error: unknown, options: ApiErrorOptions): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return options.offline ?? 'GCSE Hub API is not reachable. Please check the server and try again.';
    }

    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }

  return options.fallback;
}
