export enum MessageResponse {
  // user Code : 2000 -> 2999
  USER_CREATED = 'User created',
  USER_LOGIN_SUCCESS = 'User login success',
  USER_INVALID_USERNAME = 'Username is invalid',
  USER_INVALID_PASSWORD = 'Password is invalid',
  USER_NOT_FOUND = 'User not found',
  USER_DEACTIVATED = 'User deactivated',
  USER_EXISTED = 'User existed',
  REFRESH_TOKEN_SUCESS = 'Refresh token',
  USER_INFO = 'User info',
  USER_FIND_MANY = 'User find many',

  // 3000
  UNAUTHORIZE = 'Unauthorized',

  REFRESH_TOKEN_INVALID = 'Refresh token invalid',

  // code common
  SUCCESS = 'Success',

  // server error
  SERVER_ERROR = 'Server error',
}

export const StatusCodeResponse: Record<string, number> = {
  // user
  [MessageResponse.USER_CREATED]: 2000,
  [MessageResponse.USER_LOGIN_SUCCESS]: 2001,
  [MessageResponse.USER_INFO]: 2002,
  [MessageResponse.USER_FIND_MANY]: 2003,
  // error begin 10000
  [MessageResponse.USER_INVALID_USERNAME]: 10002,
  [MessageResponse.USER_INVALID_PASSWORD]: 10003,
  [MessageResponse.USER_NOT_FOUND]: 10004,
  [MessageResponse.USER_DEACTIVATED]: 10005,
  [MessageResponse.USER_EXISTED]: 10006,
  // server error begin 50000
  [MessageResponse.SERVER_ERROR]: 50000,

  // unauthorize
  [MessageResponse.UNAUTHORIZE]: 3000,
  [MessageResponse.REFRESH_TOKEN_INVALID]: 3001,
  // common
  [MessageResponse.SUCCESS]: 9000,
};
