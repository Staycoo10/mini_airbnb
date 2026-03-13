import { useState, useEffect } from 'react';
import api from './services/api';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';
import Message from './Components/layout/Message';
import LoginForm from './Components/auth/LoginForm';
import RegisterForm from './Components/auth/RegisterForm';
import ApartmentList from './Components/apartments/ApartmentList';
import CreateApartmentForm from './Components/apartments/CreateApartmentForm';
import ReservationList from './Components/reservations/ReservationList';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [apartments, setApartments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const data = await api.call('/auth/me');
      setUser(data.user);
      setPage('apartments');
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // AUTH
  const handleLogin = async (e) => {
  e.preventDefault();
  const form = e.target;
  try {
    const data = await api.call('/auth/login', {  // ← IMPORTANT: /auth/login
      method: 'POST',
      body: JSON.stringify({ 
        email: form.email.value, 
        password: form.password.value 
      })
    });
    setUser(data.user);
    setPage('apartments');
    showMessage('Welcome back! 🎉');
  } catch (err) {
    showMessage(err.message, 'error');
  }
};

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const data = await api.call('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          idnp: form.idnp.value,
          password: form.password.value,
          role: form.role.value
        })
      });
      setUser(data.user);
      setPage('apartments');
      showMessage('Account created! 🎉');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await api.call('/auth/logout', { method: 'POST' });
      setUser(null);
      setPage('login');
      showMessage('Logged out successfully');
    } catch (err) {
      showMessage('Logout failed', 'error');
    }
  };

  // APARTMENTS
  const loadApartments = async () => {
    try {
      const data = await api.call('/apartments');
      setApartments(data);
    } catch (err) {
      showMessage('Failed to load apartments', 'error');
    }
  };

  const handleCreateApartment = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await api.call('/apartments', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title.value,
          description: form.description.value,
          price: parseFloat(form.price.value),
          location: form.location.value
        })
      });
      showMessage('Apartment created! ✨');
      form.reset();
      setShowCreateForm(false);
      loadApartments();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!window.confirm('Delete this apartment?')) return;
    try {
      await api.call(`/apartments/${id}`, { method: 'DELETE' });
      showMessage('Apartment deleted');
      loadApartments();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  // RESERVATIONS
  const loadMyReservations = async () => {
    try {
      const data = await api.call('/reservations/my-reservations');
      setReservations(data.reservations);
    } catch (err) {
      showMessage('Failed to load reservations', 'error');
    }
  };

  const handleCreateReservation = async (apartmentId, apartmentTitle) => {
    const startDate = prompt('Check-in date (YYYY-MM-DD):');
    const endDate = prompt('Check-out date (YYYY-MM-DD):');
    if (!startDate || !endDate) return;

    try {
      const data = await api.call('/reservations', {
        method: 'POST',
        body: JSON.stringify({ apartment_id: apartmentId, start_date: startDate, end_date: endDate })
      });
      showMessage(`Reserved "${apartmentTitle}" for $${data.totalPrice}! 🎉`);
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await api.call(`/reservations/${id}`, { method: 'DELETE' });
      showMessage('Reservation cancelled');
      loadMyReservations();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  useEffect(() => {
    if (page === 'apartments') loadApartments();
    if (page === 'reservations') loadMyReservations();
  }, [page]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading...</div>;
  }

  // LOGIN/REGISTER
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🏠</div>
            <h1 className="text-3xl font-bold text-gray-900">Mini-Airbnb</h1>
            <p className="text-gray-600 mt-2">Find your perfect stay</p>
          </div>

          <Message text={message.text} type={message.type} />

          {page === 'login' ? (
            <LoginForm onSubmit={handleLogin} onSwitchToRegister={() => setPage('register')} />
          ) : (
            <RegisterForm onSubmit={handleRegister} onSwitchToLogin={() => setPage('login')} />
          )}
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} currentPage={page} onPageChange={setPage} onLogout={handleLogout} />
      <Message text={message.text} type={message.type} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {page === 'apartments' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {apartments.length} stays available
              </h1>
              {user.role === 'admin' && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  {showCreateForm ? '✕ Cancel' : '+ Add new stay'}
                </button>
              )}
            </div>

            {showCreateForm && (
              <CreateApartmentForm 
                onSubmit={handleCreateApartment} 
                onCancel={() => setShowCreateForm(false)} 
              />
            )}

            <ApartmentList
              apartments={apartments}
              isAdmin={user.role === 'admin'}
              onReserve={handleCreateReservation}
              onDelete={handleDeleteApartment}
            />
          </>
        )}

        {page === 'reservations' && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your trips</h1>
            <ReservationList
              reservations={reservations}
              onCancel={handleCancelReservation}
              onGoToApartments={() => setPage('apartments')}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}