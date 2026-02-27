import { useState, useEffect } from 'react';
import './App.css';
// API helper (folosește proxy în development)
const api = {
  async call(endpoint, options = {}) {
    // În development: /api/apartments → proxy → http://localhost:3000/api/apartments
    // În production: poți schimba la URL complet
    const baseURL = import.meta.env.PROD 
      ? 'https://your-production-api.com/api' 
      : '/api'; // ← Folosește proxy în dev
    
    const res = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return res.json();
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [apartments, setApartments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await api.call('/auth/me');
      setUser(data.user);
      setPage('apartments');
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

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
      showMessage('✅ Login successful!');
    } catch (err) {
      showMessage('❌ ' + err.message);
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
      showMessage('✅ Registration successful!');
    } catch (err) {
      showMessage('❌ ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.call('/auth/logout', { method: 'POST' });
      setUser(null);
      setPage('login');
      showMessage('✅ Logged out');
    } catch (err) {
      showMessage('❌ Logout failed');
    }
  };

  // APARTMENTS
  const loadApartments = async () => {
    try {
      const data = await api.call('/apartments');
      setApartments(data);
    } catch (err) {
      showMessage('❌ Failed to load apartments');
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
      showMessage('✅ Apartment created!');
      form.reset();
      loadApartments();
    } catch (err) {
      showMessage('❌ ' + err.message);
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!confirm('Delete this apartment?')) return;
    try {
      await api.call(`/apartments/${id}`, { method: 'DELETE' });
      showMessage('✅ Deleted!');
      loadApartments();
    } catch (err) {
      showMessage('❌ ' + err.message);
    }
  };

  // RESERVATIONS
  const loadMyReservations = async () => {
    try {
      const data = await api.call('/reservations/my-reservations');
      setReservations(data.reservations);
    } catch (err) {
      showMessage('❌ Failed to load reservations');
    }
  };

  const handleCreateReservation = async (apartmentId) => {
    const startDate = prompt('Start date (YYYY-MM-DD):');
    const endDate = prompt('End date (YYYY-MM-DD):');
    if (!startDate || !endDate) return;

    try {
      const data = await api.call('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          apartment_id: apartmentId,
          start_date: startDate,
          end_date: endDate
        })
      });
      showMessage(`✅ Reserved! Total: $${data.totalPrice} for ${data.days} days`);
    } catch (err) {
      showMessage('❌ ' + err.message);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await api.call(`/reservations/${id}`, { method: 'DELETE' });
      showMessage('✅ Reservation cancelled');
      loadMyReservations();
    } catch (err) {
      showMessage('❌ ' + err.message);
    }
  };

  useEffect(() => {
    if (page === 'apartments') loadApartments();
    if (page === 'reservations') loadMyReservations();
  }, [page]);

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>;

  // LOGIN/REGISTER
  if (!user) {
    return (
      <div style={{maxWidth: '500px', margin: '40px auto', padding: '20px'}}>
        <h1>🏠 Mini-Airbnb</h1>
        
        {message && <div style={{padding: '12px', background: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '16px'}}>{message}</div>}

        {page === 'login' ? (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <input name="email" type="email" placeholder="Email" required style={{padding: '8px', fontSize: '16px'}} />
              <input name="password" type="password" placeholder="Password" required style={{padding: '8px', fontSize: '16px'}} />
              <button type="submit" style={{padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'}}>Login</button>
            </form>
            <p style={{marginTop: '16px'}}>
              Don't have an account? <button onClick={() => setPage('register')} style={{background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline'}}>Register</button>
            </p>
          </div>
        ) : (
          <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <input name="name" placeholder="Full Name" required style={{padding: '8px', fontSize: '16px'}} />
              <input name="email" type="email" placeholder="Email" required style={{padding: '8px', fontSize: '16px'}} />
              <input name="idnp" placeholder="IDNP (13 digits)" maxLength="13" required style={{padding: '8px', fontSize: '16px'}} />
              <input name="password" type="password" placeholder="Password" required style={{padding: '8px', fontSize: '16px'}} />
              <select name="role" style={{padding: '8px', fontSize: '16px'}}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={{padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'}}>Register</button>
            </form>
            <p style={{marginTop: '16px'}}>
              Already have an account? <button onClick={() => setPage('login')} style={{background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline'}}>Login</button>
            </p>
          </div>
        )}
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <div style={{background: '#2563eb', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
        <h1>🏠 Mini-Airbnb</h1>
        <p>Welcome, <strong>{user.name}</strong> ({user.role})</p>
        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
          <button onClick={() => setPage('apartments')} style={{padding: '8px 16px', background: page === 'apartments' ? '#1e40af' : '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Apartments</button>
          <button onClick={() => setPage('reservations')} style={{padding: '8px 16px', background: page === 'reservations' ? '#1e40af' : '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>My Reservations</button>
          <button onClick={handleLogout} style={{padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Logout</button>
        </div>
      </div>

      {message && <div style={{padding: '12px', background: '#ecfdf5', color: '#059669', borderRadius: '4px', marginBottom: '20px', textAlign: 'center'}}>{message}</div>}

      {page === 'apartments' && (
        <div>
          <h2>Apartments ({apartments.length})</h2>

          {user.role === 'admin' && (
            <div style={{background: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
              <h3>Admin: Create Apartment</h3>
              <form onSubmit={handleCreateApartment} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <input name="title" placeholder="Title" required style={{padding: '8px'}} />
                <textarea name="description" placeholder="Description" required style={{padding: '8px'}} rows="3"></textarea>
                <input name="price" type="number" step="0.01" placeholder="Price per night" required style={{padding: '8px'}} />
                <input name="location" placeholder="Location" required style={{padding: '8px'}} />
                <button type="submit" style={{padding: '10px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Create Apartment</button>
              </form>
            </div>
          )}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'}}>
            {apartments.map(apt => (
              <div key={apt.id} style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px'}}>
                <h3>{apt.title}</h3>
                <p>{apt.description}</p>
                <p>📍 {apt.location}</p>
                <p>💰 ${apt.price}/night</p>
                <p>Status: {apt.is_available ? '✅ Available' : '❌ Not Available'}</p>
                <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                  {apt.is_available && <button onClick={() => handleCreateReservation(apt.id)} style={{padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Reserve</button>}
                  {user.role === 'admin' && <button onClick={() => handleDeleteApartment(apt.id)} style={{padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === 'reservations' && (
        <div>
          <h2>My Reservations ({reservations.length})</h2>
          {reservations.length === 0 ? (
            <p>No reservations yet. Book an apartment!</p>
          ) : (
            <div>
              {reservations.map(res => (
                <div key={res.id} style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '12px'}}>
                  <h3>{res.apartment_title}</h3>
                  <p>📍 {res.apartment_location}</p>
                  <p>📅 {res.start_date} to {res.end_date} ({res.days} days)</p>
                  <p>💰 Total: ${res.total_price}</p>
                  <p>Status: {res.status === 'active' ? '✅ Active' : '❌ Cancelled'}</p>
                  {res.status === 'active' && <button onClick={() => handleCancelReservation(res.id)} style={{padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Cancel Reservation</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}