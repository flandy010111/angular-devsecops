// ⚠️ VULN: Credentiale hardcodate — Gitleaks va detecta acestea
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",

  // GitHub Personal Access Token (fake)
  GITHUB_TOKEN: "ghp_R4nd0mT0k3nV4lu3F0rD3m0Purp0s3sOnly1",

  // Generic API secret
  API_SECRET: "password123_super_secret_key_do_not_share",

  // Database connection string cu parola
  DB_PASSWORD: "mongodb+srv://admin:P4ssw0rd123@cluster0.example.net/students",
};
