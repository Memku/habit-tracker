import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Flame, Calendar, Target } from 'lucide-react';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize with some sample habits if none exist
  useEffect(() => {
    if (habits.length === 0) {
      const sampleHabits = [
        {
          name: 'Coding',
          currentStreak: 5,
          bestStreak: 12,
          completedDates: generateSampleDates(5),
          lastCompleted: new Date().toDateString()
        },
        {
          id: 2,
          name: 'Healthy Diet',
          currentStreak: 3,
          bestStreak: 8,
          completedDates: generateSampleDates(3),
          lastCompleted: new Date().toDateString()
        }
      ];
      setHabits(sampleHabits);
    }
  }, [habits.length]);

  function generateSampleDates(streak) {
    const dates = [];
    for (let i = streak - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toDateString());
    }
    return dates;
  }

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now(),
        name: newHabitName.trim(),
        currentStreak: 0,
        bestStreak: 0,
        completedDates: [],
        lastCompleted: null
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  const markComplete = (habitId) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        if (habit.lastCompleted === today) {
          return habit; // Already completed today
        }
        
        const newCompletedDates = [...habit.completedDates, today];
        const newCurrentStreak = habit.currentStreak + 1;
        const newBestStreak = Math.max(habit.bestStreak, newCurrentStreak);
        
        return {
          ...habit,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          completedDates: newCompletedDates,
          lastCompleted: today
        };
      }
      return habit;
    }));
  };

  const resetStreak = (habitId) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          currentStreak: 0,
          completedDates: [],
          lastCompleted: null
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toDateString();
    return habit.lastCompleted === today;
  };

  const getStreakClass = (streak) => {
    if (streak >= 30) return 'streak-purple';
    if (streak >= 14) return 'streak-blue';
    if (streak >= 7) return 'streak-green';
    if (streak >= 3) return 'streak-yellow';
    return 'streak-gray';
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            <Flame className="flame-icon" />
            Habit Streak Tracker
          </h1>
          <p className="subtitle">Build consistency, one day at a time</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <Target className="stat-icon green" />
              <div>
                <p className="stat-label">Active Habits</p>
                <p className="stat-number">{habits.length}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <Flame className="stat-icon orange" />
              <div>
                <p className="stat-label">Total Streaks</p>
                <p className="stat-number">
                  {habits.reduce((sum, habit) => sum + habit.currentStreak, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <Calendar className="stat-icon blue" />
              <div>
                <p className="stat-label">Best Streak</p>
                <p className="stat-number">
                  {habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak)) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Habit */}
        <div className="add-habit-card">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="add-habit-btn"
            >
              <Plus size={20} />
              Add New Habit
            </button>
          ) : (
            <div className="add-habit-form">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Enter habit name (e.g., Exercise, Reading)"
                className="habit-input"
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                autoFocus
              />
              <button onClick={addHabit} className="btn btn-green">
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHabitName('');
                }}
                className="btn btn-gray"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Habits List */}
        <div className="habits-list">
          {habits.map(habit => (
            <div key={habit.id} className="habit-card">
              <div className="habit-header">
                <div className="habit-info">
                  <h3 className="habit-name">{habit.name}</h3>
                  <div className={`streak-badge ${getStreakClass(habit.currentStreak)}`}>
                    <span>{habit.currentStreak} day streak</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="delete-btn"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="habit-footer">
                <div className="habit-stats">
                  <span>Current: {habit.currentStreak} days</span>
                  <span>Best: {habit.bestStreak} days</span>
                  <span>
                    {habit.lastCompleted 
                      ? `Last: ${new Date(habit.lastCompleted).toLocaleDateString()}`
                      : 'Never completed'
                    }
                  </span>
                </div>
                <div className="habit-actions">
                  {!isCompletedToday(habit) ? (
                    <button
                      onClick={() => markComplete(habit.id)}
                      className="btn btn-green complete-btn"
                    >
                      <Check size={16} />
                      Mark Complete
                    </button>
                  ) : (
                    <div className="completed-today">
                      <Check size={16} />
                      Completed Today!
                    </div>
                  )}
                  <button
                    onClick={() => resetStreak(habit.id)}
                    className="btn btn-gray"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {habits.length === 0 && (
          <div className="empty-state">
            <Flame className="empty-icon" />
            <p>No habits yet. Add your first habit to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;