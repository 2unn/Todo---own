const useName = document.getElementById('name');
const password = document.getElementById('password');
const formSubmit = document.getElementsByClassName('form-submit')[0];


function SignIn (name, password,callbackDone) {
    const logInApi = `https://authencation.vercel.app/api/auth/login`;
    const data = { 
        username :  name,
        password : password
    }  
    fetch(logInApi, { 
        method : "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(data),
    })
        .then(res => res.json())
            .then(callbackDone)
            .catch(err => callbackDone(err))
}


formSubmit.onclick = (e) => {
    e.preventDefault();

    function getIn (data) {
        if(typeof data == 'object'){
            localStorage.setItem("user", JSON.stringify(data.user_id));
            console.log(JSON.stringify(data.user_id))
            window.location.href = `https://2unn.github.io/Todo---own`
        }else{
            alert(data)
        }
    }
    SignIn(useName.value, password.value, getIn)
}