import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PacienteList from './components/Pacientes/PacienteList';
import PacienteForm from './components/Pacientes/PacienteForm';
import MedicoList from './components/Medicos/MedicoList';
import MedicoForm from './components/Medicos/MedicoForm';
import AgendamentoList from './components/Agendamentos/AgendamentoList';
import AgendamentoForm from './components/Agendamentos/AgendamentoForm';
import ProtectedRoute from './components/ProtectedRoute';
import AtendimentoList from './components/Atendimentos/AtendimentoList';
import AtendimentoDetalhe from './components/Atendimentos/AtendimentoDetalhe';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/pacientes" element={<ProtectedRoute><PacienteList /></ProtectedRoute>} />
        <Route path="/pacientes/novo" element={<PacienteForm />} />
        <Route path="/pacientes/editar/:id" element={<PacienteForm />} />
        <Route path="/medicos" element={<ProtectedRoute><MedicoList /></ProtectedRoute>} />
        <Route path="/medicos/novo" element={<MedicoForm />} />
        <Route path="/agendamentos" element={<ProtectedRoute><AgendamentoList /></ProtectedRoute>} />
        <Route path="/agendamentos/novo" element={<ProtectedRoute><AgendamentoForm /></ProtectedRoute>} />
        <Route path="/atendimentos" element={<ProtectedRoute><AtendimentoList /></ProtectedRoute>} />
        <Route path="/atendimentos/:id" element={<ProtectedRoute><AtendimentoDetalhe /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
