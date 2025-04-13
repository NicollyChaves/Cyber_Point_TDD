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

document.getElementById("Dash").addEventListener("click", function(){
  window.location.href = "Dashboard.html"; 
});

document.getElementById("Perfil").addEventListener("click", function(){
  window.location.href = "Perfil.html"; 
});

document.getElementById("Gerenciar_Contatos").addEventListener("click", function(){
  window.location.href = "Gerenciar_Contatos.html"; 
});

document.getElementById("Cadastrar_Contatos").addEventListener("click", function(){
  window.location.href = "Cadastrar_Contatos.html"; 
});

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


//Cadastrar contato

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    const usuarioId = localStorage.getItem('usuario_id');
    if (usuarioId) {
      document.getElementById('usuario_id').value = usuarioId;
    }
  
    form.addEventListener('submit', function (event) {
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const telefone = form.telefone.value.trim();
  
      if (!nome || !email || !telefone) {
        alert('Por favor, preencha todos os campos!');
        event.preventDefault(); // Impede envio do formulário
      }
    });
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
