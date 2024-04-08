import React from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import { Nav } from './styled';

export default function Header() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const nomeUser = useSelector((state) => state.auth.user.nome);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/');
  };
  return (
    <Nav>
      <Link to="/">
        <p>Home</p>
      </Link>
      <Link to="/register">
        <p>Registrar</p>
      </Link>

      {isLoggedIn ? (
        <Link onClick={handleLogout} to="/logout">
          <p>Sair</p>
        </Link>
      ) : (
        <Link to="/login">
          <p>Login</p>
        </Link>
      )}

      {isLoggedIn && `Olá, ${nomeUser}! `}
    </Nav>
  );
}
