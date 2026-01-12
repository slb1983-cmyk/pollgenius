import React, { useState, useEffect } from 'react';

export default function App() {
  const [polls, setPolls] = useState([]);
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [currentView, setCurrentView] = useState('home');
  const [currentPoll, setCurrentPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Load polls from localStorage
  useEffect(() => {
    const savedPolls = localStorage.getItem('pollgenius_polls');
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    }
  }, []);

  // Save polls to localStorage whenever they change
  useEffect(() => {
    if (polls.length > 0) {
      localStorage.setItem('pollgenius_polls', JSON.stringify(polls));
    }
  }, [polls]);

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
    setCurrentPoll(newPoll);
    setCurrentView('share');
  };

  const viewPoll = (poll) => {
    setCurrentPoll(poll);
    setCurrentView('vote');
    setHasVoted(false);
  };

  const vote = (optionIndex) => {
    if (hasVoted) return;

    const updatedPoll = {
      ...currentPoll,
      options: currentPoll.options.map((opt, idx) => 
        idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
      ),
      totalVotes: currentPoll.totalVotes + 1
    };

    setCurrentPoll(updatedPoll);
    setPolls(polls.map(p => p.id === updatedPoll.id ? updatedPoll : p));
    setHasVoted(true);
  };

  const addOption = () => setPollOptions([...pollOptions, '']);
  
  const updateOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const getShareableLink = () => {
    if (!currentPoll) return '';
    // Encode poll data in URL
    const pollData = btoa(JSON.stringify({
      t: currentPoll.title,
      o: currentPoll.options.map(opt => opt.text)
    }));
    return `${window.location.origin}?p=${pollData}`;
  };

  const copyShareLink = () => {
    const shareUrl = getShareableLink();
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied! Share it with anyone to collect votes.');
  };

  // Check URL for poll data on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pollData = urlParams.get('p');
    
    if (pollData) {
      try {
        const decoded = JSON.parse(atob(pollData));
        const poll = {
          id: Date.now(),
          title: decoded.t,
          options: decoded.o.map(text => ({ text, votes: 0 })),
          totalVotes: 0,
          createdAt: new Date().toISOString()
        };
        setCurrentPoll(poll);
        setCurrentView('vote');
      } catch (error) {
        console.error('Invalid poll link');
        setCurrentView('home');
      }
    }
  }, []);

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
          <button
            onClick={() => {
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              PollGenius
            </h1>
          </button>
          
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
                Your Recent Polls
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                          {poll.title}
                        </h4>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {poll.totalVotes} votes • Created {new Date(poll.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => viewPoll(poll)}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        View Results
                      </button>
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
                    fontSize: '1rem',
                    boxSizing: 'border-box'
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

        {currentView === 'share' && currentPoll && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Poll Created!
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Share this link to start collecting votes
              </p>
              
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                wordBreak: 'break-all',
                fontSize: '0.875rem'
              }}>
                {getShareableLink()}
              </div>

              <button
                onClick={copyShareLink}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  width: '100%'
                }}
              >
                📋 Copy Link
              </button>

              <button
                onClick={() => viewPoll(currentPoll)}
                style={{
                  backgroundColor: 'white',
                  color: '#2563eb',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #2563eb',
                  cursor: 'pointer',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                View Poll & Results
              </button>
            </div>
          </div>
        )}

        {currentView === 'vote' && currentPoll && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                {currentPoll.title}
              </h2>

              {!hasVoted ? (
                <div>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Choose one option:
                  </p>
                  {currentPoll.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => vote(index)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.backgroundColor = '#eff6ff';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = 'white';
                      }}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ 
                    backgroundColor: '#d1fae5', 
                    color: '#065f46',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    ✓ Thanks for voting!
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Results ({currentPoll.totalVotes} votes)
                  </h3>

                  {currentPoll.options.map((option, index) => {
                    const percentage = currentPoll.totalVotes > 0 
                      ? ((option.votes / currentPoll.totalVotes) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '500' }}>{option.text}</span>
                          <span style={{ color: '#6b7280' }}>{option.votes} votes ({percentage}%)</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '0.5rem', 
                          backgroundColor: '#e5e7eb',
                          borderRadius: '0.25rem',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: '#2563eb',
                            transition: 'width 0.5s'
                          }} />
                        </div>
                      </div>
                    );
                  })}

                  <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fbbf24' }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                      <strong>Note:</strong> Votes are only stored locally on this device. To collect real votes, you need to add a backend database (which requires more setup).
                    </p>
                  </div>
                </div>
              )}
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
