import { useState, useEffect, useCallback } from 'react';
import api from './services/api';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';
import Message from './Components/layout/Message';
import LoginForm from './Components/auth/LoginForm';
import RegisterForm from './Components/auth/RegisterForm';
import ApartmentList from './Components/apartments/ApartmentList';
import CreateApartmentForm from './Components/apartments/CreateApartmentForm';
import ReservationList from './Components/reservations/ReservationList';
import ReservationModal from './Components/reservations/ReservationModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [apartments, setApartments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // FIX: modal in loc de prompt()
  const [reservationModal, setReservationModal] = useState(null); // { id, title, price }

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  }, []);

  // FIX: un singur useEffect, nu duplicat
  const checkAuth = useCallback(async () => {
    try {
      const data = await api.call('/auth/me');
      setUser(data.user);
      setPage('apartments');
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // AUTH
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const data = await api.call('/auth/login', {
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
    } catch {
      // ignore
    } finally {
      setUser(null);
      setPage('login');
      showMessage('Logged out successfully');
    }
  };

  // APARTMENTS
  const loadApartments = useCallback(async () => {
    try {
      const data = await api.call('/apartments');
      setApartments(data);
    } catch {
      showMessage('Failed to load apartments', 'error');
    }
  }, [showMessage]);

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
  const loadMyReservations = useCallback(async () => {
    try {
      const data = await api.call('/reservations/my-reservations');
      setReservations(data.reservations);
    } catch {
      showMessage('Failed to load reservations', 'error');
    }
  }, [showMessage]);

  // FIX: modal in loc de prompt()
  const handleOpenReservationModal = (apartmentId, apartmentTitle, price) => {
    setReservationModal({ id: apartmentId, title: apartmentTitle, price });
  };

  const handleConfirmReservation = async (apartmentId, apartmentTitle, startDate, endDate) => {
    try {
      const data = await api.call('/reservations', {
        method: 'POST',
        body: JSON.stringify({ apartment_id: apartmentId, start_date: startDate, end_date: endDate })
      });
      showMessage(`Reserved "${apartmentTitle}" for $${data.totalPrice}! 🎉`);
      setReservationModal(null);
      loadApartments();
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
  }, [page, loadApartments, loadMyReservations]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // AUTH PAGES
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #FF385C 0%, #BD1E59 50%, #6B2D5E 100%)' }}>
        <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '580px' }}>

          {/* Left decorative panel */}
          <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current">
                <path d="M16 1C10.477 1 6 5.477 6 11c0 7.5 10 20 10 20S26 18.5 26 11c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
              </svg>
              <span className="font-bold text-white text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
                miniairbnb
              </span>
            </div>

            <div>
              <div className="text-6xl mb-6">🏠</div>
              <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Find your<br />perfect stay
              </h1>
              <p className="text-white/70 text-base leading-relaxed">
                Discover unique homes and experiences across Moldova and beyond.
              </p>
            </div>

            <p className="text-white/40 text-sm">© 2026 Mini-Airbnb</p>
          </div>

          {/* Right form panel */}
          <div className="w-full lg:w-[440px] flex-shrink-0 bg-white flex flex-col justify-center p-10">
            <div className="mb-6">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#FF385C] fill-current">
                  <path d="M16 1C10.477 1 6 5.477 6 11c0 7.5 10 20 10 20S26 18.5 26 11c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
                </svg>
                <span className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>miniairbnb</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {page === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {page === 'login' ? 'Sign in to continue' : 'Join thousands of travelers'}
              </p>
            </div>

            <Message text={message.text} type={message.type} />

            <div className="mt-4">
              {page === 'login' ? (
                <LoginForm onSubmit={handleLogin} onSwitchToRegister={() => setPage('register')} />
              ) : (
                <RegisterForm onSubmit={handleRegister} onSwitchToLogin={() => setPage('login')} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Header user={user} currentPage={page} onPageChange={setPage} onLogout={handleLogout} />

      <Message text={message.text} type={message.type} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {page === 'apartments' && (
          <div className="page-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {apartments.length} stays available
                </h1>
                <p className="text-gray-400 text-sm mt-1">Find your perfect place to stay</p>
              </div>
              {user.role === 'admin' && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    showCreateForm
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {showCreateForm ? '✕ Cancel' : '+ Add listing'}
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
              onReserve={handleOpenReservationModal}
              onDelete={handleDeleteApartment}
            />
          </div>
        )}

        {page === 'reservations' && (
          <div className="page-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Your trips
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {reservations.length} reservation{reservations.length !== 1 ? 's' : ''}
              </p>
            </div>
            <ReservationList
              reservations={reservations}
              onCancel={handleCancelReservation}
              onGoToApartments={() => setPage('apartments')}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Reservation Modal */}
      {reservationModal && (
        <ReservationModal
          apartment={reservationModal}
          onConfirm={handleConfirmReservation}
          onClose={() => setReservationModal(null)}
        />
      )}
    </div>
  );
}