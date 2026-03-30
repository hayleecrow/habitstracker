import React from 'react';
import './friends.css';
import { getInfoByField, updateUserInfo } from '../service';

export function Friends({ userName }) {
    const [habits, setHabits] = React.useState([]);
    const [overallStreak, setOverallStreak] = React.useState({});
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [friends, setFriends] = React.useState([]);

    const [newFriendName, setNewFriendName] = React.useState('');
    const [newFriendEmail, setNewFriendEmail] = React.useState('');

    React.useEffect(() => {
        async function fetchUserInfo() {
            const habits = await getInfoByField('habits');
            const overallStreak = await getInfoByField('overallStreak');
            const friends = await getInfoByField('friends');
            setHabits(habits);
            setOverallStreak(overallStreak);
            setFriends(friends);
            if (habits && overallStreak && friends) {
                setIsInitialized(true);
            }
        }
        fetchUserInfo();
    }, []);

    React.useEffect(() => {
        if (isInitialized) {
            updateUserInfo(userName, 'friends', friends);
        }
    }, [friends, isInitialized]);

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
                <h2 id="name">{userName}</h2>
                <h2 id="overall-streak">Overall Streak: {overallStreak.value}<span className="fire">🔥</span></h2>
            </div>
            <table className="table table-warning">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Streak</th>
                        <th>Habits</th>
                    </tr>
                </thead>
                {/* Websocket will update friend's streaks and habit information */}
                <tbody id="friends">
                    <tr>
                        <td>{userName} (Me)</td><td>{overallStreak.value}<span className="fire">🔥</span></td><td><ul>{habitBulletpts}</ul></td>
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
                                <label htmlFor="friend-username" className="input-group-text">Friend's Username</label>
                                <input className="form-control" type="text" onChange={(e) => setNewFriendName(e.target.value)} />
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