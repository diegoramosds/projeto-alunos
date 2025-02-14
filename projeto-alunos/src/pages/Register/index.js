import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Register() {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.auth.user.id);
  const nomeStored = useSelector((state) => state.auth.user.nome);
  const emailStored = useSelector((state) => state.auth.user.email);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState(''); // Senha atual
  const [novaSenha, setNovaSenha] = useState(''); // Nova senha
  const [senha, setSenha] = useState(''); // Senha para novos usuários

  useEffect(() => {
    if (id) {
      setNome(nomeStored || '');
      setEmail(emailStored || '');
    } else {
      setNome('');
      setEmail('');
    }
  }, [id, nomeStored, emailStored]);

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido');
    }

    if (novaSenha.length && (novaSenha.length < 6 || novaSenha.length > 50)) {
      formErrors = true;
      toast.error('Nova senha deve ter entre 6 e 50 caracteres');
    }

    if (!id && (senha.length < 6 || senha.length > 50)) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres');
    }

    if (formErrors) return;

    if (!id) {
      // Criar um novo usuário (passando a senha)
      dispatch(actions.registerRequest({ nome, email, senha }));
    } else {
      // Atualizar usuário existente (se passou senha atual, atualiza a senha)
      dispatch(
        actions.updateUserRequest({
          nome,
          email,
          senhaAtual,
          novaSenha,
        })
      );
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar dados' : 'Crie sua Conta'}</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
          />
        </label>

        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            value={email}
            disabled={id} // E-mail não pode ser editado caso o usuário já exista
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
          />
        </label>

        {!id && ( // Somente para registro de novo usuário
          <label htmlFor="senha">
            Crie uma Senha:
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
            />
          </label>
        )}

        {id && (
          <label htmlFor="senhaAtual">
            Senha Atual:
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Senha atual"
            />
          </label>
        )}

        {id && (
          <label htmlFor="novaSenha">
            Nova Senha:
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Nova senha"
            />
          </label>
        )}

        <button type="submit">{id ? 'Salvar' : 'Criar minha conta'}</button>
      </Form>
    </Container>
  );
}
