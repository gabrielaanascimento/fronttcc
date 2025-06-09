// Chave de API do OpenAI (essa linha pode ser removida se não for usada)
function sendMessage(){
    var messageInput = document.getElementById('message-input'); // Renomeado para evitar confusão
    var messageText = messageInput.value.trim(); // Pega o valor e remove espaços em branco

    if (!messageText) { // Verifica se o texto da mensagem não está vazio
        messageInput.style.border = '1px solid red';
        return;
    }
    messageInput.style.border = 'none';

    var status = document.getElementById('status');
    var btnSubmit = document.getElementById('btn-submit');

    status.style.display = 'block';
    status.innerHTML = 'Carregando...';
    btnSubmit.disabled = true;
    btnSubmit.style.cursor = 'not-allowed';
    messageInput.disabled = true; // Desabilita o input da mensagem também

    fetch("/pergunta", { // A URL '/pergunta' está correta para o seu backend
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: messageText // Envia o VALOR do input
        })
    })
    .then((response) => {
        if (!response.ok) { // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
            // Se não for bem-sucedida, lança um erro para o bloco .catch
            return response.json().then(errorData => {
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            });
        }
        return response.json(); // Pega o JSON da resposta
    })
    .then((apiResponseText) => { // 'apiResponseText' já é a string da resposta do Gemini
        status.style.display = 'none';
        showHistory(messageText, apiResponseText); // Passa o texto original e a resposta do Gemini
    })
    .catch((e) => {
        console.error(`Error -> ${e}`); // Use console.error para erros
        status.innerHTML = `Erro: ${e.message || 'tente novamente mais tarde...'}`; // Mostra a mensagem de erro
    })
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.style.cursor = 'pointer';
        messageInput.disabled = false;
        messageInput.value = ''; // Limpa o input
    });
}

function showHistory(message, response){
    var historyBox = document.getElementById('history');

    // Minha mensagem (pergunta do usuário)
    var boxMyMessage = document.createElement('div');
    boxMyMessage.className = 'box-my-message';

    var myMessage = document.createElement('p');
    myMessage.className = 'my-message';
    myMessage.innerHTML = message;

    boxMyMessage.appendChild(myMessage);
    historyBox.appendChild(boxMyMessage);

    // Mensagem de resposta do Chatbot
    var boxResponseMessage = document.createElement('div');
    boxResponseMessage.className = 'box-response-message';

    var chatResponse = document.createElement('p');
    chatResponse.className = 'response-message';
    chatResponse.innerHTML = response; // 'response' já é o texto puro vindo do backend

    boxResponseMessage.appendChild(chatResponse);
    historyBox.appendChild(boxResponseMessage);

    // Levar scroll para o final
    historyBox.scrollTop = historyBox.scrollHeight;
}

// Para usar a função sendMessage, você precisa chamá-la.
// Geralmente, isso é feito por um botão de enviar ou pelo evento 'submit' de um formulário.
// Exemplo (se houver um botão com id="btn-submit" e um input com id="message-input" dentro de um formulário):
// document.getElementById('btn-submit').addEventListener('click', sendMessage);

// Ou se o formulário inteiro submeter:
// document.getElementById('yourFormId').addEventListener('submit', function(event) {
//     event.preventDefault(); // Impede o recarregamento da página
//     sendMessage();
// });