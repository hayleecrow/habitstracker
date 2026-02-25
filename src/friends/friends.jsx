import React from 'react';
import './friends.css';

export function Friends({ user }) {
    const [habits, setHabits] = React.useState(localStorage.getItem('habits') ? JSON.parse(localStorage.getItem('habits')) : []);
    const [overallStreak, setOverallStreak] = React.useState(localStorage.getItem('overallStreak') ? JSON.parse(localStorage.getItem('overallStreak')) : [{ value: 0, completedToday: false }]);
    const [friends, setFriends] = React.useState(localStorage.getItem('friends') ? JSON.parse(localStorage.getItem('friends')) : []);

    React.useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
        localStorage.setItem('overallStreak', JSON.stringify(overallStreak));
        localStorage.setItem('friends', JSON.stringify(friends));
    }, []);

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
                        <details>
                            <summary>Details</summary>
                            <ul>
                            </ul>
                        </details>
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
                        <td>{user.split('@')[0]}</td><td>{overallStreak[0].value}<span className="fire">🔥</span></td><td><details><summary>Details</summary><ul>{habitBulletpts}</ul></details></td>
                    </tr>
                    {friendRows}
                </tbody>
            </table>
            <button className="btn btn-primary" type="button">Add Friend +</button>
        </main>
    );
}