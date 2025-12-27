# AssessAI Frontend

React + Vite frontend for AssessAI project.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

The application will start on `http://localhost:5173` (default Vite port).

## Backend

Make sure the API Gateway is running on `http://localhost:8081`.

If endpoints are not available, the frontend will automatically use mock implementations (check console for warnings).

## Login

- Use any email and password (demo mode)
- Select role: "Etudiant" or "Enseignant"
- Redirects automatically based on role
