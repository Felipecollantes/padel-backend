import { ApiResponse } from '@nestjs/swagger';

export function ApiResponses(responses: any[]) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    for (const response of responses) {
      ApiResponse(response)(target, key, descriptor);
    }
  };
}
