import React, { useState } from 'react';
import api from '../../services/api';
// Importa useNavigate do react-router-dom para redirecionamento
import { useNavigate } from 'react-router-dom';

// Remove a prop 'onPacienteAdicionado' da desestruturação
const PacienteForm = () => {
  // Inicializa o hook de navegação
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pacientes', formData);
      // Após o sucesso do cadastro, navega para a página de listagem de pacientes
      navigate('/pacientes');
      
      // Limpa o formulário após o envio bem-sucedido
      setFormData({ nome: '', email: '', telefone: '' });
      
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
      // Opcional: Adicione um feedback visual para o usuário em caso de erro
      // Por exemplo, usando um estado para exibir uma mensagem de erro na UI
      alert('Ocorreu um erro ao cadastrar o paciente. Verifique o console para detalhes.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">➕ Novo Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-700 font-medium mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Cadastrar Paciente
        </button>
      </form>
    </div>
  );
};

export default PacienteForm;
