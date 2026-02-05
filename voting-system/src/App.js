import React, { useState, useEffect } from 'react';
import { User, Vote, TrendingUp, Shield, LogOut, UserPlus, LogIn, PieChart, CheckCircle } from 'lucide-react';

const VotingSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [users, setUsers] = useState([]);
  const [elections, setElections] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('votingUsers') || '[]');
    const savedElections = JSON.parse(localStorage.getItem('elections') || '[]');
    const savedVotes = JSON.parse(localStorage.getItem('votes') || '[]');
    const savedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    setUsers(savedUsers);
    setElections(savedElections.length > 0 ? savedElections : getDefaultElections());
    setVotes(savedVotes);
    setCurrentUser(savedCurrentUser);
    
    if (savedCurrentUser) setActiveTab('elections');
  }, []);

  const getDefaultElections = () => {
    return [
      {
        id: 'e1',
        title: 'General Elections 2024 For Member of National Assembly',
        description: 'Vote for your next Member of National Assembly (MNA)',
        candidates: [
          { id: 'c1', name: 'Hasnain Rasheed Chaudhari', party: 'Pakistan Muslim League', manifesto: 'Better facilities, Infratructure Growth and Industrialization' },
          { id: 'c2', name: 'Hamza Rashhed Gujjar', party: 'Pakistan Peoples Party', manifesto: 'Enhanced Growth, Food for Everyone' }
        ],
        startDate: '2025-12-01',
        endDate: '2025-12-15',
        active: true
      },
      {
        id: 'e2',
        title: 'General Elections 2024 For Member of Provincial Assembly',
        description: 'Vote for your next Member of Provincial Assembly (MPA)',
        candidates: [
          { id: 'c4', name: 'Ch Usama Asghar Gujjar', party: 'Pakistan Tehreek e Insaf', manifesto: 'Revolution' },
          { id: 'c5', name: 'Malik Ahmad Ali', party: 'Pakistan Muslim League', manifesto: 'Infratructure Growth' },
          { id: 'c6', name: 'Hamza Chaudhari', party: 'Pakistan Peoples Party', manifesto: 'Basic Facilities for Everyone' }
        ],
        startDate: '2025-12-01',
        endDate: '2025-12-20',
        active: true
      }
    ];
  };

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const RegisterForm = () => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      studentId: '',
      password: '',
      confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleRegister = (e) => {
      if (e) e.preventDefault();
      setError('');

      if (!formData.fullName || !formData.email || !formData.studentId || !formData.password) {
        setError('All fields are required');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (users.some(u => u.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      if (users.some(u => u.studentId === formData.studentId)) {
        setError('Student ID already registered');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password,
        role: 'voter',
        registeredAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveToLocalStorage('votingUsers', updatedUsers);

      alert('Registration successful! Please login.');
      setActiveTab('login');
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8" data-testid="register-form">
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Register to Vote</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" data-testid="error-message">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              data-testid="register-fullname"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              data-testid="register-email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              data-testid="register-studentid"
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="BSEF22M123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              data-testid="register-password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              data-testid="register-confirm-password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Re-enter password"
            />
          </div>

          <button
            onClick={handleRegister}
            data-testid="register-submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Register
          </button>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
            data-testid="goto-login"
          >
            Login here
          </button>
        </p>
      </div>
    );
  };

  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
      setError('');

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        setError('Invalid email or password');
        return;
      }

      setCurrentUser(user);
      saveToLocalStorage('currentUser', user);
      setActiveTab('elections');
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8" data-testid="login-form">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="w-8 h-8 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" data-testid="login-error">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              data-testid="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              data-testid="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            data-testid="login-submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Login
          </button>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="text-green-600 hover:text-green-700 font-semibold"
            data-testid="goto-register"
          >
            Register here
          </button>
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Register first or use test account</p>
        </div>
      </div>
    );
  };

  const ElectionsList = () => {
    const hasVoted = (electionId) => {
      return votes.some(v => v.userId === currentUser.id && v.electionId === electionId);
    };

    return (
      <div className="max-w-6xl mx-auto" data-testid="elections-list">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{currentUser.fullName}</p>
                <p className="text-xs text-gray-500">{currentUser.studentId}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentUser(null);
                saveToLocalStorage('currentUser', null);
                setActiveTab('login');
              }}
              data-testid="logout-button"
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Vote className="w-8 h-8 text-blue-600 mr-3" />
          Active Elections
        </h2>

        <div className="grid gap-6">
          {elections.filter(e => e.active).map(election => (
            <div key={election.id} className="bg-white rounded-xl shadow-lg p-6" data-testid={`election-${election.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{election.title}</h3>
                  <p className="text-gray-600 mb-2">{election.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">Start: {election.startDate}</span>
                    <span>End: {election.endDate}</span>
                  </div>
                </div>
                {hasVoted(election.id) && (
                  <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full" data-testid="voted-badge">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Voted
                  </div>
                )}
              </div>

              {!hasVoted(election.id) ? (
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {election.candidates.map(candidate => (
                    <div
                      key={candidate.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition duration-200"
                    >
                      <h4 className="font-bold text-gray-800 mb-1">{candidate.name}</h4>
                      <p className="text-sm text-blue-600 mb-2">{candidate.party}</p>
                      <p className="text-xs text-gray-600 mb-3">{candidate.manifesto}</p>
                      <button
                        onClick={() => {
                          const newVote = {
                            id: Date.now().toString(),
                            userId: currentUser.id,
                            electionId: election.id,
                            candidateId: candidate.id,
                            timestamp: new Date().toISOString()
                          };
                          const updatedVotes = [...votes, newVote];
                          setVotes(updatedVotes);
                          saveToLocalStorage('votes', updatedVotes);
                          alert(`Vote cast for ${candidate.name}!`);
                        }}
                        data-testid={`vote-${candidate.id}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
                      >
                        Vote
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-700 text-center font-semibold">
                    You have already voted in this election. Thank you for participating!
                  </p>
                  <button
                    onClick={() => setActiveTab('results')}
                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200"
                  >
                    View Results
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Results = () => {
    const getResults = (election) => {
      const electionVotes = votes.filter(v => v.electionId === election.id);
      const results = election.candidates.map(candidate => ({
        ...candidate,
        voteCount: electionVotes.filter(v => v.candidateId === candidate.id).length
      }));
      const totalVotes = electionVotes.length;
      return { results, totalVotes };
    };

    return (
      <div className="max-w-6xl mx-auto" data-testid="results-page">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <PieChart className="w-8 h-8 text-purple-600 mr-3" />
          Election Results
        </h2>

        <div className="grid gap-6">
          {elections.map(election => {
            const { results, totalVotes } = getResults(election);
            const sortedResults = [...results].sort((a, b) => b.voteCount - a.voteCount);

            return (
              <div key={election.id} className="bg-white rounded-xl shadow-lg p-6" data-testid={`results-${election.id}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{election.title}</h3>
                <p className="text-gray-600 mb-4">Total Votes: {totalVotes}</p>

                <div className="space-y-3">
                  {sortedResults.map((candidate, index) => {
                    const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes * 100).toFixed(1) : 0;
                    return (
                      <div key={candidate.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {index === 0 && totalVotes > 0 && (
                              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold mr-2">
                                LEADING
                              </span>
                            )}
                            <span className="font-bold text-gray-800">{candidate.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({candidate.party})</span>
                          </div>
                          <span className="font-bold text-lg text-blue-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{candidate.voteCount} votes</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Secure Online Voting System</h1>
          </div>
          <p className="text-gray-600">Transparent, Secure, and Democratic</p>
        </div>

        {!currentUser ? (
          <div>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setActiveTab('login')}
                data-testid="tab-login"
                className={`px-6 py-2 font-semibold rounded-l-lg transition duration-200 ${
                  activeTab === 'login'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                data-testid="tab-register"
                className={`px-6 py-2 font-semibold rounded-r-lg transition duration-200 ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' && <LoginForm />}
            {activeTab === 'register' && <RegisterForm />}
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setActiveTab('elections')}
                data-testid="tab-elections"
                className={`px-6 py-2 font-semibold rounded-l-lg transition duration-200 ${
                  activeTab === 'elections'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Elections
              </button>
              <button
                onClick={() => setActiveTab('results')}
                data-testid="tab-results"
                className={`px-6 py-2 font-semibold rounded-r-lg transition duration-200 ${
                  activeTab === 'results'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Results
              </button>
            </div>

            {activeTab === 'elections' && <ElectionsList />}
            {activeTab === 'results' && <Results />}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Developed by: Hasnain Rasheed (BSEF22M519)</p>
          <p className="mt-1">Software Quality Engineering Project</p>
        </div>
      </div>
    </div>
  );
};

export default VotingSystem;