// Cadastro Usuário

const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const session = require('express-session');





const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public')); // Serve os arquivos HTML/CSS/JS

// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // coloque o seu usuário
  password: '', // sua senha do MySQL
  database: 'bd_agenda_contatos'
});

// Sessão - Coloque isso logo após o app ser criado e antes das rotas
app.use(session({
  secret: 'secreto_super_seguro',
  resave: false,
  saveUninitialized: true
}));


// Armazenamento de imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post('/cadastro', upload.single('imagem'), (req, res) => {

    console.log('Requisição recebida!');
    console.log('Body:', req.body);       // 👀 Verifique os campos do formulário
    console.log('File:', req.file);       // 👀 Verifique a imagem recebida

    const { nome, email, senha, confirmar_senha } = req.body;

    if (senha !== confirmar_senha) {
        return res.status(400).json({ erro: 'As senhas não coincidem.' });
    }

    const imagem = req.file.filename;

    const sql = "INSERT INTO tb_usuarios (nome, email, senha, imagem) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, email, senha, imagem], (err, result) => {
        if (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro ao salvar no banco de dados.' });
        }
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    });
});


// Login

const bodyParser = require('body-parser');



// Rota de login
app.post('/login', (req, res) => {

  const { email, password } = req.body;
  const senha = password;


  console.log('Email recebido:', email);
  console.log('Senha recebida:', password);

  const query = 'SELECT * FROM tb_usuarios WHERE LOWER(email) = LOWER(?) AND senha = ?';

  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro na consulta: ', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      const usuario = results[0];
      req.session.usuario_id = usuario.id;
      req.session.usuario_imagem = usuario.imagem; // ⬅️ Salva o nome da imagem
    
      res.json({ 
        success: true, 
        message: 'Login bem-sucedido!', 
        usuario_id: usuario.id,
        imagem: `/uploads/${usuario.imagem}` // também pode retornar pro frontend se quiser
      });
    
    }else {
      res.status(401).json({ success: false, message: 'Email ou senha incorretos.' });
    }
    
  });
});

//Cadastrar Contatos
// Rota POST para processar o formulário
app.post('/cadastrar-contato', (req, res) => {

  console.log("req.body:", req.body); // 👀 Veja o que está chegando

  const { nome, email, telefone, usuario_id } = req.body;

  if (!nome || !email || !telefone || !usuario_id) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const sql = "INSERT INTO tb_contatos (nome, email, telefone, usuario_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome, email, telefone, usuario_id], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar contato:', err);
      return res.status(500).send('Erro ao cadastrar contato.');
    }

    return res.status(201).send('Contato cadastrado com sucesso!');
  });
});


//Fazer logout

// Rota de logout
app.get('/logout', (req, res) => {
  if (req.session) {
    console.log('Sessão atual:', req.session);
    // Destrói a sessão do usuário
    req.session.destroy(err => {
      if (err) {
        console.error('Erro ao destruir sessão:', err);
        return res.status(500).send('Erro ao sair');
      }
      res.redirect('/'); // ou res.redirect('/login');
    });
  } else {
    res.redirect('/'); // ou uma página de login
  }
});



//Listar dados na Dashboard


//Listar contatos para edição
// Rota para buscar todos os contatos
app.get('/contatos', (req, res) => {
  db.query('SELECT * FROM tb_contatos ORDER BY nome ASC', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Rota para alterar dados do contato

// Buscar contato por ID
app.get('/contatos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tb_contatos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar contato por ID:', err);
      return res.status(500).send('Erro no servidor');
    }
    if (results.length === 0) {
      return res.status(404).send('Contato não encontrado');
    }
    res.json(results[0]);
  });
});

// Rota para atualizar o contato
// Atualizar contato
app.put('/contatos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  const sql = 'UPDATE tb_contatos SET nome = ?, email = ?, telefone = ?, atualizado_em = NOW() WHERE id = ?';
  db.query(sql, [nome, email, telefone, id], (err, result) => {
  
    if (err) {
      console.error('Erro ao atualizar contato:', err);
      return res.status(500).send('Erro ao atualizar contato');
    }
    res.send('Contato atualizado com sucesso!');
  });
});


// Rota para deletar contato
// Excluir contato e registrar exclusão
app.delete('/contatos/:id', (req, res) => {
  const { id } = req.params;

  // 1. Deleta o contato
  db.query('DELETE FROM tb_contatos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir contato:', err);
      return res.status(500).send('Erro ao excluir contato');
    }

    // 2. Registra a exclusão
    db.query('INSERT INTO tb_contatos_excluidos (contato_id) VALUES (?)', [id], (err2) => {
      if (err2) {
        console.error('Erro ao registrar exclusão:', err2);
        return res.status(500).send('Erro ao registrar exclusão');
      }

      // 3. Conta quantos foram excluídos no total
      db.query('SELECT COUNT(*) AS totalExcluidos FROM tb_contatos_excluidos', (err3, result3) => {
        if (err3) {
          console.error('Erro ao contar excluídos:', err3);
          return res.status(500).send('Erro ao contar contatos excluídos');
        }

        const totalExcluidos = result3[0].totalExcluidos;
        res.json({ mensagem: 'Contato excluído com sucesso!', totalExcluidos });
      });
    });
  });
});




// Rota para buscar dados do perfil do usuário logado
app.get('/perfil', (req, res) => {
  const usuarioId = req.session.usuario_id;
  if (!usuarioId) {
    return res.status(401).json({ erro: 'Usuário não autenticado.' });
  }

  const sql = 'SELECT * FROM tb_usuarios WHERE id = ?';
  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    res.json(results[0]);
  });
});

// Rota para atualizar os dados do perfil
app.post('/atualizar-usuario', upload.single('fotoPerfil'), (req, res) => {
  const usuarioId = req.session.usuario_id;
  const { nome, email, senha } = req.body;
  const novaImagem = req.file ? req.file.filename : null;

  let sql = 'UPDATE tb_usuarios SET nome = ?, email = ?, senha = ?';
  const params = [nome, email, senha];

  if (novaImagem) {
    sql += ', imagem = ?';
    params.push(novaImagem);
  }

  sql += ' WHERE id = ?';
  params.push(usuarioId);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
    res.json({ mensagem: 'Dados atualizados com sucesso!' });
  });
});


//Listar dados do usuario cadastrado

// Rota para listar os 8 usuários mais recentes
app.get('/api/usuarios-recentes', (req, res) => {
  const sql = `
    SELECT nome, email, imagem 
    FROM tb_usuarios 
    ORDER BY id DESC 
    LIMIT 8
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários recentes:', err);
      return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }

    const usuarios = results.map(usuario => ({
      nome: usuario.nome,
      email: usuario.email,
      foto: `/uploads/${usuario.imagem}`
    }));

    res.json(usuarios);
  });
});


//Listar contatos cadastrados recentemente
app.get('/api/contatos-recentes', (req, res) => {
  const sql = `
    SELECT nome, email, telefone 
    FROM tb_contatos 
    ORDER BY id DESC 
    LIMIT 8
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar contatos recentes:', err);
      return res.status(500).json({ erro: 'Erro ao buscar contatos.' });
    }

    res.json(results);
  });
});

//Listar total de usuários
// Rota para contar o total de usuários
app.get('/api/total-usuarios', (req, res) => {
  const sql = 'SELECT COUNT(*) AS total FROM tb_usuarios';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao contar usuários:', err);
      return res.status(500).json({ erro: 'Erro ao contar usuários.' });
    }

    res.json({ total: results[0].total });
  });
});

//Listar total de contatos
// Rota para contar o total de contatos
app.get('/api/total-contatos', (req, res) => {
  const sql = 'SELECT COUNT(*) AS total FROM tb_contatos';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao contar contatos:', err);
      return res.status(500).json({ erro: 'Erro ao contar contatos.' });
    }

    res.json({ total: results[0].total });
  });
});

//Total de contatos atualizados
app.get('/api/total-contatos-atualizados', (req, res) => {
  const sql = 'SELECT COUNT(*) AS total FROM tb_contatos WHERE atualizado_em IS NOT NULL';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao contar contatos atualizados:', err);
      return res.status(500).json({ erro: 'Erro ao contar contatos atualizados.' });
    }

    res.json({ total: results[0].total });
  });
});


//Total contatos excluidos
app.get('/api/total-contatos-excluidos', (req, res) => {
  const sql = 'SELECT COUNT(*) AS total FROM tb_contatos WHERE excluido = 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar total de contatos excluídos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar total de excluídos' });
    }
    res.json({ total: results[0].total });
  });
});


app.get('/total-contatos-excluidos', (req, res) => {
  db.query('SELECT COUNT(*) AS totalExcluidos FROM tb_contatos_excluidos', (err, result) => {
    if (err) return res.status(500).send('Erro ao buscar total');
    res.json({ totalExcluidos: result[0].totalExcluidos });
  });
});

//Rota de buscar Contatos pelo nome
app.get('/buscar-contato', (req, res) => {
  const nomeBuscado = req.query.nome;

  if (!nomeBuscado) {
    return res.status(400).json({ erro: 'Parâmetro "nome" é obrigatório.' });
  }

  const query = `
    SELECT id, nome, email, telefone 
    FROM tb_contatos 
    WHERE nome LIKE ?
    ORDER BY id DESC
  `;
  const valores = [`%${nomeBuscado}%`];

  db.query(query, valores, (err, resultados) => {
    if (err) {
      console.error('Erro ao buscar contatos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar contatos.' });
    }

    res.json(resultados);
  });
});

// Para rodar os testes TDD - npx jest
module.exports = app;

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});





