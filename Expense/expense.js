// const FileUploaded = require("../models/fileuploaded");

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
// window.addEventListener('DOMContentLoaded', async () => {
//   try {
//     const token = localStorage.getItem('token')
//     let response = await axios.get('http://localhost:3000/expense/get-expense', { headers: { 'Authorization': token } })
//     // console.log(response);
//     response.data.expense.forEach(element => {
//       showExpenseOnScreen(element);
      
//     });
//     checkPremiumUser();
//   }
//   catch (err) {
//     console.log(err);
//   }
// })


   


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
      document.getElementById('downloadexpense').style.visibility = 'visible';
      document.getElementById('downloadurls').style.visibility = 'visible';

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
          console.log(responseLeader);
          const leaderBoard = document.getElementById('leader');
          leaderBoard.innerHTML += '<h1> Leader Board </h1>'
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
   
 const response= await axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
  console.log(response);
  console.log(response.data);
      if(response.status === 200){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileURl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
        
          throw new Error(response.data.message)
      }
      

  }
  catch(err){
    console.log(err)
  }}

  

    async function filedownload(){
      try{   
     const response= await axios.get('http://localhost:3000/expense/download-file', { headers: {"Authorization" : token} })
      console.log(response);
      console.log(response.data);  
      const eleurl =document.getElementById('Url');
      eleurl.innerHTML += '<h1> All Urls </h1>'
       response.data.urls.forEach((urlDetails) => {
              eleurl.innerHTML += `<li> ${urlDetails.URL} </li>`
          })
        }
      catch(err){
        console.log(err)
      }
    }
    
 async function getProducts(page){
  try{ 
    const response=await axios.get(
      `http://localhost:3000/expense/get-expenses?page=${page}`,
      {
        headers:{Authorization:token},
       
      }
      
    );
    console.log(response);
    
    response.data.expenses.forEach(element => {
      showExpenseOnScreen(element);
      
    });
      showPagination(response.data);
  }
  catch(err){
    console.log(err);
  }
 }


    // async function getUsers(){
    //   try{
    //     const res=await axios.get("http://localhost:3000/get-user",{
    //       headers:{Authorization:token},
    //     });
    //     if(res.data.isPremium){
    //       buyPremium.style.display="none";
    //       expenseBoard.hidden=false;
    //       downloadExpense.hidden=false;
    //       premiumUser.hidden=false;
    //       showboard.hidden=false;
    //       FileUploaded.hidden=false;

    //     }
    //   }
    //   catch(err){
    //     console.log(err);
    //   }
    // }

 
window.addEventListener("DOMContentLoaded",async()=>{
 try{
  const objUrlParams=new URLSearchParams(window.location.search);
  console.log(objUrlParams);
  const page=objUrlParams.get('page')||1
  const response=await axios.get(
    `http://localhost:3000/expense/get-expenses?page=${page}`,
    {
      headers:{Authorization:token}
    }
  );
  console.log(response);
  
  response.data.expenses.forEach(element => {
          showExpenseOnScreen(element);
          
        });
  
  showPagination(response.data);
}
catch(err){
  console.log(err);
}
})

async function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}) {
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.className="btn btn-success"
    btn2.type='button';
    btn2.addEventListener("click", () => getProducts(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.className="btn btn-success";
  btn1.type='button';
  btn1.addEventListener("click", () => getProducts(currentPage));
  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.className="btn btn-success";
    btn3.type='button';
    btn3.addEventListener("click", () => getProducts(nextPage));
    pagination.appendChild(btn3);
  }

  
}



