// Dados globais
let gastos = [];
let chart = null;

// Funções de navegação
function showSection(sectionId) {
    // Ocultar todas as seções
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');

    // Atualizar botões de navegação
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    // Check if event is defined before accessing its target property
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback for initial load or direct function calls
        const activeButton = document.querySelector(`.nav-button[onclick*="${sectionId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }


    // Scroll para o topo
    window.scrollTo(0, 0);
}

// Funções do quiz
function calcularResultado() {
    const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
    let total = 0;
    let answered = 0;

    questions.forEach(q => {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected) {
            total += parseInt(selected.value);
            answered++;
        }
    });

    if (answered < questions.length) {
        alert('Por favor, responda todas as perguntas antes de calcular o resultado.');
        return;
    }

    let nivel, mensagem, recomendacoes, problemas;

    if (total <= 8) {
        nivel = "Baixo risco";
        mensagem = "Você parece ter um controle saudável sobre suas apostas. Continue mantendo esse equilíbrio e fique atento aos sinais de mudança no seu comportamento.";
        recomendacoes = "Continue monitorando seus gastos e estabeleça limites claros para suas apostas.";
        problemas = ["Nenhum problema significativo identificado"];
    } else if (total <= 12) {
        nivel = "Risco moderado";
        mensagem = "Alguns padrões de comportamento indicam que você pode estar desenvolvendo uma relação problemática com apostas.";
        recomendacoes = "Considere reduzir a frequência das apostas e busque atividades alternativas de lazer.";
        problemas = ["Possível escalada nos gastos", "Pensamentos frequentes sobre apostas"];
    } else if (total <= 16) {
        nivel = "Alto risco";
        mensagem = "Seus resultados indicam sinais preocupantes de dependência em apostas. É recomendável buscar ajuda profissional.";
        recomendacoes = "Procure apoio de profissionais especializados e considere participar de grupos de apoio.";
        problemas = ["Dificuldade de controle", "Impacto nas finanças pessoais", "Possível ocultação do problema"];
    } else {
        nivel = "Risco crítico";
        mensagem = "Seus resultados indicam uma dependência severa em apostas. É crucial buscar ajuda profissional imediatamente.";
        recomendacoes = "Procure ajuda profissional urgentemente. Ligue para nossa linha de apoio: 0800-888-0088.";
        problemas = ["Perda de controle total", "Sérios impactos financeiros", "Comportamentos de ocultação", "Tentativas falhadas de parar"];
    }

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('resultado-container').classList.remove('hidden');

    document.getElementById('resultado-content').innerHTML = `
        <div class="mb-6">
            <h4 class="text-xl font-bold mb-2">Nível de Risco: <span class="text-red-600">${nivel}</span></h4>
            <p class="text-lg mb-4">${mensagem}</p>
        </div>

        <div class="mb-6">
            <h4 class="text-lg font-bold mb-2">Possíveis Problemas Identificados:</h4>
            <ul class="list-disc pl-6">
                ${problemas.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>

        <div class="mb-6">
            <h4 class="text-lg font-bold mb-2">Recomendações:</h4>
            <p class="bg-blue-100 p-4 rounded-lg">${recomendacoes}</p>
        </div>

        ${total > 12 ? `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong>Importante:</strong> Se você está passando por dificuldades, não hesite em procurar ajuda.
            Ligue para nossa linha de apoio: <strong>0800-888-0088</strong> (gratuita, 24h).
        </div>
        ` : ''}
    `;
}

function reiniciarQuiz() {
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('resultado-container').classList.add('hidden');

    // Limpar respostas
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
}

// Funções do controle financeiro
function adicionarGasto() {
    const descricao = document.getElementById('descricao-gasto').value.trim();
    const valor = parseFloat(document.getElementById('valor-gasto').value);

    if (!descricao || !valor || valor <= 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const gasto = {
        id: Date.now(),
        descricao: descricao,
        valor: valor,
        data: new Date().toLocaleDateString('pt-BR')
    };

    gastos.push(gasto);

    // Limpar formulário
    document.getElementById('descricao-gasto').value = '';
    document.getElementById('valor-gasto').value = '';

    atualizarListaGastos();
    atualizarGrafico();
    atualizarAnalise();
}

function removerGasto(id) {
    gastos = gastos.filter(gasto => gasto.id !== id);
    atualizarListaGastos();
    atualizarGrafico();
    atualizarAnalise();
}

function atualizarListaGastos() {
    const container = document.getElementById('lista-gastos');
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);

    if (gastos.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum gasto registrado ainda.</p>';
    } else {
        container.innerHTML = gastos.map(gasto => `
            <div class="expense-item">
                <div>
                    <div class="font-semibold">${gasto.descricao}</div>
                    <div class="text-sm text-gray-500">${gasto.data}</div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-bold text-red-600">R$ ${gasto.valor.toFixed(2)}</span>
                    <button onclick="removerGasto(${gasto.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('total-gastos').textContent = `R$ ${total.toFixed(2)}`;
}

function atualizarGrafico() {
    const ctx = document.getElementById('grafico-gastos').getContext('2d');
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);

    if (chart) {
        chart.destroy();
    }

    if (gastos.length === 0) {
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Sem dados'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e5e7eb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return;
    }

    const dados = gastos.map(gasto => ({
        label: gasto.descricao,
        value: gasto.valor,
        percentage: ((gasto.valor / total) * 100).toFixed(1)
    }));

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.map(d => `${d.label} (${d.percentage}%)`),
            datasets: [{
                data: dados.map(d => d.value),
                backgroundColor: [
                    '#ef4444',
                    '#f97316',
                    '#f59e0b',
                    '#eab308',
                    '#84cc16',
                    '#22c55e',
                    '#10b981',
                    '#14b8a6',
                    '#06b6d4',
                    '#0ea5e9'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function atualizarAnalise() {
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
    const container = document.getElementById('analise-financeira');

    // Fetch analiseFinanceira from json-server
    const response = await fetch('http://localhost:3000/analiseFinanceira');
    const analiseFinanceiraData = await response.json();

    if (total === 0) {
        container.innerHTML = '<p class="text-gray-600">Adicione gastos para ver sua análise de risco financeiro.</p>';
        return;
    }

    const nivel = analiseFinanceiraData.find(a => total >= a.min && total <= a.max);

    container.innerHTML = `
        <div class="border-l-4 pl-4 mb-4" style="border-color: ${nivel.cor}">
            <h4 class="text-xl font-bold mb-2" style="color: ${nivel.cor}">${nivel.nivel}</h4>
            <p class="text-lg mb-3">${nivel.mensagem}</p>
            <div class="text-sm text-gray-600">
                <strong>Total gasto este mês:</strong> R$ ${total.toFixed(2)}
            </div>
        </div>

        ${nivel.min >= 400 ? `
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <strong>Recomendação:</strong> Considere buscar ajuda profissional para controlar seus gastos com apostas.
            <br>Ligue para nossa linha de apoio: <strong>0800-888-0088</strong>
        </div>
        ` : ''}
    `;
}

// Funções de depoimentos
async function carregarDepoimentos() {
    const container = document.getElementById('depoimentos-container');
    const response = await fetch('http://localhost:3000/depoimentos');
    const depoimentos = await response.json();

    container.innerHTML = depoimentos.map(depoimento => `
        <div class="depoimento-card">
            <div class="flex justify-between items-start mb-3">
                <h4 class="font-bold text-lg">${depoimento.nome}</h4>
                <span class="text-sm text-gray-500">${depoimento.data}</span>
            </div>
            <p class="text-gray-700 leading-relaxed">${depoimento.mensagem}</p>
        </div>
    `).join('');
}

async function adicionarDepoimento() {
    const nome = document.getElementById('nome-depoimento').value.trim();
    const mensagem = document.getElementById('mensagem-depoimento').value.trim();

    if (!nome || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const novoDepoimento = {
        nome: nome,
        mensagem: mensagem,
        data: new Date().toLocaleDateString('pt-BR')
    };

    await fetch('http://localhost:3000/depoimentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoDepoimento)
    });

    // Limpar formulário
    document.getElementById('nome-depoimento').value = '';
    document.getElementById('mensagem-depoimento').value = '';

    carregarDepoimentos(); // Reload depoimentos including the new one

    alert('Obrigado por compartilhar sua história! Sua experiência pode ajudar outras pessoas.');
}

// Funções de artigos
async function carregarArtigos() {
    const container = document.getElementById('artigos-container');
    const response = await fetch('http://localhost:3000/artigos');
    const artigos = await response.json();

    container.innerHTML = artigos.map(artigo => `
        <div class="article-card">
            <h3 class="font-bold text-lg mb-2">${artigo.titulo}</h3>
            <div class="text-sm text-gray-600 mb-3">
                <i class="fas fa-calendar mr-1"></i>${artigo.data} |
                <i class="fas fa-building mr-1"></i>${artigo.fonte}
            </div>
            <a href="${artigo.url}" target="_blank" class="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors inline-block">
                <i class="fas fa-external-link-alt mr-2"></i>Ler Artigo
            </a>
        </div>
    `).join('');
}

// Funções de FAQ
async function carregarFAQ() {
    const container = document.getElementById('faq-container');
    const response = await fetch('http://localhost:3000/faq');
    const faqData = await response.json();

    container.innerHTML = faqData.map((item, index) => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFAQ(${index})">
                <span>${item.pergunta}</span>
                <i class="fas fa-chevron-down" id="faq-icon-${index}"></i>
            </div>
            <div class="faq-answer" id="faq-answer-${index}">
                <p>${item.resposta}</p>
            </div>
        </div>
    `).join('');
}

function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);

    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// Funções de contatos
async function filtrarContatos() {
    const cidadeSelecionada = document.getElementById('select-cidade').value;
    const container = document.getElementById('contatos-container');
    const response = await fetch('http://localhost:3000/contatos');
    const allContatos = await response.json();

    if (!cidadeSelecionada) {
        container.innerHTML = `
            <div class="text-center text-2xl font-bold text-primary py-8">
                PROCURE AJUDA, VOCÊ NÃO ESTÁ SOZINHO!
            </div>
        `;
        return;
    }

    const contatosFiltrados = allContatos.filter(contato => contato.cidade === cidadeSelecionada);

    if (contatosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-lg text-gray-600">Nenhum contato encontrado para ${cidadeSelecionada}.</p>
                <p class="text-sm text-gray-500 mt-2">Em breve teremos mais opções disponíveis.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = contatosFiltrados.map(contato => `
        <div class="contact-card">
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg">${contato.nome}</h3>
                <span class="bg-primary text-white px-2 py-1 rounded text-sm">${contato.categoria}</span>
            </div>
            <div class="mb-2">
                <i class="fas fa-phone mr-2 text-primary"></i>
                <a href="tel:${contato.telefone}" class="hover:underline">${contato.telefone}</a>
            </div>
            <div class="mb-2">
                <i class="fas fa-map-marker-alt mr-2 text-primary"></i>
                ${contato.cidade}
            </div>
            <div>
                <i class="fas fa-globe mr-2 text-primary"></i>
                <a href="${contato.website}" target="_blank" class="text-blue-600 hover:underline">
                    Ver Website
                </a>
            </div>
        </div>
    `).join('');
}

// Funções de vídeos
async function carregarVideos() {
    const container = document.getElementById('videos-container');
    const response = await fetch('http://localhost:3000/videos');
    const videos = await response.json();

    container.innerHTML = videos.map((video, index) => `
        <div class="video-container">
            <iframe
                src="${video.url}"
                width="100%"
                height="400"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
            </iframe>
            <div class="bg-white p-4">
                <p class="text-gray-600">
                    <i class="fas fa-calendar mr-2"></i>Publicado em: ${video.data}
                </p>
            </div>
        </div>
    `).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarDepoimentos();
    carregarArtigos();
    carregarFAQ();
    carregarVideos();
    atualizarListaGastos();
    atualizarGrafico();
    atualizarAnalise();
});
