document.addEventListener('DOMContentLoaded', async function () {

    /* gráfico de quantidade de curriculos por dia: */

    try {
        const resposta = await axios.get("http://localhost:1880/grafico");

        console.log("Grafico:", resposta.data);

        const dados = resposta.data;

        // Formata as datas para DD/MM
        const labels = dados.map(item => {
            const data = new Date(item.data);
            return data.toLocaleDateString('pt-BR');
        });

        const valores = dados.map(item => item.curriculos_dia);

        const ctx = document.getElementById('graficoCurriculos');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Currículos enviados',
                    data: valores,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

    } catch (erro) {
        console.error("Erro ao buscar currículos:", erro);
    }


    /* Lista de comentários: */

    /* http://localhost:1880/comentarios */

    try {
        const resposta = await axios.get("http://localhost:1880/comentarios");

        console.log("comentarios:", resposta.data);

        const dados = resposta.data;
        const containerComentarios = document.getElementById("container-comentarios");

        containerComentarios.innerHTML += dados
            .map(item => `
        <div class="comentario">
            ${item.comentario}
        </div>
    `)
            .join('');


    } catch (erro) {
        console.error("Erro ao buscar comentarios:", erro);
    }

});