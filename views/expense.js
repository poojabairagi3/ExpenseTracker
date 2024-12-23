const token = localStorage.getItem("token");
let currentPage = 1;

// Default items per page from localStorage
const resultsPerPage = localStorage.getItem("itemNo") || 2;

// Event Listener: Store items per page in localStorage
document.getElementById("itemButton").addEventListener("click", () => {
  const itemNo = document.getElementById("expenseshow").value;
  const itemNumeric = Number(itemNo);
  if (!isNaN(itemNumeric) && itemNumeric > 0) {
    localStorage.setItem("itemNo", itemNumeric);
    location.reload(); // Reload to apply the change
  } else {
    alert("Please enter a valid number of items per page.");
  }
});

// Add Expense
async function Expense(event) {
  event.preventDefault();
  const { amount, description, category } = event.target;

  // Check for empty fields
  if (!amount.value || !description.value || !category.value) {
    alert("All fields are required.");
    return;
  }

  const obj = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/expense/add-expense",
      obj,
      { headers: { Authorization: token } }
    );
    // console.log(response);
    showExpenseOnScreen(response.data.expense);
    event.target.reset();
  } catch (err) {
    console.error(err);
    alert("Failed to add expense.");
  }
}

async function getProducts(page) {
  try {
    const response = await axios.get(
      `http://localhost:3000/expense/get-expenses?page=${page}&limit=${resultsPerPage}`,
      { headers: { Authorization: token } }
    );

    // Check if the response is successful
    if (response.status === 200) {
      const { expenses, currentPage, lastPage } = response.data;

      // Remove current list of expenses
      removeFromScreen();

      // Display new expenses
      expenses.forEach((expense) => showExpenseOnScreen(expense));

      // Update pagination controls
      updatePaginationControls(currentPage, lastPage);
    } else {
      console.error("Failed to fetch expenses:", response.statusText);
      alert("Failed to fetch expenses.");
    }
  } catch (err) {
    console.error("Error fetching expenses:", err);
    alert("An error occurred while fetching expenses.");
  }
}


// Remove displayed expenses from the screen
function removeFromScreen() {
  const parentElement = document.getElementById("listofExpenses");
  parentElement.innerHTML = ""; // Clear all children

  // // Show a message if no expenses
  // const noExpensesMessage = document.createElement("li");
  // noExpensesMessage.textContent = "No expenses to display.";
  // parentElement.appendChild(noExpensesMessage);
}

// Display Pagination Controls
function updatePaginationControls(currentPage, totalPages) {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = ""; // Clear existing controls

  // Create Previous button
  if (currentPage > 1) {
    const prevButton = createPaginationButton("Previous", () =>
      getProducts(currentPage - 1)
    );
    paginationElement.appendChild(prevButton);
  }

  // Create page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPaginationButton(
      i,
      () => getProducts(i),
      i === currentPage ? "btn-secondary" : "btn-light"
    );
    paginationElement.appendChild(pageButton);
  }

  // Create Next button
  if (currentPage < totalPages) {
    const nextButton = createPaginationButton("Next", () =>
      getProducts(currentPage + 1)
    );
    paginationElement.appendChild(nextButton);
  }
}

// Create a pagination button
function createPaginationButton(text, onClick, className = "btn-primary") {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = `btn ${className} me-2`;
  button.onclick = onClick;
  return button;
}

// Display an Expense on Screen
function showExpenseOnScreen(expense) {
  const parentElement = document.getElementById("listofExpenses");

    const amount = expense.amount || "N/A";
    const description = expense.description || "N/A";
    const category = expense.category || "N/A";

  const childElement = document.createElement("li");
  // li.style.color='grey';
  childElement.textContent = `${amount} - ${description} - ${category}`;

  // Delete Button
  const deleteBtn = createActionButton(
    "Delete Expense",
    "btn-danger",
    async () => {
      try {
        await axios.delete(
          `http://localhost:3000/expense/delete-expense/${expense.id}`,
          { headers: { Authorization: token } }
        );
        parentElement.removeChild(childElement);
      } catch (err) {
        console.error(err);
        alert("Failed to delete expense.");
      }
    }
  );

// Edit Button
const editBtn = createActionButton(
  "Edit Expense",
  "btn-warning",
  async () => {
    try {
      const newAmount = prompt("Enter new amount:", expense.amount);
      const newDescription = prompt("Enter new description:", expense.description);
      const newCategory = prompt("Enter new category:", expense.category);

      if (newAmount && newDescription && newCategory) {
        const updatedExpense = {
          amount: newAmount,
          description: newDescription,
          category: newCategory,
        };
        const response = await axios.put(
          `http://localhost:3000/expense/update-expense/${expense.id}`,
          updatedExpense,
          { headers: { Authorization: token } }
        );

        // Update the list item content directly
        childElement.firstChild.nodeValue = `${newAmount} - ${newDescription} - ${newCategory} `;
      } else {
        alert("All fields must be filled.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update expense.");
    }
  }
);


  childElement.appendChild(deleteBtn);
  childElement.appendChild(editBtn);
  parentElement.appendChild(childElement);
}

// Create Action Buttons for Expense Items
function createActionButton(text, className, onClick) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = text;
  button.className = `btn ${className} ms-2`;
  button.onclick = onClick;
  return button;
}

// Razorpay Payment Integration
document.getElementById("rzp-button1").onclick = async function (e) {
  e.preventDefault();
  try {
    const response = await axios.get(
      "http://localhost:3000/purchase/premiummember",
      { headers: { Authorization: token } }
    );
    // console.log(response);
    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        await axios.post(
          "http://localhost:3000/purchase/updatemembership",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
console.log(payment_id);
        alert("you are a premium user now");
        checkPremiumUser();
      },
    };

    const rzp1 = new Razorpay(options);
    e.preventDefault();
    rzp1.open();

    rzp1.on("payment failed", async function (response) {
      console.log(response);
      alert("Something went wrong");
    });
  } catch (err) {
    console.error(err);
    alert("Failed to initiate payment.");
  }
};

// Check Premium User
async function checkPremiumUser() {
  // console.log('I am Here');
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/user/check-premium", {
      headers: { Authorization: token },
    });
    // console.log(res.data);
    if (res.data.isPremiumMember == true) {
      // alert('you are a premium user now');
      document.getElementById("rzp-button1").style.visibility = "hidden";
      document.getElementById("downloadexpense").style.visibility = "visible";
      document.getElementById("downloadurls").style.visibility = "visible";

      document.getElementById("message").innerHTML = "you are a premium user";

      const parentElement = document.getElementById("leader");
      const leaderBtn = document.createElement("input");
      leaderBtn.type = "button";
      leaderBtn.value = "Show Leaderboard";
      leaderBtn.className = "btn btn-info";
      leaderBtn.onclick = async () => {
        try {
          const token = localStorage.getItem("token");
          let responseLeader = await axios.get(
            "http://localhost:3000/premium/leaderboard",
            { headers: { Authorization: token } }
          );
          console.log(responseLeader);
          const leaderBoard = document.getElementById("leader");
          leaderBoard.innerHTML += "<h1> Leader Board </h1>";
          responseLeader.data.forEach((userDetails) => {
            leaderBoard.innerHTML += `<li>Name - ${userDetails.name} , Total Expenses - ${userDetails.totalExpenses}</li>`;
          });
        } catch (err) {
          console.log(err);
        }
      };
      parentElement.appendChild(leaderBtn);
    }
  } catch (err) {
    console.log(err);
  }
}

async function download() {
  try {
    const response = await axios.get("http://localhost:3000/expense/download", {
      headers: { Authorization: token },
    });
    console.log(response);
    console.log(response.data);
    if (response.status === 200) {
      //the bcakend is essentially sending a download link
      //  which if we open in browser, the file would download
      var a = document.createElement("a");
      a.href = response.data.fileURl;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function filedownload() {
  try {
    const response = await axios.get(
      "http://localhost:3000/expense/download-file",
      { headers: { Authorization: token } }
    );
    console.log(response);
    console.log(response.data);
    const eleurl = document.getElementById("Url");
    eleurl.innerHTML += "<h1> All Urls </h1>";
    response.data.urls.forEach((urlDetails) => {
      eleurl.innerHTML += `<li> ${urlDetails.URL} </li>`;
    });
  } catch (err) {
    console.log(err);
  }
}

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  
  getProducts(currentPage);
  checkPremiumUser();
});
