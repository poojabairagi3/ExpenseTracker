async function forgotpassword(event) {
    event.preventDefault();
    // console.log(event.target.name);
    const email=event.target.email.value;
    console.log(email);
    const Details = {

        email:email
    }
    console.log(Details);
    // localStorage.setItem(obj.sell,JSON.stringify(obj));
    try {

        let response = await axios.post('http://localhost:3000/password/forgotpassword', Details)
       console.log(response);
        // showUserOnScreen(response.data);
    }
    catch (err) {
        console.log(err);
    }
}

