export enum MessageResponse {
  // user Code : 2000 -> 2999
  USER_CREATED = 'User created',
  USER_LOGIN_SUCCESS = 'User login success',
  USER_INVALID_USERNAME = 'Username is invalid',
  USER_INVALID_PASSWORD = 'Password is invalid',
  USER_NOT_FOUND = 'User not found',
  USER_DEACTIVATED = 'User deactivated',

  // code common
  SUCCESS = 'Success',
}

export const StatusCodeResponse: Record<string, number> = {
  // user
  [MessageResponse.USER_CREATED]: 2000,
  [MessageResponse.USER_LOGIN_SUCCESS]: 2001,
  // error begin 10000
  [MessageResponse.USER_INVALID_USERNAME]: 10002,
  [MessageResponse.USER_INVALID_PASSWORD]: 10003,
  [MessageResponse.USER_NOT_FOUND]: 10004,
  [MessageResponse.USER_DEACTIVATED]: 10005,

  // common
  [MessageResponse.SUCCESS]: 9000,
};
