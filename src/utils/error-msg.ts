export default (error?: string | Error): string => {
  let str = 'Unknown Error';

  if (error) {
    if (typeof error === 'string') {
      str = `🚫 Error: ${error}`;
    } else if (error instanceof Error) {
      str = `🚫 Error: ${error.message}`;
    }
  }

  return str;
};
