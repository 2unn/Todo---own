function SignUpFetch (fullName,userName, password,callbackDone) {
    const logInApi = `https://authencation.vercel.app/api/user/create`;
    const data = { 
        full_name : fullName,
        password :password,
        username : userName
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


const formSubmit = document.getElementsByClassName('form-submit')[0];
formSubmit.onclick = (e) => {
    const fullName = document.getElementById('name');
    const userName = document.getElementById('user_id');
    const password = document.getElementById('password');
    
    e.preventDefault();

    function SignUp (data) {
        if(typeof data == 'object'){
            window.location.href = `http://127.0.0.1:5501/validationtest/SignIn.html`
        }else{
            alert(data)
        }
    }

    SignUpFetch(fullName.value, userName.value,password.value ,SignUp)
}