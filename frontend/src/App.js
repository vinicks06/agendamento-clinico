import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import DashboardHome from './components/DashboardHome';
import PacienteController from './components/Pacientes/PacienteController';
import PacienteForm from './components/Pacientes/PacienteForm';
import MedicoController from './components/Medicos/MedicoController';
import MedicoForm from './components/Medicos/MedicoForm';
import AgendamentoController from './components/Agendamentos/AgendamentoController';
import AgendamentoForm from './components/Agendamentos/AgendamentoForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rotas Protegidas com Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardHome />} />
          
          <Route path="/pacientes" element={<PacienteController />} />
          <Route path="/pacientes/novo" element={<PacienteForm />} />
          <Route path="/pacientes/editar/:id" element={<PacienteForm />} />
          
          <Route path="/medicos" element={<MedicoController />} />
          <Route path="/medicos/novo" element={<MedicoForm />} />
          <Route path="/medicos/editar/:id" element={<MedicoForm />} />

          <Route path="/agendamentos" element={<AgendamentoController />} />
          <Route path="/agendamentos/novo" element={<AgendamentoForm />} />
          
          {/* Adicione rotas de atendimento aqui quando prontas */}
          {/* <Route path="/atendimentos" element={<AtendimentoList />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;