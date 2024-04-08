import React from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Title, Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');

  const [isLoading, setIsloading] = React.useState(false);
  const [foto, setFoto] = React.useState('');

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsloading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        setFoto(get(data, 'Fotos[0].url', ''));
        setIsloading(false);
      } catch {
        toast.error('Erro ao obter imagem');
        setIsloading(false);
        history.push('/');
      }
    };

    getData();
  }, [id]);

  const handleChage = async (e) => {
    const file = e.target.files[0];
    const fotoUrl = URL.createObjectURL(file);

    setFoto(fotoUrl);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', file);

    try {
      setIsloading(true);

      await axios.post('/fotos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Foto enviada com sucesso!');
      setIsloading(false);
    } catch (err) {
      setIsloading(false);
      const { status } = get(err, 'response', '');
      toast.error('Erro ao enviar foto.');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Fotos</Title>

      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" crossOrigin="" /> : 'Selecionar'}
          <input type="file" name="" id="foto" onChange={handleChage} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
