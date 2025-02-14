import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from 'react-icons/fa';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { Container } from '../../styles/GlobalStyles';
import { AlunoContainer, ProfilePicture, NovoAluno } from './styled';
import { db, auth } from '../../services/firebaseConfig';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Inicialmente carregando
  const [userId, setUserId] = useState(null); // Estado para controlar o userId

  useEffect(() => {
    // Adicionando o listener para o estado de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Atualiza o userId quando o usuário for autenticado
      } else {
        setUserId(null); // Se o usuário sair, limpa o userId
      }
      setIsLoading(false); // Garante que o loading seja removido após a autenticação ser processada
    });

    return () => unsubscribe(); // Limpar o listener quando o componente for desmontado
  }, []);

  useEffect(() => {
    async function getData() {
      if (!userId) return; // Se não houver userId, não faz a requisição

      setIsLoading(true);
      try {
        // Filtra os alunos com o usuarioId igual ao do usuário logado
        const alunosCollectionRef = collection(db, 'alunos');
        const q = query(alunosCollectionRef, where('usuarioId', '==', userId));
        const querySnapshot = await getDocs(q);

        const alunosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlunos(alunosData);
      } catch (err) {
        console.error('Erro ao carregar alunos:', err);
        toast.error('Erro ao carregar alunos');
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      getData();
    }
  }, [userId]); // Só faz a requisição quando o userId estiver disponível

  const handleDeleteAsk = (e) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  };

  const handleDelete = async (e, id, index) => {
    e.persist();
    try {
      setIsLoading(true);

      const alunoDocRef = doc(db, 'alunos', id);
      await deleteDoc(alunoDocRef);

      const novosAlunos = [...alunos];
      novosAlunos.splice(index, 1);
      setAlunos(novosAlunos);
      toast.success('Aluno excluído com sucesso!');
    } catch (err) {
      toast.error('Ocorreu um erro ao excluir aluno');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Alunos</h1>

      <NovoAluno color="#1A1A1D" to="/aluno/">
        Novo aluno
      </NovoAluno>

      <AlunoContainer>
        {alunos.length === 0 ? (
          <p>Nenhum aluno cadastrado ainda.</p>
        ) : (
          alunos.map((aluno, index) => (
            <div key={String(aluno.id)}>
              <ProfilePicture>
                {get(aluno, 'Fotos[0].url', false) ? (
                  <img crossOrigin="" src={aluno.Fotos[0].url} alt="" />
                ) : (
                  <FaUserCircle size={36} />
                )}
              </ProfilePicture>
              <span>{aluno.nome}</span>
              <span>{aluno.email}</span>
              <Link to={`/aluno/${aluno.id}/edit`}>
                <FaEdit size={16} color="#1A1A1D" />
              </Link>
              <Link onClick={handleDeleteAsk} to={`/aluno/${aluno.id}/delete`}>
                <FaWindowClose size={16} color="#8f291c" />
              </Link>
              <FaExclamation
                size={16}
                display="none"
                cursor="pointer"
                color="#F2AF29"
                onClick={(e) => handleDelete(e, aluno.id, index)}
              />
            </div>
          ))
        )}
      </AlunoContainer>
    </Container>
  );
}
