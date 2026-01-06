# 🏠 Mini-Airbnb Backend API

REST API pentru o platformă de rezervare apartamente, construită cu **Node.js**, **Express** și **PostgreSQL**.

---

## 📦 Tech Stack

* **Node.js** + **Express.js** – Backend framework
* **PostgreSQL** – Database
* **bcrypt** – Password hashing
* **express-session** – Session-based authentication
* **multer** – File uploads (CSV)

---

## ✨ Features

### 🔐 Authentication

* Register / Login / Logout
* Parole criptate cu **bcrypt**
* Autentificare pe bază de **sessions**

### 🏠 Apartments

* CRUD complet (Create, Read, Update, Delete)
* Import apartamente din fișiere **CSV**
* Export date în format **CSV**

### 📅 Reservations

* Creare, vizualizare și anulare rezervări
* Prevenirea suprapunerii rezervărilor (date overlap check)

### 📊 CSV Management

* Validare fișiere la import (structură, tip, date)
* Export CSV cu **filtre personalizate**

### 🛡️ Security & Access

* Protecție împotriva **SQL Injection**
* **Role-based access control** (ex: admin / user)

---

## 🔒 Security

Aplicația implementează mai multe măsuri de securitate:

* ✅ **Password hashing** folosind bcrypt
* ✅ **Session-based authentication** cu cookies `httpOnly`
* ✅ **Prepared statements** pentru prevenirea SQL Injection
* ✅ **Validare input**:

  * email
  * IDNP
  * date calendaristice
  * prețuri
* ✅ **Validare fișiere**:

  * tip fișier (CSV)
  * dimensiune
* ✅ **Control acces pe roluri** (RBAC)

---

## 📁 Project Structure (overview)

```
mini-airbnb-backend/
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
├── uploads/
├── config/
├── app.js
└── package.json
```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Configure environment variables

Creează un fișier `.env`:

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/mini_airbnb
SESSION_SECRET=your_secret_key
```

### 3️⃣ Run the server

```bash
npm run dev
```

Serverul va porni pe `http://localhost:3000`.

---

## 📌 Notes

* Proiect realizat ca **backend clean architecture**
* Potrivit pentru integrare cu un frontend (React / Vue / etc.)
* Ideal pentru demonstrarea competențelor de **Backend Developer / Intern**

---

## 👤 Author

**Bogdan Botnari**
