async function login(e) {
  e.preventDefault();

  // Retrieve email and password from the form
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  // Validate inputs
  if (!email || !password) {
    alert("Both email and password are required.");
    return;
  }
  

  // Prepare login details
  const loginDetails = { email, password };

  try {
    // Send login request to the server
    const response = await axios.post(
      "http://localhost:3000/user/login",
      loginDetails
    );
    // Handle successful login
    if (response.status === 200) {
      alert(response.data.message); // Display success message
      // window.location.href = "expense.html"; // Redirect to expense page
      console.log(response.data); // Debug: Log response data
      localStorage.setItem("token", response.data.token); // Store token
      window.location.href = "expense.html"; // Redirect to expense page
    } else {
      // Handle client errors (e.g., 400 or 401)
      alert(response.data.message || "Login failed. Please try again.");
    }
  } catch (err) {
    // Handle server or network errors
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "An unexpected error occurred.";
    document.body.innerHTML += `<div style="color:red; margin-top: 10px;">${errorMessage}</div>`;
    console.error(err); // Debug: Log the error
  }
}
