# VibeU

Plataforma acadêmica com stack **React + Spring Boot + PostgreSQL**, containerizada com Docker.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React, TypeScript, Vite |
| Backend | Java 21, Spring Boot 4, Spring Security, JPA, Flyway |
| Banco | PostgreSQL 16 |
| Infra | Docker, Docker Compose |

## Estrutura do projeto

```
VibeU/
├── frontend/              # Aplicação React
├── backend/               # API Spring Boot
├── database/
│   ├── migrations/        # Scripts Flyway (fonte de verdade do schema)
│   ├── seeds/             # Dados iniciais para desenvolvimento
│   └── backups/           # Dumps locais (não versionados)
├── docker/
│   ├── nginx/             # Config do Nginx
│   ├── pgadmin/           # Servidor PostgreSQL pré-configurado no pgAdmin
│   └── postgres/init/     # Scripts de inicialização do PostgreSQL
├── scripts/               # Backup e restore do banco
├── docker-compose.yml     # Stack completa
└── .env.example
```

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose v2+

## Configuração inicial

```bash
git clone <url-do-repositorio>
cd VibeU
cp .env.example .env
# Ajuste senhas e secrets no .env (nunca commite o .env)
```

## Subir o projeto

```bash
docker compose up -d --build
```

Aguarde até 60s para todos os serviços ficarem healthy.

| Serviço | URL |
|---------|-----|
| Frontend | http://127.0.0.1:80 |
| Backend | http://127.0.0.1:8080 |
| Swagger | http://127.0.0.1:8080/swagger-ui |
| pgAdmin | http://127.0.0.1:5050 |
| PostgreSQL | localhost:5432 |

### Credenciais

| Ferramenta | Login |
|------------|-------|
| pgAdmin | `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` do `.env` |
| PostgreSQL (pgAdmin) | usuário `vibeu` + `POSTGRES_PASSWORD` do `.env` |

O servidor **VibeU** já vem pré-configurado no pgAdmin.

### Parar o projeto

```bash
docker compose down
```

### Variáveis importantes (.env)

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_*` | Credenciais e porta do banco |
| `PGADMIN_*` | Login do pgAdmin |
| `BACKEND_PORT` | Porta do backend (padrão: `8080`) |
| `FRONTEND_PORT` | Porta do frontend (padrão: `80`) |
| `VITE_API_URL` | URL da API usada no build do frontend |
| `JWT_SECRET` | Chave para tokens JWT (mín. 32 caracteres) |

## Migrations (Flyway)

Scripts em `database/migrations/`. O Maven copia automaticamente para o classpath do backend.

```bash
touch database/migrations/V2__descricao_da_mudanca.sql
```

Convenção: `V{versão}__{descricao}.sql`

Após reiniciar o backend, o Flyway aplica as migrations pendentes automaticamente.

## Backup e restore

```bash
chmod +x scripts/backup-db.sh scripts/restore-db.sh
./scripts/backup-db.sh
./scripts/restore-db.sh database/backups/vibeu_YYYYMMDD_HHMMSS.sql
```

## Comunicação entre containers

| Origem | Destino | Endereço |
|--------|---------|----------|
| Backend | PostgreSQL | `postgres:5432` |
| pgAdmin | PostgreSQL | `postgres:5432` |
| Frontend (browser) | Backend | `http://localhost:8080` |

> Dentro de containers, use o **nome do serviço** (`postgres`), nunca `localhost`.

## Conflitos comuns

- **Porta ocupada:** altere `POSTGRES_PORT`, `BACKEND_PORT` ou `FRONTEND_PORT` no `.env`
- **URLs inacessíveis:** reinicie o Docker Desktop e rode `docker compose down && docker compose up -d --build`
- **Use `127.0.0.1`** em vez de `localhost` se houver problema com IPv6
- **Volume corrompido:** `docker compose down -v` (apaga todos os dados!)

## Testes

```bash
cd backend
./mvnw test
```

Os testes usam H2 em memória (perfil `test`), sem depender do PostgreSQL.

## Licença

Projeto acadêmico — VibeU.
