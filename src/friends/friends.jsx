import React from 'react';
import './friends.css';

export function Friends({ user }) {
  return (
    <main className="friends container-fluid">
        <h1>Friends</h1>
        <div className="user-info">
            <h2 id="name">{user}</h2>
            <h2 id="overall-streak">Overall Streak: 11<span>🔥</span></h2>
        </div>
        <table className="table table-warning">
            <thead className="table-dark">
                <tr>
                    <th>Name</th><th>Streak</th><th>Habits</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Sarah</td><td>20<span>🔥</span></td><td><details><summary>Details</summary><ul><li>10<span>🔥</span> Exercise - 10 min</li></ul></details></td>
                </tr>
                <tr>
                    <td>Eric</td><td>50<span>🔥</span></td><td><details><summary>Details</summary></details></td>
                </tr>
                <tr>
                    <td>Jack</td><td>4<span></span></td><td><details><summary>Details</summary></details></td>
                </tr>
            </tbody>
        </table>
        <button className="btn btn-primary" type="button">Add Friend +</button>
    </main>
  );
}