import React from 'react';
import './my_habits.css';

export function MyHabits() {
  return (
    <main className="container-fluid my_habits">
        <h1>My Habits</h1>
        <div className="user-info">
            <h2 id="name">Mystery User's Name</h2>
            <h2 id="overall-streak">Overall Streak: 11<span>🔥</span></h2>
        </div>
        <table className="table table-warning">
            <thead className="table-dark">
                <tr>
                    <th>Streak</th><th>Habit</th><th>Goal</th><th>Completed</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>9<span>🔥</span></td><td><span>📖</span> Scripture Study</td><td>15 min</td><td className="checkbox"><input type="checkbox"/></td>
                </tr>
                <tr>
                    <td>15<span></span></td><td><span>💧</span> Drink Water</td><td>32 oz</td><td className="checkbox"><input type="checkbox"/></td>
                </tr>
                <tr>
                    <td>10<span>🔥</span></td><td><span>💪</span> Exercise</td><td>30 min</td><td className="checkbox"><input type="checkbox"/></td>
                </tr>
            </tbody>
        </table>
        <button className="btn btn-primary" type="button">Add Habit +</button>
    </main>
  );
}