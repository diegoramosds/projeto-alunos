import { put, all, takeLatest, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import { auth } from '../../../services/firebaseConfig';
import history from '../../../services/history';
import {
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
  getAuth,
  updatePassword,
} from 'firebase/auth';
function* loginRequest({ payload }) {
  try {
    const { email, password, prevPath } = payload;

    const userCredential = yield call(
      signInWithEmailAndPassword,
      auth,
      email,
      password
    );
    const user = userCredential.user;

    yield call([user, user.reload]);
    const updatedUser = auth.currentUser;

    console.log('Nome após o login:', updatedUser.displayName);

    const token = yield call([updatedUser, updatedUser.getIdToken]);

    const userData = {
      id: updatedUser.uid,
      nome: updatedUser.displayName,
      email: updatedUser.email,
    };

    localStorage.setItem('user', JSON.stringify(userData));

    yield put(
      actions.loginSuccess({
        user: userData,
        token,
      })
    );

    toast.success('Login realizado com sucesso!');

    history.push(prevPath || '/');
  } catch (error) {
    toast.error('Usuário ou senha inválidos');
    yield put(actions.loginFailure());
  }
}

function* registerRequest({ payload }) {
  try {
    const { nome, email, senha } = payload;

    // Verifique se a senha é fornecida antes de tentar registrar
    if (!senha) {
      throw new Error('Senha é obrigatória');
    }

    // Criando o usuário no Firebase
    const userCredential = yield call(
      createUserWithEmailAndPassword,
      auth,
      email,
      senha
    );
    const user = userCredential.user;

    // Agora o nome também pode ser atualizado
    yield call(updateProfile, user, { displayName: nome });

    const userData = {
      id: user.uid,
      nome: user.displayName,
      email: user.email,
    };

    yield put(actions.registerCreatedSuccess(userData));
    toast.success('Conta criada com sucesso!');
    history.push('/login');
  } catch (error) {
    toast.error(`Erro ao registrar: ${error.message}`);
    yield put(actions.registerFailure(error.message));
  }
}

function* logoutRequest() {
  try {
    yield call(signOut, auth); // Faz o logout no Firebase

    // 🔥 Limpa os dados do usuário no localStorage e Redux
    localStorage.removeItem('user');
    yield put(actions.logoutSuccess());

    toast.success('Logout realizado com sucesso!');
    history.push('/login');
  } catch (error) {
    toast.error('Erro ao sair: ' + error.message);
  }
}

// Saga para lidar com a reidratação do estado persistido
function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');

  if (!token) return;
}

function* updateUserSaga({ payload }) {
  try {
    const auth = getAuth();
    const user = auth.currentUser; // Pegando o usuário logado

    if (user) {
      // Se foi passada uma senha atual, tentamos fazer login com ela
      if (payload.senhaAtual) {
        try {
          // Verifica a senha atual do usuário
          yield call(
            signInWithEmailAndPassword,
            auth,
            user.email,
            payload.senhaAtual
          );
        } catch (error) {
          throw new Error('Senha atual incorreta');
        }
      }

      // Atualizando o nome, se foi alterado
      if (payload.nome) {
        yield call(updateProfile, user, { displayName: payload.nome });
      }

      // Atualizando a nova senha, se foi fornecida
      if (payload.novaSenha) {
        yield call(updatePassword, user, payload.novaSenha); // Atualiza a nova senha
      }

      const updatedUser = {
        id: user.uid,
        nome: payload.nome || user.displayName, // Se não foi passado nome, usa o que está no Firebase
        email: user.email,
      };

      // Atualiza Redux
      yield put(actions.updateUserSuccess(updatedUser));

      // Atualiza localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Nome e/ou senha atualizados com sucesso!');
    } else {
      throw new Error('Usuário não encontrado.');
    }
  } catch (error) {
    toast.error(`Erro ao atualizar nome ou senha: ${error.message}`);
    console.error(error);
    yield put(actions.updateUserFailure(error.message));
  }
}

// Combina todas as sagas
export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
  takeLatest(types.REGISTER_UPDATED_REQUEST, updateUserSaga),
  takeLatest(types.LOGOUT_REQUEST, logoutRequest),
]);
