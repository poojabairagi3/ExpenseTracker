async function login(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const loginDetails = {

        email: email,
        password: password
    }
    console.log(loginDetails);
    // localStorage.setItem(obj.sell,JSON.stringify(obj));
    try {
        let response = await axios.post('http://localhost:3000/user/login', loginDetails)
        if (response.status === 201) {
            alert(response.data.message);
        }
        else if (response.status === 400) {
            alert(response.data.message);
        }
        else if (response.status === 404) {
            alert(response.data.message);
        }
        else {
            throw new Error(response.data.message)
        }

        // showUserOnScreen(response.data);
    }
    catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`
    }
}
