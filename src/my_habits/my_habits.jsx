import React from 'react';
import './my_habits.css';
import { getInfoByField, updateUserInfo } from '../service';
// import schedule from 'node-schedule';

export function MyHabits({ userName }) {
    const [habits, setHabits] = React.useState([]);
    const [overallStreak, setOverallStreak] = React.useState({});
    const [isInitialized, setIsInitialized] = React.useState(false);
    
    const [newHabitName, setNewHabitName] = React.useState('');
    const [newHabitEmoji, setNewHabitEmoji] = React.useState('');
    const [newHabitGoal, setNewHabitGoal] = React.useState('');

    const [emojis, setEmojis] = React.useState([]);
    const [showEmojiGrid, setShowEmojiGrid] = React.useState(false);
    const emojiInputRef = React.useRef(null);
    const emojiGridRef = React.useRef(null);

    React.useEffect(() => {
        async function fetchUserInfo() {
            const habits = await getInfoByField('habits');
            const overallStreak = await getInfoByField('overallStreak');
            setHabits(habits);
            setOverallStreak(overallStreak);
            if (habits && overallStreak) {
                setIsInitialized(true);
            }
        }
        const fetchEmojis = async () => {
            const res = await fetch('https://emojihub.yurace.pro/api/all');
            const data = await res.json();
            setEmojis(data);
        };

        fetchUserInfo();
        fetchEmojis();
    }, []);

    React.useEffect(() => {
        if (isInitialized) {
            updateUserInfo(userName, 'habits', habits);
            updateUserInfo(userName, 'overallStreak', overallStreak);
        }
    }, [habits, overallStreak, isInitialized]);

    // reset habits at midnight and update streaks accordingly
    // schedule.scheduleJob('0 0 * * *', () => { resetHabits });
    function resetHabits() {
        // const now = new Date();
        // if (now.getHours() === 0 && now.getMinutes() === 0) {
        const updatedHabits = habits.map(habit => {
            if (!habit.completedToday) {
                habit.streak = 0;
            }
            habit.completedToday = false;
            return habit;
        });
        setHabits(updatedHabits);

        if (habits.some(habit => !habit.completedToday)) {
            setOverallStreak({ value: 0, completedToday: false });
        } else {
            setOverallStreak({ value: overallStreak.value, completedToday: false });
        }
    }

    function addHabit() {
        const newHabit = {
            streak: 0,
            habitName: newHabitName,
            emoji: newHabitEmoji,
            goal: newHabitGoal,
            completedToday: false
        };

        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
    }

    function toggleHabitCompletion(i) {
        // toggle individual habit completion and update streaks
        habits[i].completedToday = !habits[i].completedToday;
        if (habits[i].completedToday) {
            habits[i].streak++;
        } else {
            habits[i].streak--;
        }
        setHabits([...habits]);

        // update overall streak (if all habits are completed, increase overall streak, if unchecking any habit, reset overall streak back what it was at the beginning of the day)
        if (habits.every(habit => habit.completedToday) && !overallStreak.completedToday) {
            setOverallStreak({ value: overallStreak.value + 1, completedToday: true });
        } else if (habits.some(habit => !habit.completedToday) && overallStreak.completedToday) {
            setOverallStreak({ value: overallStreak.value - 1, completedToday: false });
        }
    }

    const habitRows = [];
    if (habits.length) {
        for (const [i, habit] of habits.entries()) {
            habitRows.push(
                <tr key={i}>
                    <td>{habit.streak}<span className="fire">🔥</span></td>
                    <td>{habit.emoji} {habit.habitName}</td>
                    <td>{habit.goal}</td>
                    <td className="checkbox"><input type="checkbox" checked={habit.completedToday} onChange={() => toggleHabitCompletion(i)} /></td>
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
  
    // Hide emoji grid when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (
                emojiGridRef.current &&
                !emojiGridRef.current.contains(event.target) &&
                emojiInputRef.current &&
                !emojiInputRef.current.contains(event.target)
            ) {
                setShowEmojiGrid(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function handleEmojiClick(char) {
        setNewHabitEmoji(newHabitEmoji + char);
        setShowEmojiGrid(false);
    }

    return (
        <main className="container-fluid my_habits">
            <h1>My Habits</h1>
            <div className="user-info">
                <h2 id="name">{userName}</h2>
                <h2 id="overall-streak">Overall Streak: {overallStreak.value}<span className="fire">🔥</span></h2>
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
            <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#create_new_habit">Add Habit +</button>
            
            {/* Popup Modal Window */}
            <div className="modal fade" id="create_new_habit" tabIndex="-1" aria-labelledby="newHabit" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="newHabit">New Habit</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    <div className="modal-body">
                        <form autoComplete="off">
                            <div className="input-group mb-3">
                                <label htmlFor="habit-name" className="input-group-text">Habit Name</label>
                                <input className="form-control" type="text" placeholder="ex. Drink Water" onChange={(e) => setNewHabitName(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <label htmlFor="habit-emoji" className="input-group-text">Emoji</label>
                                <input
                                    id="emoji-input"
                                    className="form-control"
                                    ref={emojiInputRef}
                                    value={newHabitEmoji}
                                    onChange={(e) => setNewHabitEmoji(e.target.value)}
                                    onFocus={() => setShowEmojiGrid(true)}
                                    placeholder="ex. 💧"
                                    autoComplete="off"
                                />
                                {showEmojiGrid && (
                                    <div id="emoji-grid" ref={emojiGridRef}>
                                        {emojis.slice(0, 100).map((emoji, idx) => (
                                        <span
                                            key={emoji.name || idx}
                                            className="emoji-item"
                                            onClick={() => handleEmojiClick(decodeHtml(emoji.htmlCode[0]))}
                                            title={emoji.name}
                                            onMouseOver={e => (e.currentTarget.style.background = '#f0f0f0')}
                                            onMouseOut={e => (e.currentTarget.style.background = '')}
                                        >
                                            {decodeHtml(emoji.htmlCode[0])}
                                        </span>
                                        ))}
                                    </div>
                                    )}
                            </div>
                            <div className="input-group mb-3">
                                <label htmlFor="habit-goal" className="input-group-text">Daily Goal</label>
                                <input className="form-control" type="text" placeholder="ex. 32 oz" onChange={(e) => setNewHabitGoal(e.target.value)} />
                            </div>
                        </form>
                    </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addHabit}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
  );
}