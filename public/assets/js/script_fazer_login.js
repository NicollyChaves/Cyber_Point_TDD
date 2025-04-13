document.querySelector('.login__form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login inválido!');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Redirecionar para o dashboard
        window.location.href = 'Dashboard.html';
        localStorage.setItem('usuario_id', data.usuario_id);

      } else {
        alert('Email ou senha incorretos!');
      }
    })
    .catch(error => {
      alert('Erro ao fazer login: ' + error.message);
    });
  });