const button = document.querySelector('#entrar')

button.addEventListener('click', () => {
   const email = document.querySelector('.email').value 
   const password = document.querySelector('.password').value 

   fetch('https://backendtcc.vercel.app/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer SEU_TOKEN_AQUI'
      },
      body: JSON.stringify({
        email,
        password
      })
   }
   )
   .then(response => response.json())
   .then(data => {
    console.log(data)
    if (data.status) {
      verificar(data.status, data.name, data.id)
    } else {
        alert(data.msg)
        console.log(data.msg);
    }
   })
   .catch(err => console.error(err))
})

const verificar = (status, nome, id) => {
    fetch('/verificar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer SEU_TOKEN_AQUI'
      },
      body: JSON.stringify({
        status,
        nome,
        id
      })
   }
   )
   .then(response => response.json())
   .then(data => {
    if(data.session) {
      window.location = '/home'
    }
   })
   .catch(err => console.error(err))
}
