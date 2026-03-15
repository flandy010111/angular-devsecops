# 🔒 Pipeline DevSecOps — Angular + Deploy pe Render

## Despre Proiect

Pipeline CI/CD complet cu **GitHub Actions** care integreaza verificari de securitate
automate pe o aplicatie **Angular** (Portal Studenti), cu **deploy automat pe Render**
doar dupa ce toate scanarile de securitate trec cu succes.

```
┌───────────────────────────────────────────────────────────────────────┐
│                    PIPELINE DevSecOps — Angular                       │
│                                                                       │
│  push/PR → install → quality-gate ─────────────────────┐              │
│               │         (ESLint + Karma + ng build)     │              │
│               │                                         │              │
│               ├── SAST (Semgrep JS/TS/Angular) ─────────┤              │
│               ├── SCA  (Trivy + npm audit) ─────────────┤              │
│               └── Secrets (Gitleaks) ───────────────────┤              │
│                                                         │              │
│              docker-build-scan (Trivy imagine nginx) ◄──┘              │
│                        │                                               │
│               deploy-render ← doar daca TOTUL a trecut                │
│                        │                                               │
│               security-summary (raport final)                          │
│                        │                                               │
│           🌐 https://student-portal.onrender.com                      │
└───────────────────────────────────────────────────────────────────────┘
```

---

## De Ce Este Un Proiect Cloud?

Acest proiect demonstreaza securitatea aplicatiilor cloud pe mai multe niveluri:

1. **Pipeline-ul ruleaza in cloud** — GitHub Actions porneste containere efemere
   pe servere Microsoft Azure la fiecare push
2. **Imaginea Docker** este construita si scanata in cloud, apoi deployata pe Render
3. **Modelul Shared Responsibility** — cloud provider-ul (Render) securizeaza
   infrastructura, iar noi securizam aplicatia, dependentele si configurarile
4. **Supply Chain Security** — verificam fiecare dependenta npm si fiecare pachet
   din imaginea Docker inainte sa ajunga in productie
5. **Secretele in cloud** — Gitleaks previne expunerea accidentala de credentiale
   in cod care e hostat public pe GitHub
6. **Security Headers** — CSP, X-Frame-Options etc. protejeaza aplicatia web
   expusa pe internet prin Render

---

## Componente de Securitate

| # | Componenta | Instrument | Ce Face |
|---|-----------|-----------|---------|
| 1 | SAST | Semgrep | Detecteaza SQL injection, XSS, eval(), secrets hardcodate |
| 2 | SCA | Trivy + npm audit | Scaneaza CVE-uri in package-lock.json |
| 3 | Secrete | Gitleaks | Cauta API keys/parole in Git history |
| 4 | Container | Trivy | Scaneaza imaginea nginx:alpine |
| 5 | Quality | ESLint + Karma | Linting + teste unitare |
| 6 | Deploy | Render | Deploy automat DOAR daca totul trece |

### Vulnerabilitati Plantate (Demo SAST)

| Vulnerabilitate | Fisier | Ce Detecteaza Semgrep |
|-----------------|--------|----------------------|
| `eval()` pe date externe | `student.service.ts` | Code injection |
| API key hardcodat | `student.service.ts` | Hardcoded secret |
| `bypassSecurityTrustHtml()` | `student-search.component.ts` | XSS |
| Input interpolat in URL | `student.service.ts` | URL injection |

---

## Structura Proiectului

```
angular-devsecops/
├── .github/workflows/
│   └── devsecops-pipeline.yml      ← Pipeline complet (9 etape)
├── nginx/
│   ├── nginx.conf                   ← Config nginx global
│   └── default.conf.template        ← Template cu $PORT dinamic (Render)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/           ← Statistici
│   │   │   ├── student-list/        ← Lista studenti
│   │   │   └── student-search/      ← Cautare (⚠️ XSS demo)
│   │   ├── models/                  ← Interfete TypeScript
│   │   ├── services/                ← HTTP service (⚠️ eval, hardcoded key)
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   ├── index.html
│   └── main.ts
├── Dockerfile                        ← Multi-stage: node → nginx + PORT dinamic
├── render.yaml                       ← Render Blueprint (IaC)
├── angular.json
├── eslint.config.js
├── karma.conf.js
├── package.json
└── README.md
```

---

## Ghid Complet de Instalare

### Pas 1 — Creeaza repository pe GitHub
```bash
# Creeaza un repo PUBLIC pe github.com, apoi:
git clone https://github.com/UTILIZATOR/angular-devsecops.git
cd angular-devsecops
```

### Pas 2 — Copiaza fisierele
Dezarhiveaza ZIP-ul in repository-ul tau.

### Pas 3 — Configurare Render (5 minute)

**3a. Creeaza cont pe Render:**
1. Mergi la [render.com](https://render.com) → **Sign Up** cu GitHub
2. Nu e nevoie de card de credit!

**3b. Creeaza serviciul web:**
1. Dashboard → **New** → **Web Service**
2. Conecteaza repository-ul tau GitHub
3. Render va detecta `Dockerfile`-ul automat
4. Setari:
   - **Name:** `student-portal` (sau ce vrei tu)
   - **Region:** `Frankfurt` sau `Oregon`
   - **Instance Type:** **Free**
   - **Branch:** `main`
5. Click **Create Web Service**

**3c. Obtine Deploy Hook URL:**
1. In Render Dashboard → serviciul tau → **Settings**
2. Scroll la **Deploy Hook** → copiaza URL-ul
   (arata ca: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)

**3d. Configureaza GitHub Secrets:**
1. Pe GitHub → repo-ul tau → **Settings** → **Secrets and variables** → **Actions**
2. Adauga **secret** (butonul "New repository secret"):
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: URL-ul copiat de la Render
3. Adauga **variable** (tab-ul "Variables" → "New repository variable"):
   - Name: `RENDER_APP_URL`
   - Value: `https://student-portal.onrender.com` (URL-ul tau de pe Render)

**3e. (Optional) Configureaza GitHub Environment:**
1. **Settings** → **Environments** → **New environment** → nume: `production`
2. Adauga variabila `RENDER_APP_URL` aici

### Pas 4 — Test local (optional)
```bash
npm install
ng serve                    # http://localhost:4200
ng test                     # teste unitare
ng lint                     # ESLint

# Docker local:
docker build -t student-portal .
docker run -p 8080:8080 student-portal
# → http://localhost:8080
```

### Pas 5 — Push si urmareste magia
```bash
git add .
git commit -m "feat: pipeline DevSecOps cu deploy Render"
git push origin main
```

**Ce se intampla automat:**
1. GitHub Actions porneste pipeline-ul
2. ESLint + Teste unitare ruleaza
3. Semgrep scaneaza codul pentru vulnerabilitati
4. Trivy + npm audit scaneaza dependentele
5. Gitleaks verifica secretele din Git history
6. Docker build + Trivy scaneaza imaginea
7. **Deploy pe Render** (doar daca TOTUL a trecut!)
8. Health check verifica ca aplicatia e live
9. Raport de securitate generat automat

### Pas 6 — Verifica rezultatele
- **GitHub Actions** → tab-ul **Actions** → vezi pipeline-ul
- **GitHub Security** → tab-ul **Security** → **Code scanning alerts**
- **Render** → Dashboard → vezi deploy-ul live
- **Aplicatia live** → `https://student-portal.onrender.com`

---

## Cum Functioneaza Deploy-ul Securizat

```
git push → [Scanari securitate] → PASS? ─── Da ──→ Deploy Render → Live!
                                     │
                                     └── Nu ───→ BLOCAT ❌ (nu se deployeaza)
```

Cheia este ca job-ul `deploy-render` are `needs: docker-build-scan`,
iar `docker-build-scan` depinde la randul lui de `sast-scan`, `dependency-scan`
si `secrets-scan`. Deci deploy-ul nu se face NICIODATA daca vreo scanare esueaza.

Asta e principiul **Security Gate** din DevSecOps — securitatea nu e optionala,
e o conditie obligatorie pentru deploy.

---

## Trecerea la Mod Strict

Initial, pipeline-ul nu blocheaza deploy-ul (pentru a vedea rapoartele).
Cand esti gata sa treci la modul strict:

```yaml
# In workflow, schimba la pasii Trivy:
exit-code: "0"    →    exit-code: "1"

# La Semgrep, elimina:
continue-on-error: true
```

Acum orice vulnerabilitate CRITICA sau HIGH va bloca deploy-ul automat.

---

## Nota despre Free Tier Render

- **Cold start:** Containerul se opreste dupa ~15 min de inactivitate.
  Prima cerere dupa pauza dureaza ~30-60 secunde.
- **Limitari:** 750 ore/luna de rulare (suficient pentru un proiect de facultate).
- **Custom domain:** Poti adauga propriul domeniu gratuit.
- **HTTPS:** Inclus automat, certificat TLS gratuit.

---

## Instrumente Folosite

| Instrument | Rol | Cost |
|-----------|-----|------|
| [Semgrep CE](https://semgrep.dev) | SAST | Gratuit |
| [Trivy](https://trivy.dev) | SCA + Container | Gratuit |
| [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) | SCA npm | Gratuit |
| [Gitleaks](https://gitleaks.io) | Secret detection | Gratuit |
| [ESLint](https://eslint.org) | Linting | Gratuit |
| [Karma](https://karma-runner.github.io) + Jasmine | Teste | Gratuit |
| [GitHub Actions](https://github.com/features/actions) | CI/CD | Gratuit (public repos) |
| [Render](https://render.com) | Cloud Deploy | Gratuit (free tier) |
| [GHCR](https://ghcr.io) | Container Registry | Gratuit (public repos) |

**Cost total: 0 lei / 0 EUR / 0 USD**

---

## Licenta
MIT — Proiect educational
