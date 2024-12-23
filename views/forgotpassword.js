async function forgotpassword(event) {
  event.preventDefault(); // Prevent the default form submission

  // Extract the email value from the form
  const email = event.target.email.value;

  console.log("Email entered:", email);

  // Create an object to send to the backend
  const details = { email };

  console.log("Payload to send:", details);

  try {
    // Make a POST request to the backend API
    const response = await axios.post(
      "http://localhost:3000/password/forgotpassword",
      details
    );

    // Log the response for debugging
    console.log("Response from server:", response);

    // Provide feedback to the user
    if (response.status === 200) {
      alert("Password reset email sent successfully! Please check your inbox.");
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error("Error occurred while sending forgot password request:", err);
    // Show a user-friendly error message
    alert("An error occurred. Please check your email and try again.");
  }
}
