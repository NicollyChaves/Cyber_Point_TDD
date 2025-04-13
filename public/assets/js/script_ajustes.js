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


//Listar contatos

// Mostrar detalhes
function mostrarDetalhes(nome, email, telefone) {
    document.getElementById("detalhe-nome").innerText = nome;
    document.getElementById("detalhe-email").innerText = email;
    document.getElementById("detalhe-telefone").innerText = telefone;
    document.getElementById("detalhes-contato").style.display = "block";
  }
  
  // Fechar detalhes
function fecharDetalhes() {
    document.getElementById("detalhes-contato").style.display = "none";
}
  
  // Visualizar contato
function viewContact(id) {
    fetch(`http://localhost:3000/contatos`)
      .then(res => res.json())
      .then(data => {
        const contato = data.find(c => c.id == id);
        if (contato) {
          mostrarDetalhes(contato.nome, contato.email, contato.telefone);
        } else {
          alert('Contato não encontrado.');
        }
        })
      .catch(err => {
        console.error('Erro ao buscar contato:', err);
    });
}
  
  
function editContact(id) {
    // Buscar os dados do contato clicado
    fetch(`http://localhost:3000/contatos/${id}`)
      .then(response => response.json())
      .then(contato => {
        document.getElementById("edit-id").value = contato.id;
        document.getElementById("edit-nome").value = contato.nome;
        document.getElementById("edit-email").value = contato.email;
        document.getElementById("edit-telefone").value = contato.telefone;
        document.getElementById("editar-contato").style.display = "block";
      })
      .catch(err => {
        console.error('Erro ao buscar contato:', err);
        alert("Erro ao buscar contato para edição.");
      });
}

function fecharEdicao() {
    document.getElementById("editar-contato").style.display = "none";
}

// Deletar contato
  
function deleteContact(id) {
    if (confirm("Tem certeza que deseja excluir este contato?")) {
        fetch(`http://localhost:3000/contatos/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir contato");
            }
            alert("Contato excluído com sucesso!");
            location.reload(); // Atualiza a lista de contatos
        })
        .catch(error => {
            console.error("Erro ao excluir contato:", error);
            alert("Erro ao excluir contato.");
        });
    }
}


// Assim que a página carregar
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/contatos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar contatos: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    // Processar dados
    const table = document.getElementById('contact-list');
        table.innerHTML = ''; // limpa a tabela antes

        data.forEach((contato, index) => {

          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${contato.nome}</td>
              <td>${contato.email}</td>
              <td>${contato.telefone}</td>
              <td>
                <button onclick="viewContact(${contato.id})">👁️</button>
                <button onclick="editContact(${contato.id})">✏️</button>
                <button onclick="deleteContact(${contato.id})">🗑️</button>
              </td>
            </tr>
          `;
          table.innerHTML += row;
        });
  })
  .catch(err => {
    console.error('Erro:', err.message);
  });


  /*Botao do lápis*/
  document.getElementById("form-editar-contato").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const nome = document.getElementById("edit-nome").value;
    const email = document.getElementById("edit-email").value;
    const telefone = document.getElementById("edit-telefone").value;

    fetch(`http://localhost:3000/contatos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, telefone })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao atualizar contato");
        }
        alert("Contato atualizado com sucesso!");
        document.getElementById("editar-contato").style.display = "none";
        location.reload(); // recarrega a lista de contatos
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao atualizar contato.");
    });
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

//Rota de busca para encontrar contatos por nome
// Adicionar evento ao campo de busca
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const termoBusca = searchInput.value.trim();

  if (termoBusca.length === 0) {
    // Se o campo estiver vazio, recarrega todos os contatos
    carregarTodosContatos();
    return;
  }

  fetch(`/buscar-contato?nome=${encodeURIComponent(termoBusca)}`)
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("contact-list");
      table.innerHTML = "";

      if (data.length === 0) {
        table.innerHTML = `<tr><td colspan='5'>Nenhum contato encontrado.</td></tr>`;
        return;
      }

      data.forEach((contato, index) => {
        const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${contato.nome}</td>
              <td>${contato.email}</td>
              <td>${contato.telefone}</td>
              <td>
                <button onclick="viewContact(${contato.id})">👁️</button>
                <button onclick="editContact(${contato.id})">✏️</button>
                <button onclick="deleteContact(${contato.id})">🗑️</button>
              </td>
            </tr>
          `;
        table.innerHTML += row;
      });
    })
    .catch((err) => {
      console.error("Erro na busca:", err);
    });
});

function carregarTodosContatos() {
  fetch("/contatos")
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("contact-list");
      table.innerHTML = "";

      data.forEach((contato, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${contato.nome}</td>
            <td>${contato.email}</td>
            <td>${contato.telefone}</td>
            <td>
              <button onclick="viewContact(${contato.id})">👁️</button>
              <button onclick="editContact(${contato.id})">✏️</button>
              <button onclick="deleteContact(${contato.id})">🗑️</button>
            </td>
          </tr>
        `;
        table.innerHTML += row;
      });
    })
    .catch((err) => console.error("Erro ao carregar contatos:", err));
}


/*// Eventos de clique para redirecionamento

document.getElementById("Dash").addEventListener("click", function(){
window.location.href = "Dashboard.html"; 
});
          
document.getElementById("Perfil").addEventListener("click", function(){
window.location.href = "Perfil.html"; 
});
          
document.getElementById("Contatos").addEventListener("click", function(){
window.location.href = "Gerenciar_Contatos.html"; 
});*/

