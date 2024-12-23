async function signup(event) {
  event.preventDefault();

  // Extract form values
  const name = event.target.name.value.trim();
  const email = event.target.email.value.trim();

  const password = event.target.password.value.trim();

  // Create an object to send to the server
  const obj = { name, email, password };

  console.log(obj);

  try {
    // Send signup request
    const response = await axios.post(
      "http://localhost:3000/user/sign-up",
      obj
    );

    // Handle success responses
    if (response.status === 201) {
      alert(response.data.message); // Show success message
      window.location.href = "login.html"; // Redirect to login page
    } else if (response.status === 200) {
      alert(response.data.message); // Show the message if status is 200
    } else {
      throw new Error("Unexpected status code: " + response.status);
    }
  } catch (err) {
    // Log the error for debugging purposes
    console.error(err);

    // Show error feedback to the user
    const errorMessage =
      err.response?.data?.message ||
      "An error occurred during signup. Please try again.";
    document.body.innerHTML += `
      <div style="color: red; text-align: center; padding: 10px; 
        background-color: #f8d7da; border: 1px solid #f5c6cb; 
        border-radius: 5px; margin-top: 20px;">
        ${errorMessage}
      </div>`;
  }
}
