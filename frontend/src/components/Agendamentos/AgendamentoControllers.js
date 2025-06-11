import React, { useEffect, useState } from 'react';
import AgendamentoList from './AgendamentoList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  // Busca os agendamentos na API
  const fetchAgendamentos = async () => {
    try {
      const res = await api.get('/agendamentos');
      const lista = res.data.map(item => ({
        ...item,
        paciente_nome: getPacienteNome(item.pacienteId),
        medico_nome: getMedicoNome(item.medicoId),
        data_hora: item.dataHora,
        status: 'Agendado' // ou 'Concluído', se quiser implementar
      }));
      setAgendamentos(lista);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
    }
  };

  // Funções mockadas: substitua por nomes reais se tiver
  const getPacienteNome = (id) => `Paciente ${id}`;
  const getMedicoNome = (id) => `Médico ${id}`;

  // Carrega dados na montagem
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleEdit = (agendamento) => {
    navigate(`/agendamentos/editar/${agendamento.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir o agendamento?')) {
      try {
        await api.delete(`/agendamentos/${id}`);
        fetchAgendamentos(); // Atualiza a lista
      } catch (err) {
        console.error('Erro ao excluir:', err);
      }
    }
  };

  return (
    <AgendamentoList
      agendamentos={agendamentos}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default Agendamentos;
