const token = localStorage.getItem('token');

async function Expense(event) {
  event.preventDefault();
  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  const obj = {
    amount: amount,
    description: description,
    category: category
  }
  console.log(obj);
  try {
    const token = localStorage.getItem('token')
    let response = await axios.post('http://localhost:3000/expense/add-expense', obj, { headers: { 'Authorization': token } })

    console.log(response);
    showExpenseOnScreen(response.data);

    location.reload();
  }
  catch (err) {
    console.log(err);
  }
}
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token')
    let response = await axios.get('http://localhost:3000/expense/get-expense', { headers: { 'Authorization': token } })
    // console.log(response);
    response.data.expense.forEach(element => {
      showExpenseOnScreen(element);
      
    });
    checkPremiumUser();
  }
  catch (err) {
    console.log(err);
  }
})

async function showExpenseOnScreen(obj) {
  const parentElement = document.getElementById('listofExpenses');
  const childElement = document.createElement('li');
  childElement.textContent = obj.amount + ' - ' + obj.description + ' - ' + obj.category + ' ';
  parentElement.appendChild(childElement);


  const deleteBtn = document.createElement('input');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.value = 'Delete Expense';
  // console.log(obj);
  deleteBtn.onclick = async () => {
    console.log(obj.id);
    try {
      const token = localStorage.getItem('token')
      let response = await axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`, { headers: { 'Authorization': token } })
      console.log(response);

      parentElement.removeChild(childElement)

    }
    catch (err) {
      console.log(err);
    };
  }

  childElement.appendChild(deleteBtn);
  parentElement.appendChild(childElement);
}

document.getElementById('rzp-button1').onclick = async function (e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3000/purchase/premiummember', { headers: { 'Authorization': token } })
  // console.log(response);
  var options =
  {
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function (response) {
      await axios.post('http://localhost:3000/purchase/updatemembership', {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      }, { headers: { 'Authorization': token } })

      alert("you are a premium user now");
      checkPremiumUser();
    },
  };
  const rzp1 = new Razorpay(options);
  e.preventDefault();
  rzp1.open();

  rzp1.on('payment failed', async function (response) {
    console.log(response);
    alert('Something went wrong')
  });
}

async function checkPremiumUser() {
  // console.log('I am Here');
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/user/check-premium', { headers: { 'Authorization': token } })
    // console.log(res.data);
    if (res.data.ispremiummember == true) {
      // alert('you are a premium user now');
      document.getElementById('rzp-button1').style.visibility = 'hidden';
      document.getElementById('message').innerHTML = 'you are a premium user';

      const parentElement = document.getElementById('leader');
      const leaderBtn = document.createElement("input");
      leaderBtn.type = "button";
      leaderBtn.value = "Show Leaderboard";
      leaderBtn.className = 'btn btn-info';
      leaderBtn.onclick = async () => {
        try {
          const token = localStorage.getItem('token');
          let responseLeader = await axios.get('http://localhost:3000/premium/leaderboard', { headers: { 'Authorization': token } })
          // console.log(responseLeader);
          const leaderBoard = document.getElementById('leader');
          leaderBoard.innerHTML += '<h1> Leader Board</h1>'
          responseLeader.data.forEach((userDetails) => {
            leaderBoard.innerHTML += `<li>Name - ${userDetails.name} , Total Expenses - ${userDetails.totalExpenses}</li>`
          })
        }
        catch (err) {
          console.log(err);
        }
      }
      parentElement.appendChild(leaderBtn);
    }
  }
  catch (err) {
    console.log(err);
  }

}

async function download(){
  try{
 const response= await axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
  
      if(response.status === 201){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }

  }
  catch(err){
    console.log(err)
  }}