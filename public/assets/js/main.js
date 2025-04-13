// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

/*document.getElementById("Dash").addEventListener("click", function(){
  window.location.href = "Dashboard.html"; 
});

document.getElementById("Perfil").addEventListener("click", function(){
  window.location.href = "Perfil.html"; 
});

document.getElementById("Contatos").addEventListener("click", function(){
  window.location.href = "Gerenciar_Contatos.html"; 
});*/


//Listar na Dashboard

//Recentes usuários cadastrados
async function carregarUsuariosRecentes() {
  const response = await fetch('/api/usuarios-recentes');
  const usuarios = await response.json();

  const tabelaUsuarios = document.querySelector('.recentCustomers table');
  tabelaUsuarios.innerHTML = ''; // limpar usuários fixos

  usuarios.forEach(usuario => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
          <td width="60px">
              <div class="imgBx">
                  <img src="${usuario.foto}" alt="">
              </div>
          </td>
          <td>
              <h4>${usuario.nome} <br> <span>${usuario.email}</span></h4>
          </td>
      `;

      tabelaUsuarios.appendChild(linha);
  });
}

carregarUsuariosRecentes();


//Recentes Contatos Cadastrados
async function carregarContatosRecentes() {
  const response = await fetch('/api/contatos-recentes');
  const contatos = await response.json();

  const tabelaContatos = document.querySelector('.recentContatos tbody');
  tabelaContatos.innerHTML = ''; // Limpa os dados fixos

  contatos.forEach(contato => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.email}</td>
      <td>${contato.telefone}</td>
    `;

    tabelaContatos.appendChild(linha);
  });
}

// Chamar a função assim que a página carregar
carregarContatosRecentes();


//Total de Usuários
async function carregarTotalUsuarios() {
  const response = await fetch('/api/total-usuarios');
  const data = await response.json();

  const elementoTotalUsuarios = document.querySelector('#totalUsuarios');
  if (elementoTotalUsuarios) {
    elementoTotalUsuarios.textContent = data.total;
  }
}

carregarTotalUsuarios();


//Total de Contatos
async function carregarTotalContatos() {
  const response = await fetch('/api/total-contatos');
  const data = await response.json();

  const elementoTotalContatos = document.querySelector('#totalContatos');
  if (elementoTotalContatos) {
    elementoTotalContatos.textContent = data.total;
  }
}

carregarTotalContatos();


//Total de Contatos Atualizados
async function carregarTotalContatosAtualizados() {
  const response = await fetch('/api/total-contatos-atualizados');
  const data = await response.json();

  const elemento = document.querySelector('#totalContatosAtualizados');
  if (elemento) {
    elemento.textContent = data.total;
  }
}

carregarTotalContatosAtualizados();


//Total de Contatos Excluídos
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.excluir-contato').forEach(botao => {
    botao.addEventListener('click', function () {
      const contatoId = this.getAttribute('data-id');

      fetch(`/contatos/${contatoId}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        alert(data.mensagem);

        // Atualiza contador na dashboard
        document.getElementById('total-contatos-excluidos').innerText = data.totalExcluidos;

        // Remove contato da interface
        this.closest('.linha-contato').remove();
      })
      .catch(error => {
        console.error('Erro ao excluir contato:', error);
      });
    });
  });
});

fetch('/total-contatos-excluidos')
  .then(res => res.json())
  .then(data => {
    document.getElementById('total-contatos-excluidos').innerText = data.totalExcluidos;
  });


//Login para inserir a foto do usuário
// Chama rota para buscar dados do usuário logado
fetch('/perfil')
  .then(response => response.json())
  .then(usuario => {
    const foto = usuario.imagem 
      ? `/uploads/${usuario.imagem}` 
      : 'assets/imgs/default.jpg';

    document.getElementById('foto-usuario').src = foto;
  })
  .catch(error => {
    console.error('Erro ao buscar dados do perfil:', error);
  });



