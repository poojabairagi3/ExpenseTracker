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
    let response = await axios.post('http://localhost:3000/expense/add-expense', obj)

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
    let response = await axios.get('http://localhost:3000/expense/get-expense')
    console.log(response);
    response.data.expense.forEach(element => {
      showExpenseOnScreen(element);
    });

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
  deleteBtn.value = 'Delete Expense';
  console.log(obj);
  deleteBtn.onclick = async () => {
    console.log(obj.id);
    try {
      let response = await axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`)
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