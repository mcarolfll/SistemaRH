document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('candidatoForm');
    const listaContainer = document.getElementById('listaCandidatos');
    const alertBox = document.getElementById('alertBox');
    const btnSubmit = document.getElementById('btnSubmit');
    const inputId = document.getElementById('candidatoId');

    // Carregar candidatos ao iniciar
    loadCandidatos();

    // Event listener para o formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = inputId.value;
        const candidato = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cargo_desejado: document.getElementById('cargo').value
        };

        try {
            if (id) {
                await api.put(`/candidatos/${id}`, candidato);
                showAlert('Candidato atualizado com sucesso!', 'success');
            } else {
                await api.post('/candidatos', candidato);
                showAlert('Candidato cadastrado com sucesso!', 'success');
            }
            
            resetForm();
            loadCandidatos();
        } catch (error) {
            showAlert(error.message, 'error');
        }
    });

    async function loadCandidatos() {
        try {
            listaContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Carregando...</p>';
            const candidatos = await api.get('/candidatos');
            renderList(candidatos);
        } catch (error) {
            listaContainer.innerHTML = '<p style="text-align:center; color: var(--danger-color);">Erro ao carregar candidatos.</p>';
        }
    }

    function renderList(candidatos) {
        if (candidatos.length === 0) {
            listaContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-muted);">Nenhum candidato cadastrado.</p>';
            return;
        }

        listaContainer.innerHTML = candidatos.map(c => `
            <div class="list-item">
                <div class="item-info">
                    <h3>${c.nome}</h3>
                    <p>${c.email} | ${c.telefone || 'Sem telefone'}</p>
                    <p style="color: var(--accent-color); font-size: 0.85rem; margin-top: 5px;">${c.cargo_desejado}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editCandidato(${c.id}, '${c.nome}', '${c.email}', '${c.telefone}', '${c.cargo_desejado}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteCandidato(${c.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    window.editCandidato = (id, nome, email, telefone, cargo) => {
        inputId.value = id;
        document.getElementById('nome').value = nome;
        document.getElementById('email').value = email;
        document.getElementById('telefone').value = telefone;
        document.getElementById('cargo').value = cargo;
        
        btnSubmit.innerHTML = '<i class="fas fa-save"></i> Atualizar Candidato';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteCandidato = async (id) => {
        if (confirm('Tem certeza que deseja excluir este candidato?')) {
            try {
                await api.delete(`/candidatos/${id}`);
                showAlert('Candidato excluído com sucesso!', 'success');
                loadCandidatos();
            } catch (error) {
                showAlert(error.message, 'error');
            }
        }
    };

    function resetForm() {
        form.reset();
        inputId.value = '';
        btnSubmit.innerHTML = '<i class="fas fa-plus"></i> Cadastrar Candidato';
    }

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }
});
