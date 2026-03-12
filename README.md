# TruthGuard — AI-Based Fake News Detection System

A full-stack web application that uses **machine learning** to detect fake news articles.
Built with **Django REST Framework** (backend) and **React + Vite** (frontend).

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | React 18, Vite, TailwindCSS, Axios               |
| Backend     | Django 4.2, Django REST Framework, Simple JWT    |
| ML Model    | scikit-learn (TF-IDF + Logistic Regression)      |
| Database    | SQLite (dev) · PostgreSQL (production)           |
| Auth        | JWT (access + refresh tokens, blacklist)         |
| Deployment  | Frontend → Vercel · Backend → Railway            |

---

## Project Structure

```
fake-news-detector/
├── backend/                    ← Django project
│   ├── core/                   ← Main settings & URLs
│   ├── accounts/               ← User auth (register/login/logout/JWT)
│   ├── detection/              ← News analysis API + ML model
│   │   └── ml/
│   │       ├── model.py        ← FakeNewsDetector class (singleton)
│   │       └── train.py        ← Training script
│   ├── requirements.txt
│   ├── Procfile                ← Railway deployment
│   └── Dockerfile
├── frontend/                   ← React app
│   ├── src/
│   │   ├── pages/              ← Landing, Login, Register, Dashboard, History
│   │   ├── components/         ← Navbar, ProtectedRoute, LoadingSpinner
│   │   ├── context/            ← AuthContext (JWT state management)
│   │   └── services/           ← Axios API client
│   ├── vercel.json             ← Vercel SPA routing fix
│   └── Dockerfile
└── docker-compose.yml          ← Full-stack local Docker setup
```

---

## API Endpoints

| Method | Endpoint                          | Auth | Description            |
|--------|-----------------------------------|------|------------------------|
| POST   | `/api/auth/register/`             | No   | Register new user      |
| POST   | `/api/auth/login/`                | No   | Login, get JWT tokens  |
| POST   | `/api/auth/logout/`               | Yes  | Blacklist refresh token |
| GET    | `/api/auth/profile/`              | Yes  | Get current user info  |
| POST   | `/api/auth/token/refresh/`        | No   | Refresh access token   |
| POST   | `/api/detection/analyze/`         | Yes  | Analyse a news article |
| GET    | `/api/detection/history/`         | Yes  | Get paginated history  |
| DELETE | `/api/detection/history/<id>/`    | Yes  | Delete analysis record |
| GET    | `/api/detection/stats/`           | Yes  | Get user stats         |

---

## LOCAL DEVELOPMENT SETUP (Step-by-Step)

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip

---

### STEP 1 — Set up the Backend

```bash
# 1. Enter the backend folder
cd fake-news-detector/backend

# 2. Create a Python virtual environment
python -m venv venv

# 3. Activate the virtual environment
#    On macOS / Linux:
source venv/bin/activate
#    On Windows (Command Prompt):
venv\Scripts\activate
#    On Windows (PowerShell):
venv\Scripts\Activate.ps1

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Create your .env file (copy example)
cp .env.example .env
#    Open .env and change SECRET_KEY to something random, e.g.:
#    SECRET_KEY=my-super-secret-key-1234567890

# 6. Apply database migrations (creates db.sqlite3)
python manage.py migrate

# 7. (Optional) Create an admin superuser
python manage.py createsuperuser

# 8. Start the Django development server
python manage.py runserver
#    → Backend is now running at: http://localhost:8000
#    → Admin panel available at: http://localhost:8000/admin
```

> **Note:** The ML model trains automatically on first startup and saves a
> `fake_news_model.pkl` file. You will see a log message:
> `✅ Model trained and saved` — this is normal.

---

### STEP 2 — Set up the Frontend

Open a **new terminal window/tab** and:

```bash
# 1. Enter the frontend folder
cd fake-news-detector/frontend

# 2. Create your .env file
cp .env.example .env
#    The default VITE_API_URL=http://localhost:8000 is correct for local dev

# 3. Install Node.js packages
npm install

# 4. Start the React development server
npm run dev
#    → Frontend is now running at: http://localhost:5173
```

Open http://localhost:5173 in your browser. You're ready!

---

### Quick Start Checklist

```
✅ Backend running at http://localhost:8000
✅ Frontend running at http://localhost:5173
✅ Register a new account at http://localhost:5173/register
✅ Log in and go to Dashboard
✅ Paste a news article and click "Analyse Article"
✅ View your history at http://localhost:5173/history
```

---

## CLOUD DEPLOYMENT

### Deploy Backend to Railway (Free)

1. Go to https://railway.app and sign up / log in.

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Connect your GitHub account and select your repository.

4. Railway will auto-detect it's a Python project. Set the **Root Directory** to `backend`.

5. Add the following **environment variables** in Railway's Variables tab:
   ```
   SECRET_KEY         = your-random-secret-key-here
   DEBUG              = False
   ALLOWED_HOSTS      = your-railway-domain.up.railway.app
   DATABASE_URL       = (Railway provides this automatically if you add a PostgreSQL plugin)
   CORS_ALLOWED_ORIGINS = https://your-vercel-app.vercel.app
   ```

6. Add a **PostgreSQL** database: click **"Add Plugin"** → **"PostgreSQL"**.
   Railway sets `DATABASE_URL` automatically.

7. Railway will run the `Procfile` command to start your server.

8. Copy your Railway app URL — you'll need it for the frontend.

---

### Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up / log in.

2. Click **"Add New Project"** → import your GitHub repo.

3. Set the **Root Directory** to `frontend`.

4. Add an **environment variable**:
   ```
   VITE_API_URL = https://your-railway-app.up.railway.app
   ```

5. Click **Deploy**. Vercel builds and deploys automatically.

6. Your app is live at `https://your-app.vercel.app`!

---

### Docker (Full Stack — Local)

Run everything with a single command:

```bash
# From the project root (where docker-compose.yml is)
docker-compose up --build
```

This starts:
- PostgreSQL on port 5432
- Django backend on http://localhost:8000
- React frontend (nginx) on http://localhost:3000

---

## Improving the ML Model

The bundled model is trained on ~60 sample examples. For production accuracy,
replace the training data with a real dataset:

**Recommended datasets (Kaggle):**
- [Fake News Dataset](https://www.kaggle.com/c/fake-news/data) — 20,000 articles
- [LIAR Dataset](https://paperswithcode.com/dataset/liar) — 12,800 statements
- [WELFake Dataset](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification) — 72,000 articles

**To retrain with a CSV dataset:**
```python
# In detection/ml/train.py, replace TRAINING_DATA with:
import pandas as pd
df = pd.read_csv('your_dataset.csv')  # columns: 'text', 'label' (0=real, 1=fake)
TRAINING_DATA = list(zip(df['text'].tolist(), df['label'].tolist()))
```

Then retrain:
```bash
cd backend
python -c "from detection.ml.train import train_model; train_model()"
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError: No module named 'decouple'` | Run `pip install -r requirements.txt` inside your venv |
| `CORS error` in browser | Make sure `CORS_ALLOWED_ORIGINS` in `.env` includes `http://localhost:5173` |
| `401 Unauthorized` on all API calls | JWT token expired — log out and log back in |
| Model gives wrong results | Retrain with a larger dataset (see above) |
| `sqlite3.OperationalError: no such table` | Run `python manage.py migrate` |
| Port 8000 already in use | `python manage.py runserver 8001` and update `VITE_API_URL` |

---

## Environment Variables Reference

### Backend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | (required) | Django secret key — change in production |
| `DEBUG` | `True` | Set to `False` in production |
| `ALLOWED_HOSTS` | `*` | Comma-separated list of allowed hostnames |
| `DATABASE_URL` | `sqlite:///db.sqlite3` | Database connection URL |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated frontend URLs |

### Frontend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Django backend URL |
