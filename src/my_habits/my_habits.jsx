import React from 'react';
import './my_habits.css';

export function MyHabits({ user }) {
    const [habits, setHabits] = React.useState([]);

    React.useEffect(() => {
        const habitsText = localStorage.getItem('habits');
        if (habitsText) {
            setHabits(JSON.parse(habitsText));
        }
    }, []);

    const habitRows = [];
    if (habits.length) {
        for (const [i, habit] of habits.entries()) {
            habitRows.push(
                <tr key={i}>
                <td>{streak}</td>
                <td>{habit.habitName}</td>
                <td>{habit.goal}</td>
                <td>{habit.completed}</td>
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
        <button className="btn btn-primary" type="button">Add Habit +</button>
    </main>
  );
}