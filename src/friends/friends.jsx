import React from 'react';
import './friends.css';

export function Friends({ user }) {
    const [habits, setHabits] = React.useState(localStorage.getItem('habits') ? JSON.parse(localStorage.getItem('habits')) : []);
    const [overallStreak, setOverallStreak] = React.useState(localStorage.getItem('overallStreak') ? JSON.parse(localStorage.getItem('overallStreak')) : [{ value: 0, completedToday: false }]);
    const [friends, setFriends] = React.useState(localStorage.getItem('friends') ? JSON.parse(localStorage.getItem('friends')) : []);

    const [newFriendName, setNewFriendName] = React.useState('');
    const [newFriendEmail, setNewFriendEmail] = React.useState('');

    React.useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
        localStorage.setItem('overallStreak', JSON.stringify(overallStreak));
        localStorage.setItem('friends', JSON.stringify(friends));
    }, []);

    React.useEffect(() => {
        localStorage.setItem('friends', JSON.stringify(friends));
    }, [friends]);

    function addFriend() {
        const newFriend = {
            name: newFriendName,
            email: newFriendEmail,
            overallStreak: 0,
            habits: []
        };

        const updatedFriends = [...friends, newFriend];
        setFriends(updatedFriends);
    }

    const habitBulletpts = [];
    if (habits.length) {
        for (const habit of habits) {
            habitBulletpts.push(
                <li key={habit.habitName}>{habit.emoji} {habit.habitName} - Streak: {habit.streak}<span className="fire">🔥</span></li>
            );
        }
    } else {
        habitBulletpts.push(
            <li key='0'>You have no habits yet. Add some habits to see them here!</li>
        );
    }

    const friendRows = [];
    if (friends.length) {
        for (const friend of friends) {
            friendRows.push(
                <tr key={friend.name}>
                    <td>{friend.name}</td>
                    <td>{friend.overallStreak}<span className="fire">🔥</span></td>
                    <td>
                        <ul>
                        </ul>
                    </td>
                </tr>
            )
        };
    } else { 
        friendRows.push(
            <tr key='0'>
                <td colSpan='3' style={{textAlign: "center"}}>Add some friends to see their habits and streaks!</td>
            </tr>
        );
    }
  
    return (
        <main className="friends container-fluid">
            <h1>Friends</h1>
            <div className="user-info">
                <h2 id="name">{user.split('@')[0]}</h2>
                <h2 id="overall-streak">Overall Streak: {overallStreak[0].value}<span className="fire">🔥</span></h2>
            </div>
            <table className="table table-warning">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Streak</th>
                        <th>Habits</th>
                    </tr>
                </thead>
                <tbody id="friends">
                    <tr>
                        <td>{user.split('@')[0]} (Me)</td><td>{overallStreak[0].value}<span className="fire">🔥</span></td><td><ul>{habitBulletpts}</ul></td>
                    </tr>
                    {friendRows}
                </tbody>
            </table>
            <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#add_new_friend">Add Friend +</button>

            {/* Popup Modal Window */}
            <div className="modal fade" id="add_new_friend" tabIndex="-1" aria-labelledby="newFriend" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="newFriend">New Friend</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    <div className="modal-body">
                        <form method="get">
                            <div className="input-group mb-3">
                                <input className="form-control" type="text" placeholder="Friend's Name" onChange={(e) => setNewFriendName(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <input className="form-control" type="text" placeholder="Friend's Email" onChange={(e) => setNewFriendEmail(e.target.value)} />
                            </div>
                        </form>
                    </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addFriend}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}