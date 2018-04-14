
// Set user info from request
export function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    email: request.email,
    firstName:request.firstName,
    lastName:request.lastName
    
  };

  return getUserInfo;
};
