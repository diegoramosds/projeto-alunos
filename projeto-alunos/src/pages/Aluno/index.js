import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmail, isInt, isFloat } from 'validator';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import Loading from '../../components/Loading';
import { db, auth } from '../../services/firebaseConfig';
import * as actions from '../../store/modules/auth/actions';
import { FaUserCircle } from 'react-icons/fa';

export default function Aluno({ match }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const id = get(match, 'params.id', '');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function getData() {
      try {
        setIsLoading(true);
        const alunoRef = doc(db, 'alunos', id);
        const docSnap = await getDoc(alunoRef);
        if (!docSnap.exists()) {
          toast.error('Aluno não encontrado!');
        } else {
          const data = docSnap.data();
          setNome(data.nome);
          setSobrenome(data.sobrenome);
          setEmail(data.email);
          setIdade(data.idade);
          setPeso(data.peso);
          setAltura(data.altura);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        toast.error('Erro ao carregar os dados do aluno');
      }
    }
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 255 caracteres');
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true;
      toast.error('Sobrenome deve ter entre 3 e 255 caracteres');
    }
    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido');
    }
    if (!isInt(String(idade))) {
      formErrors = true;
      toast.error('Idade inválida');
    }
    if (!isFloat(String(peso))) {
      formErrors = true;
      toast.error('Peso inválido');
    }
    if (!isFloat(String(altura))) {
      formErrors = true;
      toast.error('Altura inválida');
    }
    if (formErrors) return;

    try {
      setIsLoading(true);

      if (id) {
        const alunoRef = doc(db, 'alunos', id);
        await updateDoc(alunoRef, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) editado(a) com sucesso!');
      } else {
        const uid = auth.currentUser.uid;
        await addDoc(collection(db, 'alunos'), {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
          usuarioId: uid,
        });
        toast.success('Aluno(a) criado(a) com sucesso!');
      }

      setIsLoading(false);
      history.push(`/`);
    } catch (err) {
      setIsLoading(false);
      toast.error('Erro ao salvar os dados do aluno');
      if (err.code === 'unauthenticated') dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Editar aluno' : 'Novo aluno'} </Title>
      {id && (
        <ProfilePicture>
          <FaUserCircle size={180} />
        </ProfilePicture>
      )}
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Sobrenome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />
        <input
          type="text"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso"
        />
        <input
          type="text"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Altura"
        />
        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
