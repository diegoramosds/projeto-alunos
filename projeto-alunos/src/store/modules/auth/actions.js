export const registerRequest = (userData) => ({
  type: 'REGISTER_REQUEST',
  payload: userData,
});

// Ação para fazer login
export const loginRequest = ({ email, password, prevPath }) => {
  return {
    type: 'LOGIN_REQUEST',
    payload: { email, password, prevPath },
  };
};

// Ação para fazer logout
export const logout = () => {
  return {
    type: 'LOGOUT_REQUEST',
  };
};

export const loginFailure = () => {
  return {
    type: 'LOGIN_FAILURE',
  };
};
export const registerFailure = (error) => {
  return {
    type: 'REGISTER_FAILURE',
    payload: error,
  };
};

export const loginSuccess = ({ user, token }) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: { user, token },
  };
};

export const registerCreatedSuccess = (user) => {
  return {
    type: 'REGISTER_CREATED_SUCCESS',
    payload: user,
  };
};

export const updateUserRequest = (user) => ({
  type: 'REGISTER_UPDATED_REQUEST',
  payload: user,
});

export const updateUserSuccess = (user) => ({
  type: 'REGISTER_UPDATED_SUCCESS',
  payload: user,
});

export const updateUserFailure = (error) => ({
  type: 'REGISTER_FAILURE',
  payload: error,
});

export const logoutSuccess = () => {
  return {
    type: 'LOGOUT_SUCCESS',
  };
};
