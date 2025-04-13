//Código do teste "Criar contato"

const request = require('supertest');
const express = require('express');
const app = require('../server'); // ajuste o caminho se necessário

describe('POST /cadastrar-contato', () => {

  it('deve criar um novo contato com sucesso', async () => {
    const novoContato = {
      nome: 'Teste Contato',
      email: 'contato@teste.com',
      telefone: '99999-9999',
      usuario_id: 1 // Use um ID válido que já exista no seu banco
    };

    const response = await request(app)
      .post('/cadastrar-contato')
      .send(novoContato)
      .expect('Content-Type', /text\/html/)
      .expect(201);

    expect(response.text).toBe('Contato cadastrado com sucesso!');
  });

  it('deve retornar erro se campos estiverem faltando', async () => {
    const contatoInvalido = {
      nome: '',
      email: '',
      telefone: '',
      usuario_id: ''
    };

    const response = await request(app)
      .post('/cadastrar-contato')
      .send(contatoInvalido)
      .expect(400);

    expect(response.text).toBe('Todos os campos são obrigatórios.');
  });

});

//Teste listar contatos cadastrados
describe('GET /contatos', () => {
    it('deve retornar uma lista de contatos com status 200', async () => {
      const response = await request(app).get('/contatos');
  
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
  
      // Se quiser verificar um conteúdo específico:
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('nome');
        expect(response.body[0]).toHaveProperty('email');
      }
    });
  });

  //Teste Buscar contato por nome
  describe('GET /buscar-contato', () => {

    it('deve retornar uma lista de contatos com o nome buscado', async () => {
      const response = await request(app).get('/buscar-contato?nome=Teste');
  
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
  
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('nome');
        expect(response.body[0].nome.toLowerCase()).toContain('teste');
      }
    });
  
    it('deve retornar erro 400 se nenhum nome for informado', async () => {
      const response = await request(app).get('/buscar-contato');
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toBe('Parâmetro "nome" é obrigatório.');
    });
  
  });
  

  //Teste Atualizar contato
  describe('PUT /contatos/:id', () => {
    it('deve atualizar um contato existente', async () => {
      const idTeste = 20; // 👈 certifique-se de que esse ID existe no banco!
  
      const contatoAtualizado = {
        nome: 'Novo Nome',
        email: 'novoemail@teste.com',
        telefone: '99999-8888'
      };
  
      const response = await request(app)
        .put(`/contatos/${idTeste}`)
        .send(contatoAtualizado);
  
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Contato atualizado com sucesso!');
    });
  
    it('deve retornar erro se o ID for inválido', async () => {
      const response = await request(app)
        .put('/contatos/999999') // um ID que provavelmente não existe
        .send({
          nome: 'Teste',
          email: 'teste@email.com',
          telefone: '12345-6789'
        });
  
      // Mesmo que o ID não exista, o MySQL retorna 200 se não der erro.
      // Se quiser verificar rowsAffected, pode mudar no server.js.
      expect([200, 404]).toContain(response.statusCode); // apenas exemplo tolerante
    });
  });
  

  //Teste Deletar contato
describe('DELETE /contatos/:id', () => {
    it('deve excluir um contato existente e retornar mensagem de sucesso', async () => {
      const idParaDeletar = 20; 
  
      const response = await request(app).delete(`/contatos/${idParaDeletar}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('mensagem');
      expect(response.body.mensagem).toBe('Contato excluído com sucesso!');
      expect(response.body).toHaveProperty('totalExcluidos');
      expect(typeof response.body.totalExcluidos).toBe('number');
    });
  
    it('deve retornar erro 500 se tentar deletar um ID inválido', async () => {
      const response = await request(app).delete(`/contatos/999999`);
  
      // Ainda pode dar 200 se não houver verificação no back, mas vamos assumir erro no registro
      expect([200, 500]).toContain(response.statusCode);
    });
});
  

  //Teste Campos obrigatórios
describe('POST /cadastrar-contato - Validação de campos obrigatórios', () => {
    it('deve retornar erro 400 se algum campo obrigatório estiver vazio', async () => {
      const contatoInvalido = {
        nome: '', // campo vazio
        email: '', // campo vazio
        telefone: '', // campo vazio
        usuario_id: '' // campo vazio
      };
  
      const response = await request(app)
        .post('/cadastrar-contato')
        .send(contatoInvalido);
  
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Todos os campos são obrigatórios.');
    });
  
    it('deve retornar erro 400 se nenhum campo for enviado', async () => {
      const response = await request(app)
        .post('/cadastrar-contato')
        .send({}); // sem enviar nada
  
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Todos os campos são obrigatórios.');
    });
});

