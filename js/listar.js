async function listarUsuarios() {
    const token = localStorage.getItem('token');
    const userIdLogado = localStorage.getItem('userId');

    try {
        if (token) {
            const response = await fetch('http://localhost:8000/api/user/listar', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const usuarios = await response.json();

                const tabelaUsuarios = document.getElementById('tabelaUsuarios');
                tabelaUsuarios.innerHTML = '';

                // Verifique se o caminho para os dados do usuário está correto
                usuarios.user.data.forEach((usuario, index) => {
                    const dataCriacao = new Date(usuario.created_at);
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
                        <td>${index + 1}</td>
                        <td>${usuario.name}</td>
                        <td>${usuario.email}</td>
                        <td>${dataFormatada}</td>
                        <td>
                            <button class="btn btn-info btn-sm visualizar-usuario" data-id="${usuario.id}">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        
                            ${
                                usuario.id != userIdLogado
                                ? `<button class="btn btn-danger btn-sm excluir-usuario" data-id="${usuario.id}">
                                    <i class="fas fa-trash-alt"></i>
                                   </button>`
                                : ''
                            }

                            <button class="btn btn-edit btn-sm editar-usuario" data-id="${usuario.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    `;
                    tabelaUsuarios.appendChild(row);
                });

                // Evento de clique para visualizar
                document.querySelectorAll('.visualizar-usuario').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        window.location.href = `visualizar.html?userId=${userId}`;
                    });
                });

                // Evento de clique para excluir
                document.querySelectorAll('.excluir-usuario').forEach(button => {
                    button.addEventListener('click', async function() {
                        const userId = this.getAttribute('data-id');
                        const confirmar = confirm('Tem certeza que deseja excluir este usuário?');
                        if (confirmar) {
                            await excluirUsuario(userId);
                        }
                    });
                });

                // Evento de clique para editar os dados do usuário
                document.querySelectorAll('.editar-usuario').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        window.location.href = `editar.html?userId=${userId}`;
                    });
                })
            } else {
                const errorData = await response.json(); // Para verificar o erro
                console.error('Erro ao buscar os usuários:', errorData);
                throw new Error('Erro ao buscar os usuários');
            }
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        const mensagemErro = document.getElementById('mensagemErro');
        mensagemErro.textContent = 'Erro ao carregar a lista de usuários';
        mensagemErro.classList.remove('d-none');
    }
}

// Função para deslogar
function deslogar() {
    // Remova o token e o userId do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Redireciona para a página de login
    window.location.href = 'login.html';
}

// Chama a função para listar os usuários assim que a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    listarUsuarios();
    
    // Adiciona o evento de clique para o botão de deslogar
    document.getElementById('logoutBtn').addEventListener('click', deslogar);
});
