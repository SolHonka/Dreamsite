console.log("asdf");

// Function to fetch and display user's dreams
// Function to fetch and display user's dreams
// Function to fetch and display user's dreams
async function fetchDreams(token) {
    try {
        const response = await fetch('http://127.0.0.1:3000/dreams/get', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const dreams = await response.json();
            // Display dreams on the page
            const dreamsList = document.getElementById('dreams-list');
            dreamsList.innerHTML = ''; // Clear previous dreams
            dreams.forEach(dream => {
                const dreamBox = document.createElement('div');
                dreamBox.classList.add('dream-box');

                const dreamText = document.createElement('div');
                dreamText.classList.add('dream-text');
                dreamText.textContent = dream.dream_text;
                dreamBox.appendChild(dreamText);

                const dreamDate = document.createElement('div');
                dreamDate.classList.add('dream-date');
                dreamDate.textContent = new Date(dream.dream_date).toLocaleString();
                dreamBox.appendChild(dreamDate);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch('http://127.0.0.1:3000/dreams/delete', {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ dreamId: dream.id }) // Assuming the dream object has an 'id' property
                        });
                        
                        if (deleteResponse.ok) {
                            console.log('Dream deleted successfully');
                            // Remove the dream element from the DOM
                            dreamBox.remove();
                        } else {
                            console.error('Error deleting dream:', deleteResponse.statusText);
                        }
                    } catch (error) {
                        console.error('Error deleting dream:', error);
                    }
                });
                dreamBox.appendChild(deleteButton);

                dreamsList.appendChild(dreamBox);
            });
        } else {
            console.error('Error fetching dreams:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching dreams:', error);
    }
}


// Function to handle logout
function logout() {
    // Clear the token from session storage
    sessionStorage.removeItem('token');
    // Redirect the user to the login page or perform any other necessary action
    window.location.href = 'login.html'; // Replace 'login.html' with your actual login page URL
}

document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('token');
    if (token) {
        fetchDreams(token);
    } else {
        console.log('Token not found. User not logged in.');
        // Optionally, redirect user to login page
    }

    // Add event listener to logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
    });
});

// Function to save a new dream
async function saveDream(token, dreamText, dreamDate) {
    try {
        // Check if dreamText and dreamDate are empty
        if (!dreamText.trim() || !dreamDate.trim()) {
            console.error('Dream text and date are required.');
            return; // Exit function if either dreamText or dreamDate is empty
        }

        const response = await fetch('http://127.0.0.1:3000/dreams/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "dream_text": dreamText,
                "dream_date": dreamDate
            })
        });

        if (response.ok) {
            console.log('Dream saved successfully');
            // Clear the text boxes after saving the dream
            document.getElementById('dream-text').value = '';
            document.getElementById('dream-date').value = '';
            // Fetch and display dreams again to update the list
            fetchDreams(token);
        } else {
            console.error('Error saving dream:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving dream:', error);
    }
}



// Fetch and display dreams upon page load
document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('token');
    if (token) {
        fetchDreams(token);
    } else {
        console.log('Token not found. User not logged in.');
        // Optionally, redirect user to login page
    }
});

// Event listener for saving dream
document.getElementById('save-dream-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get dream text and date from form fields
    const dreamText = document.getElementById('dream-text').value;
    const dreamDate = document.getElementById('dream-date').value;

    // Save the dream
    const token = sessionStorage.getItem('token');
    if (token) {
        saveDream(token, dreamText, dreamDate);
    } else {
        console.log('Token not found. User not logged in.');
        // Optionally, redirect user to login page
    }
});
