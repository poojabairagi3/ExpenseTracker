
async function SaveToCrudCrud(event){
    event.preventDefault();
    const name= event.target.name.value;
    const email=event.target.email.value;
    const password=event.target.password.value;
    const obj={
        name:name,
        email:email,
        password:password
    }
    console.log(obj);
    // localStorage.setItem(obj.sell,JSON.stringify(obj));
    try{
        let response= await axios.post('http://localhost:3000/user/sign-up',obj)
        if(response.status===201){
            window.location.href="../Login/login.html"
        }
        else{
            throw new Error("Failed to login")
        }
        
        // showUserOnScreen(response.data);
    }
    catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err} </div>`
    }
}
