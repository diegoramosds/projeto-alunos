const storedUser = JSON.parse(localStorage.getItem('user')) || {
  id: null,
  nome: null,
  email: null,
};

const initialState = {
  user: storedUser,
  isLoggedIn: !!storedUser.id,
  isLoading: false,
  error: null,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_CREATED_SUCCESS':
      // eslint-disable-next-line no-case-declarations
      const userData = {
        id: action.payload.user?.id || null,
        nome: action.payload.user?.nome || 'Usuário',
        email: action.payload.user?.email || null,
      };

      localStorage.setItem('user', JSON.stringify(userData));

      return {
        ...state,
        user: userData,
        isLoggedIn: !!userData.id,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT_SUCCESS':
      localStorage.removeItem('user');
      return {
        ...state,
        user: {
          id: null,
          nome: null,
          email: null,
        },
        isLoggedIn: false,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT_REQUEST':
      return {
        ...state,
        user: {
          id: null,
          nome: null,
          email: null,
        },
        isLoggedIn: false,
        isLoading: false,
        error: null,
      };
    case 'REGISTER_UPDATED_SUCCESS': {
      return {
        ...state,
        user: {
          ...state.user,
          nome: action.payload.nome,
          email: action.payload.email,
        },
        isLoading: false,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
