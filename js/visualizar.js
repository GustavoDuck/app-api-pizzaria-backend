async function obterUsuarioDetalhes() {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    console.log('Token:', token);
    console.log('User ID:', userId);

    try {
        if (token && userId) {
            const response = await fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const usuario = await response.json(); 

                const tabelaUsuario = document.getElementById('tabelaUsuario');
                tabelaUsuario.innerHTML = '';

                if (usuario.user) {
                    // Formata a data de criação
                    const dataCriacao = new Date(usuario.user.created_at);
                    const dataFormatada = dataCriacao.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.user.id}</td>
                        <td>${usuario.user.name}</td>
                        <td>${usuario.user.email}</td>
                        <td>${dataFormatada}</td>
                    `;
                    tabelaUsuario.appendChild(row);
                } else {
                    exibirMensagemErro('Dados do usuário não encontrados.');
                }
            } else {
                const errorResponse = await response.json();
                throw new Error('Erro ao buscar os detalhes do usuário');
            }
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        exibirMensagemErro('Erro ao carregar os detalhes do usuário');
    }
}

// Função para exibir mensagens de erro
function exibirMensagemErro(mensagem) {
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', obterUsuarioDetalhes);

document.getElementById('voltarBtn').addEventListener('click', function() {
    window.history.back();
});
