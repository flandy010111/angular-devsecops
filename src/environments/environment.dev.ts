// ⚠️ VULN: Credentiale hardcodate — Gitleaks va detecta acestea
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",

  // AWS credentials (fake - doar pentru demo Gitleaks)
  AWS_ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE",
  AWS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",

  // Database connection string cu parola
  DATABASE_URL:
    "postgresql://admin:SuperSecret123!@db.example.com:5432/students",
};
