document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("form");

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;

        const dados = {
            email,
            senha
        };

        try {
            const resposta = await axios.post(
                "http://localhost:1880/login",
                dados,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Dados enviados:", dados);
            console.log("Resposta:", resposta.data);

            alert("Login realizado com sucesso!");
            window.location.href = "/html/Dashboard.html";

        } catch (erro) {
            console.error("Erro:", erro);

            if (erro.response) {
                alert("Email ou senha inválidos");
            } else {
                alert("Erro ao conectar com o servidor");
            }
        }
    });
});