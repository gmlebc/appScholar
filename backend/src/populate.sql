-- Limpar dados antigos
DELETE FROM avisos;
DELETE FROM notas;
DELETE FROM disciplinas;
DELETE FROM alunos;
DELETE FROM professores;
DELETE FROM usuarios WHERE email != 'teste@teste.com';

-- Inserir Usuários
INSERT INTO usuarios (nome, email, senha, perfil, "createdAt", "updatedAt") VALUES
('Andre Olimpio', 'andre.olimpio@scholar.com', 'prof123', 'professor', NOW(), NOW()),
('Neymar Siqueira', 'neymar.siqueira@scholar.com', 'prof123', 'professor', NOW(), NOW()),
('Lucineide Nunes', 'lucineide.nunes@scholar.com', 'prof123', 'professor', NOW(), NOW()),
('Leandro Hoffman', 'leandro.hoffman@scholar.com', 'prof123', 'professor', NOW(), NOW()),
('João Pedro Oliveira', 'joao.oliveira@scholar.com', 'aluno123', 'aluno', NOW(), NOW()),
('Maria Clara Souza', 'maria.souza@scholar.com', 'aluno123', 'aluno', NOW(), NOW()),
('Pedro Henrique Costa', 'pedro.costa@scholar.com', 'aluno123', 'aluno', NOW(), NOW()),
('Julia Fernandes', 'julia.fernandes@scholar.com', 'aluno123', 'aluno', NOW(), NOW()),
('Lucas Mendes', 'lucas.mendes@scholar.com', 'aluno123', 'aluno', NOW(), NOW());

-- Inserir Professores
INSERT INTO professores (nome, matricula, titulacao, "tempoDocencia", "areaAtuacao", email, "createdAt", "updatedAt") VALUES
('Andre Olimpio', 'PROF001', 'Doutor', 15, 'Engenharia de Software', 'andre.olimpio@scholar.com', NOW(), NOW()),
('Neymar Siqueira', 'PROF002', 'Especialista', 12, 'Desenvolvimento Web', 'neymar.siqueira@scholar.com', NOW(), NOW()),
('Lucineide Nunes', 'PROF003', 'Mestre', 10, 'Banco de Dados', 'lucineide.nunes@scholar.com', NOW(), NOW()),
('Leandro Hoffman', 'PROF004', 'Doutor', 20, 'Inteligencia Artificial', 'leandro.hoffman@scholar.com', NOW(), NOW());

-- Inserir Alunos
INSERT INTO alunos (nome, matricula, curso, "createdAt", "updatedAt") VALUES
('Joao Pedro Oliveira', '20240001', 'Engenharia de Software', NOW(), NOW()),
('Maria Clara Souza', '20240002', 'Ciencia da Computacao', NOW(), NOW()),
('Pedro Henrique Costa', '20240003', 'Analise de Sistemas', NOW(), NOW()),
('Julia Fernandes', '20240004', 'Sistemas de Informacao', NOW(), NOW()),
('Lucas Mendes', '20240005', 'Engenharia de Computacao', NOW(), NOW());

-- Inserir Disciplinas (usando IDs sequenciais)
INSERT INTO disciplinas (nome, "cargaHoraria", "professorId", "createdAt", "updatedAt") 
SELECT 'Engenharia de Software II', 60, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF001'
UNION ALL
SELECT 'Programacao de Dispositivos Moveis I', 80, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF001'
UNION ALL
SELECT 'Desenvolvimento Web II', 60, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF002'
UNION ALL
SELECT 'Laboratorio de Desenvolvimento Web', 80, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF002'
UNION ALL
SELECT 'Banco de Dados II', 60, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF003'
UNION ALL
SELECT 'Integracao e Entrega Continua', 60, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF003'
UNION ALL
SELECT 'Internet das Coisas', 60, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF004'
UNION ALL
SELECT 'Aprendizado de Maquina', 60, id, NOW(), NOW() FROM professores WHERE matricula = 'PROF004';

-- Inserir Notas
INSERT INTO notas ("alunoId", "disciplinaId", nota1, nota2, nota3, nota4, nota5, media, situacao, "createdAt", "updatedAt")
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240001'),
    (SELECT id FROM disciplinas WHERE nome = 'Engenharia de Software II'),
    8.5, 7.0, 9.0, 8.0, 7.5, 8.0, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240001'),
    (SELECT id FROM disciplinas WHERE nome = 'Banco de Dados II'),
    6.0, 5.5, 7.0, 6.5, 6.0, 6.2, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240002'),
    (SELECT id FROM disciplinas WHERE nome = 'Engenharia de Software II'),
    9.0, 8.5, 9.5, 8.0, 9.0, 8.8, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240002'),
    (SELECT id FROM disciplinas WHERE nome = 'Internet das Coisas'),
    7.5, 8.0, 7.0, 8.5, 7.0, 7.6, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240003'),
    (SELECT id FROM disciplinas WHERE nome = 'Programacao de Dispositivos Moveis I'),
    4.0, 5.0, 3.5, 4.5, 5.0, 4.4, 'Reprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240003'),
    (SELECT id FROM disciplinas WHERE nome = 'Integracao e Entrega Continua'),
    6.5, 7.0, 6.0, 6.5, 7.0, 6.6, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240004'),
    (SELECT id FROM disciplinas WHERE nome = 'Banco de Dados II'),
    8.0, 8.5, 7.5, 9.0, 8.0, 8.2, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240004'),
    (SELECT id FROM disciplinas WHERE nome = 'Integracao e Entrega Continua'),
    5.5, 6.0, 5.0, 4.5, 6.0, 5.4, 'Reprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240005'),
    (SELECT id FROM disciplinas WHERE nome = 'Programacao de Dispositivos Moveis I'),
    9.5, 9.0, 8.5, 9.0, 9.5, 9.1, 'Aprovado', NOW(), NOW()
UNION ALL
SELECT 
    (SELECT id FROM alunos WHERE matricula = '20240005'),
    (SELECT id FROM disciplinas WHERE nome = 'Aprendizado de Maquina'),
    8.0, 7.5, 8.5, 7.0, 8.0, 7.8, 'Aprovado', NOW(), NOW();

-- Inserir Avisos
INSERT INTO avisos (titulo, mensagem, tipo, "autorId", "dataCriacao", "createdAt", "updatedAt") VALUES
('Inicio das Aulas', 'Bem-vindos ao semestre 2024.2! As aulas iniciam na proxima segunda-feira. Fiquem atentos aos horarios.', 'geral', 
    (SELECT id FROM usuarios WHERE email = 'andre.olimpio@scholar.com'), NOW(), NOW(), NOW()),
('Prazo de Matricula', 'Lembrete: O prazo para matricula em disciplinas optativas termina em 05/12/2025. Nao perca o prazo!', 'lembrete',
    (SELECT id FROM usuarios WHERE email = 'andre.olimpio@scholar.com'), NOW() - INTERVAL '2 days', NOW(), NOW()),
('Manutencao no Sistema', 'O sistema academico passara por manutencao no dia 10/12/2025 das 00h as 06h. Planeje suas atividades.', 'comunicado',
    (SELECT id FROM usuarios WHERE email = 'neymar.siqueira@scholar.com'), NOW() - INTERVAL '1 day', NOW(), NOW()),
('Prova de Banco de Dados II', 'A prova de Banco de Dados II sera realizada no dia 15/12/2025. Estudem os capitulos 5 a 8.', 'aviso',
    (SELECT id FROM usuarios WHERE email = 'lucineide.nunes@scholar.com'), NOW(), NOW(), NOW()),
('Semana de Tecnologia', 'Nos dias 20 a 24/12 teremos a Semana de Tecnologia com palestras e workshops. Inscricoes abertas!', 'geral',
    (SELECT id FROM usuarios WHERE email = 'leandro.hoffman@scholar.com'), NOW(), NOW(), NOW());
