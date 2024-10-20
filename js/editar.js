async function carregarDadosUsuario() {
    const authToken = localStorage.getItem('token');
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idUsuario = parametrosUrl.get('userId');

    console.log('Token armazenado:', authToken);
    console.log('ID do Usuário:', idUsuario);

    try {
        if (authToken && idUsuario) {
            const resposta = await fetch(`http://localhost:8000/api/user/visualizar/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (resposta.ok) {
                const dadosUsuario = await resposta.json();
                document.getElementById('usuarioNome').value = dadosUsuario.user.name;
                document.getElementById('usuarioEmail').value = dadosUsuario.user.email;
            } else {
                const erroResposta = await resposta.json();
                throw new Error(erroResposta.message || 'Falha ao obter detalhes do usuário');
            }
        } else {
            window.location.href = 'login.html'; // Redireciona se não houver token ou ID
        }
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagemErro('Não foi possível carregar os dados do usuário.');
    }
}

function mostrarMensagemErro(mensagem) {
    const alertaErro = document.getElementById('erroMensagem');
    alertaErro.textContent = mensagem;
    alertaErro.classList.remove('d-none');
}

async function atualizarUsuario(evento) {
    evento.preventDefault();

    const authToken = localStorage.getItem('token');
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idUsuario = parametrosUrl.get('userId');

    const nomeUsuario = document.getElementById('usuarioNome').value;
    const emailUsuario = document.getElementById('usuarioEmail').value;

    try {
        if (authToken && idUsuario) {
            const resposta = await fetch(`http://localhost:8000/api/user/atualizar/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: nomeUsuario, email: emailUsuario })
            });

            if (resposta.ok) {
                window.location.href = 'lista_usuarios.html'; // Redireciona após sucesso
            } else {
                const erroResposta = await resposta.json();
                throw new Error(erroResposta.message || 'Falha ao atualizar os dados do usuário');
            }
        } else {
            window.location.href = 'login.html'; // Redireciona se faltar token ou ID
        }
    } catch (erro) {
        console.error('Erro ao salvar alterações:', erro);
        mostrarMensagemErro('Erro ao salvar as alterações.');
    }
}

// Inicializa a página e define os eventos
document.addEventListener('DOMContentLoaded', carregarDadosUsuario);
document.getElementById('usuarioForm').addEventListener('submit', atualizarUsuario);
document.getElementById('botaoVoltar').addEventListener('click', function() {
    window.history.back();
});
