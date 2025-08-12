import { describe, it, expect } from 'vitest';
import { CustomException } from './customException';

// Mock of the axios error response
const mockErrorResponse = {
  response: {
    data: {
      error: 'Missing password',
    },
  },
};

describe('CustomException', () => {
  it('should return the error message from the API response', () => {
    const exception = new CustomException(mockErrorResponse);
    expect(exception.data()).toBe('Missing password');
  });

  it('should return a default error message for unknown errors', () => {
    const unknownError = { message: 'Unknown error' };
    const exception = new CustomException(unknownError);
    expect(exception.data()).toBe('Ocorreu um erro desconhecido!');
  });

  it('should throw an exception when calling a function that throws CustomException', () => {
    const func = () => {
      throw new CustomException(mockErrorResponse);
    };
    expect(func).toThrow(CustomException);
  });

  it('should return the message from error.response.data.message when present', () => {
    const mockErrorResponse = {
      response: {
        data: {
          message: 'Custom message',
        },
      },
    };
    const exception = new CustomException(mockErrorResponse);
    expect(exception.data()).toBe('Custom message');
  });

  it('should return error.response.data when error and message are not present', () => {
    const mockErrorResponse = {
      response: {
        data: 'Generic error',
      },
    };
    const exception = new CustomException(mockErrorResponse);
    expect(exception.data()).toBe('Generic error');
  });

  it('should return the default message when error.response is absent', () => {
    const mockErrorResponse = {};
    const exception = new CustomException(mockErrorResponse);
    expect(exception.data()).toBe('Ocorreu um erro desconhecido!');
  });
});
