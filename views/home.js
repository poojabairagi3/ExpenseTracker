// Check if the user is authenticated and display personalized content
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    // If token exists, user is logged in
    displayUserDashboard();
  } else {
    // If no token, show login options
    displayLoginPrompt();
  }

  // Event listener for logout button
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logout();
    });
  }
});

// Display user dashboard content if authenticated
function displayUserDashboard() {
  const userDashboard = document.getElementById("userDashboard");
  const loginPrompt = document.getElementById("loginPrompt");

  // Hide login prompt and show user dashboard
  if (userDashboard) userDashboard.style.display = "block";
  if (loginPrompt) loginPrompt.style.display = "none";

  // Fetch user data (e.g., username) if needed
  fetchUserData();
}

// Display login prompt if not authenticated
function displayLoginPrompt() {
  const userDashboard = document.getElementById("userDashboard");
  const loginPrompt = document.getElementById("loginPrompt");

  // Hide user dashboard and show login prompt
  if (userDashboard) userDashboard.style.display = "none";
  if (loginPrompt) loginPrompt.style.display = "block";
}

// Fetch user data (like username) from API and display on the dashboard
async function fetchUserData() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const response = await axios.get("http://localhost:3000/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      const userName = response.data.name;
      // Display user name on the dashboard
      const welcomeMessage = document.getElementById("welcomeMessage");
      if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${userName}!`;
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
}

// Handle user logout
function logout() {
  // Clear user token and reload the page
  localStorage.removeItem("token");
  window.location.href = "login.html"; // Redirect to login page
}
