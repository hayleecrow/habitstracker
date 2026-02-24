import React from 'react';
import './my_habits.css';

import { emojiAPI } from '../service';

export function MyHabits({ user }) {
    const [habits, setHabits] = React.useState([]);

    React.useEffect(() => {
        const habitsText = localStorage.getItem('habits');
        if (habitsText) {
            setHabits(JSON.parse(habitsText));
        }
    }, []);

    function addHabit() { }

    const habitRows = [];
    if (habits.length) {
        for (const [i, habit] of habits.entries()) {
            habitRows.push(
                <tr key={i}>
                <td>{habit.streak}<span className="fire">🔥</span></td>
                <td><span>{ emojiAPI }</span>{habit.habitName}</td>
                <td>{habit.goal}</td>
                <td className="checkbox">{habit.completed}</td>
                </tr>
            );
        }
    } else {
        habitRows.push(
        <tr key='0'>
            <td colSpan='4' style={{textAlign: "center"}}>Add a habit to beginning tracking your goals!</td>
        </tr>
        );
    }
  
    return (
    <main className="container-fluid my_habits">
        <h1>My Habits</h1>
        <div className="user-info">
            <h2 id="name">{user}</h2>
            <h2 id="overall-streak">Overall Streak: 11<span className="fire">🔥</span></h2>
        </div>
        <table className="table table-warning">
            <thead className="table-dark">
                <tr>
                    <th>Streak</th>
                    <th>Habit</th>
                    <th>Goal</th>
                    <th>Completed</th>
                </tr>
            </thead>
            <tbody id="habits">{habitRows}</tbody>
        </table>
        <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#popup">Add Habit +</button>
        
        {/* Popup Modal Window */}
        <div className="modal fade" id="popup" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">New Habit</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form method="get">
                    <div className="input-group mb-3">
                        <input className="form-control" type="text" placeholder="Habit Name"/>
                    </div>
                    <div className="input-group mb-3">
                        <input className="form-control" type="text" placeholder="Emoji"/>
                    </div>
                    <div className="input-group mb-3">
                        <input className="form-control" type="text" placeholder="Daily Goal (ex. 15 min or 3 miles)"/>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={addHabit}>Save</button>
            </div>
            </div>
        </div>
        </div>
    </main>
  );
}