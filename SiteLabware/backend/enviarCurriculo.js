const formulario = document.getElementById("formulario");
const inputArquivo = document.querySelector('#meu-upload');
const btnEscolherLocal = document.getElementById('btn-escolher-local');
const statusArquivo = document.getElementById('status-arquivo');

let nomeDoArquivoSalvo = "";
let arquivoSelecionado = null;

/* 1. PEGA O ARQUIVO EM MEMÓRIA */
inputArquivo.addEventListener('change', (e) => {
    arquivoSelecionado = e.target.files[0];
    if (arquivoSelecionado) {
        statusArquivo.style.color = "#666";
        statusArquivo.innerText = `Arquivo carregado. Clique no botão verde.`;
    }
});

/* 2. SALVA LOCALMENTE */
btnEscolherLocal.addEventListener('click', async (e) => {
    // Garante que nenhuma ação padrão de formulário seja disparada por segurança
    e.preventDefault();
    e.stopPropagation();

    if (!arquivoSelecionado) {
        alert('Por favor, selecione um arquivo primeiro.');
        return;
    }

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: arquivoSelecionado.name
        });

        nomeDoArquivoSalvo = handle.name;

        const writable = await handle.createWritable();
        await writable.write(arquivoSelecionado);
        await writable.close();

        console.log("Arquivo salvo com sucesso:", nomeDoArquivoSalvo);
        statusArquivo.style.color = "#28a745";
        statusArquivo.innerText = `Salvo com sucesso como: ${nomeDoArquivoSalvo}`;

    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('O usuário cancelou o salvamento.');
        } else {
            console.error('Erro ao salvar:', err);
            alert('Erro ao salvar arquivo.');
        }
    }
});

/* 3. ENVIO DOS DADOS AO NODE-RED */
formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!nomeDoArquivoSalvo) {
        alert("Você precisa realizar o '1º Passo' antes de enviar o formulário!");
        return;
    }

    const nome = document.querySelector('input[name="nome"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const dataNascimento = document.querySelector('input[name="dataNascimento"]').value;
    const comentario = document.querySelector('input[name="comentario"]').value;
    const caminhoCurriculo = `C:/Users/44701384879/Desktop/curriculos_pi/${nomeDoArquivoSalvo}`;

    const dados = {
        nome,
        email,
        data_nascimento: dataNascimento,
        comentario: comentario,
        curriculo: caminhoCurriculo
    };

    try {
        const resposta = await fetch("http://localhost:1880/enviar-dados", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) throw new Error();

        alert("Dados enviados com sucesso!");
        formulario.reset();
        inputArquivo.value = "";
        nomeDoArquivoSalvo = "";
        statusArquivo.innerText = "";

    } catch (erro) {
        alert("Erro de conexão com o Node-RED. Verifique se o CORS está ativo no nó HTTP.");
    }
});