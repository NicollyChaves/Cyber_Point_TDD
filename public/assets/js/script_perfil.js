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



//Formulario para alterar dados do perfil

// Mostrar dados do usuário logado ao carregar a página
window.onload = () => {
  fetch('/perfil')
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert(data.erro);
        return;
      }

      // Atualiza os dados visuais
      document.querySelector('.profile-name').textContent = data.nome;
      document.querySelector('.profile-bio strong').textContent = "Email:";
      document.querySelectorAll('.profile-bio')[0].innerHTML = `<strong>Email:</strong> ${data.email}`;
      document.querySelectorAll('.profile-bio')[1].innerHTML = `<strong>Senha:</strong> ${data.senha}`;
      document.getElementById('fotoAtual').src = data.imagem ? `/uploads/${data.imagem}` : 'assets/imgs/customer01.jpg';

      // Preenche o formulário
      document.getElementById('nome').value = data.nome;
      document.getElementById('email').value = data.email;
      document.getElementById('senha').value = data.senha;
    });
};

// Mostrar formulário de edição
// Alternar visibilidade do formulário
// Alternar visibilidade do formulário + texto do botão
const editBtn = document.getElementById("editProfileBtn");

editBtn.addEventListener("click", () => {
  const form = document.getElementById("editProfileForm");
  const isHidden = form.style.display === "none" || form.style.display === "";

  form.style.display = isHidden ? "block" : "none";
  editBtn.textContent = isHidden ? "Cancelar Edição" : "Editar Perfil";
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

