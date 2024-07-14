const sendInviteButton = document.getElementById('sendInvite');
const usernameInput = document.getElementById('usernameInput');

sendInviteButton.addEventListener('click', async () => {
    try {
        const username = usernameInput.value;

        const response = await fetch(url + '/friends/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ username }),
        });

        if (response.ok) {
            await viewChange();
            alert('Friend invitation sent successfully!');
        } else {
            const data = await response.json();
            alert(`Failed to send invitation: ${data.message}`);
        }
    } catch (error) {
        console.error('Error sending invitation:', error.message);
        alert('Failed to send invitation. Please try again later.');
    }
});

async function handleAcceptInvitation(friendId) {
    try {
        const response = await fetch(`${url}/friends/accept`, {
            method: 'POST', // Assuming POST method for accepting
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ friendId }),
        });

        if (response.ok) {
            await viewChange();
            alert('Friend request accepted successfully!');
        } else {
            const data = await response.json();
            alert(`Failed to accept friend request: ${data.message}`);
        }
    } catch (error) {
        console.error('Error accepting friend request:', error.message);
        alert('Failed to accept friend request. Please try again later.');
    }
}

async function handleRejectInvitation(friendId) {
    try {
        const response = await fetch(`${url}/friends/reject`, {
            method: 'POST', // Assuming POST method for rejecting
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ friendId }),
        });

        if (response.ok) {
            await viewChange();
            alert('Friend request rejected successfully!');
        } else {
            const data = await response.json();
            alert(`Failed to reject friend request: ${data.message}`);
        }
    } catch (error) {
        console.error('Error rejecting friend request:', error.message);
        alert('Failed to reject friend request. Please try again later.');
    }
}

async function handleDeleteFriend(friendId) {
    try {
        const response = await fetch(`${url}/friends/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ friendId }),
        });

        if (response.ok) {
            await viewChange();
            alert('Friend removed successfully!');
        } else {
            const data = await response.json();
            alert(`Failed to remove friend: ${data.message}`);
        }
    } catch (error) {
        console.error('Error removing friend:', error.message);
        alert('Failed to remove friend. Please try again later.');
    }
}