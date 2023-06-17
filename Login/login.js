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
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            window.location.href = '../Expense/expense.html'

        }
        else if (response.status === 400) {
            alert(response.data.message);
        }
        else if (response.status === 401) {
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
