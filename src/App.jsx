import React, { useState } from 'react';

export default function App() {
  const [polls, setPolls] = useState([]);
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [currentView, setCurrentView] = useState('home');

  const createPoll = () => {
    if (!pollTitle.trim() || pollOptions.filter(o => o.trim()).length < 2) {
      alert('Please add a title and at least 2 options');
      return;
    }

    const newPoll = {
      id: Date.now(),
      title: pollTitle,
      options: pollOptions.filter(o => o.trim()).map(opt => ({ text: opt, votes: 0 })),
      totalVotes: 0,
      createdAt: new Date().toISOString(),
    };

    setPolls([newPoll, ...polls]);
    setPollTitle('');
    setPollOptions(['', '']);
    setCurrentView('home');
  };

  const addOption = () => setPollOptions([...pollOptions, '']);
  
  const updateOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            PollGenius
          </h1>
          
          <button
            onClick={() => setCurrentView('create')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Create Poll
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {currentView === 'home' && (
          <div>
            {/* Hero Section */}
            <div style={{
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              color: 'white',
              padding: '4rem 2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Create Beautiful Polls in Seconds
              </h2>
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
                Free, fast, and easy to use. No signup required.
              </p>
              <button
                onClick={() => setCurrentView('create')}
                style={{
                  backgroundColor: 'white',
                  color: '#2563eb',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.125rem'
                }}
              >
                Create Free Poll
              </button>
            </div>

            {/* Polls List */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                Your Polls
              </h3>
              
              {polls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  <p>No polls yet. Create your first poll!</p>
                </div>
              ) : (
                <div>
                  {polls.map(poll => (
                    <div 
                      key={poll.id}
                      style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                      }}
                    >
                      <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        {poll.title}
                      </h4>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {poll.totalVotes} votes • Created {new Date(poll.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'create' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                Create New Poll
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Poll Question
                </label>
                <input
                  type="text"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                  placeholder="What's your question?"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Answer Options
                </label>
                
                {pollOptions.map((option, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem'
                      }}
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== index))}
                        style={{
                          padding: '0.5rem 1rem',
                          color: '#dc2626',
                          backgroundColor: '#fee2e2',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={addOption}
                  style={{
                    marginTop: '0.5rem',
                    color: '#2563eb',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  + Add Option
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                <button
                  onClick={createPoll}
                  style={{
                    flex: 1,
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Create Poll
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb',
        marginTop: '4rem',
        padding: '2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          © 2026 PollGenius - Free Online Poll Maker
        </div>
      </footer>
    </div>
  );
}
