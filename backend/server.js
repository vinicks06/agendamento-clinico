const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'segredo_supersecreto';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dados fake na memória
let medicos = [];
let pacientes = [];
let agendamentos = [];

// Usuário fixo
const usuario = {
  username: 'secretaria',
  password: '123456',
};

// Função para gerar token JWT
function gerarToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
}

// Middleware para proteger rotas
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token inválido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Token expirado ou inválido' });
    req.user = user;
    next();
  });
}

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === usuario.username && password === usuario.password) {
    const token = gerarToken(username);
    return res.json({ token });
  }

  return res.status(401).json({ msg: 'Usuário ou senha inválidos' });
});

// CRUD MÉDICOS
app.get('/medicos', autenticarToken, (req, res) => {
  res.json(medicos);
});

app.post('/medicos', autenticarToken, (req, res) => {
  const { nome, especialidade } = req.body;
  if (!nome || !especialidade)
    return res.status(400).json({ msg: 'Nome e especialidade são obrigatórios' });

  const id = medicos.length + 1;
  const medico = { id, nome, especialidade };
  medicos.push(medico);
  res.status(201).json(medico);
});

app.put('/medicos/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  const medico = medicos.find(m => m.id === id);
  if (!medico) return res.status(404).json({ msg: 'Médico não encontrado' });

  const { nome, especialidade } = req.body;
  if (nome) medico.nome = nome;
  if (especialidade) medico.especialidade = especialidade;

  res.json(medico);
});

app.delete('/medicos/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  medicos = medicos.filter(m => m.id !== id);
  agendamentos = agendamentos.filter(a => a.medicoId !== id); // Remove agendamentos do médico excluído
  res.json({ msg: 'Médico excluído' });
});

// CRUD PACIENTES
app.get('/pacientes', autenticarToken, (req, res) => {
  res.json(pacientes);
});

app.post('/pacientes', autenticarToken, (req, res) => {
  const { nome, telefone } = req.body;
  if (!nome || !telefone)
    return res.status(400).json({ msg: 'Nome e telefone são obrigatórios' });

  const id = pacientes.length + 1;
  const paciente = { id, nome, telefone };
  pacientes.push(paciente);
  res.status(201).json(paciente);
});

app.put('/pacientes/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find(p => p.id === id);
  if (!paciente) return res.status(404).json({ msg: 'Paciente não encontrado' });

  const { nome, telefone } = req.body;
  if (nome) paciente.nome = nome;
  if (telefone) paciente.telefone = telefone;

  res.json(paciente);
});

app.delete('/pacientes/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  pacientes = pacientes.filter(p => p.id !== id);
  agendamentos = agendamentos.filter(a => a.pacienteId !== id); // Remove agendamentos do paciente excluído
  res.json({ msg: 'Paciente excluído' });
});

// CRUD AGENDAMENTOS
app.get('/agendamentos', autenticarToken, (req, res) => {
  res.json(agendamentos);
});

app.post('/agendamentos', autenticarToken, (req, res) => {
  const { medicoId, pacienteId, dataHora } = req.body;
  if (!medicoId || !pacienteId || !dataHora)
    return res.status(400).json({ msg: 'Médico, paciente e data/hora são obrigatórios' });

  // Verificar conflito de horário para o mesmo médico
  const conflito = agendamentos.find(a => a.medicoId === medicoId && a.dataHora === dataHora);
  if (conflito) return res.status(409).json({ msg: 'Horário já agendado para esse médico' });

  const id = agendamentos.length + 1;
  const agendamento = { id, medicoId, pacienteId, dataHora };
  agendamentos.push(agendamento);

  // Simula envio de notificação
  console.log(`Lembrete: Paciente ${pacienteId}, consulta com médico ${medicoId} marcada para ${dataHora}`);

  res.status(201).json(agendamento);
});

app.put('/agendamentos/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  const agendamento = agendamentos.find(a => a.id === id);
  if (!agendamento) return res.status(404).json({ msg: 'Agendamento não encontrado' });

  const { medicoId, pacienteId, dataHora } = req.body;

  // Verifica conflito no novo horário
  if (medicoId && dataHora) {
    const conflito = agendamentos.find(
      a => a.medicoId === medicoId && a.dataHora === dataHora && a.id !== id
    );
    if (conflito) return res.status(409).json({ msg: 'Horário já agendado para esse médico' });
  }

  if (medicoId) agendamento.medicoId = medicoId;
  if (pacienteId) agendamento.pacienteId = pacienteId;
  if (dataHora) agendamento.dataHora = dataHora;

  res.json(agendamento);
});

app.delete('/agendamentos/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  agendamentos = agendamentos.filter(a => a.id !== id);
  res.json({ msg: 'Agendamento cancelado' });
});

// Start
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
