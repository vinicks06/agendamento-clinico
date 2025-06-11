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
  console.log(`Médico ${nome} com especialidade ${especialidade} adicionado com sucesso!`)
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
  const { nome, email, telefone} = req.body;
  if (!nome || !telefone || !email)
    return res.status(400).json({ msg: 'Nome, email e telefone são obrigatórios' });

  const id = pacientes.length + 1;
  const paciente = { id, nome, email, telefone };
  pacientes.push(paciente);
  console.log(`Paciente ${nome} com email ${email} adicionado com sucesso!`)
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
  // Alterado para 'medico_id' e 'paciente_id'
  const { medico_id, paciente_id, data, horario } = req.body; // Aceita 'data' e 'horario' separados
  
  // Validação para os novos campos
  if (!medico_id || !paciente_id || !data || !horario)
  return res.status(400).json({ msg: 'Médico, paciente, data e horário são obrigatórios' });
  
  // Combina data e horário em um único campo 'dataHora' para o armazenamento interno
  const dataHoraCombinada = `${data}T${horario}:00`; // Formato ISO 8601: "YYYY-MM-DDTHH:mm:ss"
  
  // Verificar conflito de horário para o mesmo médico
  // Usando 'medico_id' e 'dataHoraCombinada'
  const conflito = agendamentos.find(a => a.medicoId === medico_id && a.dataHora === dataHoraCombinada);
  if (conflito) return res.status(409).json({ msg: 'Horário já agendado para esse médico' });
  
  const id = agendamentos.length + 1;
  // Altera como o objeto agendamento é criado para usar os novos nomes de campo
  const agendamento = {
      id,
      medicoId: medico_id, // Mapeia para medicoId
      pacienteId: paciente_id, // Mapeia para pacienteId
      dataHora: dataHoraCombinada // Armazena a data e hora combinadas
    };
  agendamentos.push(agendamento);
  
  // Simula envio de notificação
  console.log(`Lembrete: Paciente ${paciente_id}, consulta com médico ${medico_id} marcada para ${dataHoraCombinada}`);
  
  res.status(201).json(agendamento);
  });
  
  app.put('/agendamentos/:id', autenticarToken, (req, res) => {
  const id = Number(req.params.id);
  const agendamento = agendamentos.find(a => a.id === id);
  if (!agendamento) return res.status(404).json({ msg: 'Agendamento não encontrado' });
  
  // Alterado para 'medico_id', 'paciente_id', 'data' e 'horario'
  const { medico_id, paciente_id, data, horario } = req.body;
  
  let novaDataHora = agendamento.dataHora;
  
  // Se data ou horário forem fornecidos, combina-os
  if (data || horario) {
   const dataParaCombinar = data || agendamento.dataHora.split('T')[0];
   const horarioParaCombinar = horario ? `${horario}:00` : agendamento.dataHora.split('T')[1];
  novaDataHora = `${dataParaCombinar}T${horarioParaCombinar}`;
  }
  
  
  // Verifica conflito no novo horário
  // Usando 'medico_id' (se fornecido) e 'novaDataHora'
  if (medico_id && novaDataHora) {
  const conflito = agendamentos.find(
  a => a.medicoId === medico_id && a.dataHora === novaDataHora && a.id !== id
  );
  if (conflito) return res.status(409).json({ msg: 'Horário já agendado para esse médico' });
  }
  
  if (medico_id) agendamento.medicoId = medico_id;
  if (paciente_id) agendamento.pacienteId = paciente_id;
  if (novaDataHora) agendamento.dataHora = novaDataHora;
  
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
