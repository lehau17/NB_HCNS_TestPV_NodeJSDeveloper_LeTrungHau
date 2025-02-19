export enum MessageResponse {
  // user Code : 2000 -> 2999
  USER_CREATED = 'User created',
  USER_LOGIN_SUCCESS = 'User login success',

  // code common
  SUCCESS = 'Success',
}

export const StatusCodeResponse: Record<string, number> = {
  // user
  [MessageResponse.USER_CREATED]: 2000,
  [MessageResponse.USER_LOGIN_SUCCESS]: 2001,

  // common
  [MessageResponse.SUCCESS]: 9000,
};
