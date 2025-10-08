# All Turismo Admin

Aplicação web responsiva para gestão de dados do aplicativo All Turismo, construída com Angular 20.2 e Angular Material.

## 🚀 Tecnologias

- **Angular 20.2** – Framework principal
- **Angular Material 20** – Biblioteca de componentes UI
- **SCSS** – Pré-processador CSS
- **TypeScript 5.9** – Linguagem de programação
- **ESLint (Angular ESLint 20)** – Linting de código com regras oficiais da equipe Angular
- **Prettier 3** – Formatação de código

## 📁 Estrutura do Projeto

```text
src/
├── app/
│   ├── core/                 # Serviços, guards, interceptors e modelos
│   │   ├── services/         # Serviços da aplicação
│   │   ├── guards/           # Guards de rota
│   │   ├── interceptors/     # Interceptors HTTP
│   │   └── models/           # Interfaces e tipos
│   ├── shared/               # Componentes, diretivas e pipes compartilhados
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── directives/       # Diretivas customizadas
│   │   ├── pipes/            # Pipes customizados
│   │   └── utils/            # Utilitários e helpers
│   ├── features/             # Módulos de funcionalidades
│   │   ├── dashboard/        # Módulo do dashboard
│   │   └── auth/             # Módulo de autenticação
│   └── layouts/              # Layouts da aplicação
│       ├── main-layout/      # Layout principal com sidebar
│       └── auth-layout/      # Layout de autenticação
├── environments/              # Configurações de ambiente
└── assets/                    # Recursos estáticos
```

## 🛠️ Pré-requisitos

- Node.js 20+
- npm 10+

## 📦 Instalação

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd all-turismo-admin
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento:**

   ```bash
   npm start
   # ou
   ng serve
   ```

   > Para usar o ambiente de desenvolvimento/homologação (API hospedada), execute:
   >
   > ```bash
   > npm run start:dev
   > ```

   > Para usar o ambiente local (API `localhost`), execute:
   >
   > ```bash
   > npm run start:local
   > ```

4. **Abra o navegador em:** `http://localhost:4200`

## 🔧 Scripts Disponíveis

- `npm start` – Inicia o servidor de desenvolvimento
- `npm run build` – Constrói o projeto para produção
- `npm run build:dev` – Constrói o projeto para desenvolvimento (configuração `development`)
- `npm run build:hmg` – Build apontando para ambiente de homologação (`hmg`)
- `npm run build:prod` – Build otimizado para produção
- `npm run test` – Executa os testes unitários via Karma + Jasmine
- `npm run lint` – Executa o linting com Angular ESLint 20
- `npm run lint:fix` – Aplica correções automáticas do lint quando possível
- `npm run format` – Aplica formatação Prettier em arquivos `ts`, `html`, `scss` e `json`
- `npm run format:check` – Verifica se os arquivos estão formatados segundo o Prettier

## 🎨 Tema e Estilos

O projeto utiliza um tema customizado baseado na paleta azul do Angular Material, garantindo:

- Paleta de cores moderna e consistente com a identidade da All Turismo
- Componentes responsivos com tokens SCSS reaproveitáveis
- Suporte pronto para variantes claro/escuro (configurável)
- Classes utilitárias e mixins SCSS para espaçamento e layout

## 📱 Responsividade

A aplicação é totalmente responsiva e inclui:

- Layouts dedicados para telas de autenticação e painel administrativo
- Breakpoints configurados para mobile, tablet e desktop
- Componentes que se adaptam ao fluxo multi-etapas do cadastro de parceiros
- Classes utilitárias e grid responsivo para organização dos formulários

## 🧪 Testes

- **Framework:** Jasmine + Karma
- **Cobertura:** Configurada para gerar relatórios de cobertura
- **Execução:** `npm run test`

## 📋 Convenções de Código

### Nomenclatura

- **Componentes:** `kebab-case` (ex: `user-profile.component.ts`)
- **Serviços:** `kebab-case` (ex: `auth.service.ts`)
- **Interfaces:** `PascalCase` (ex: `UserProfile`)
- **Constantes:** `UPPER_SNAKE_CASE` (ex: `API_ENDPOINTS`)

### Estrutura de Arquivos

- Um arquivo por classe/interface
- Nomes descritivos e significativos
- Agrupamento lógico em pastas

### Imports

- Imports organizados por tipo (Angular, Material, terceiros, locais)
- Uso de aliases de path (@core, @shared, etc.)

## 🌐 Links de Teste

### Sistemas Publicados

- **Painel Administrativo:** [https://brave-smoke-03ac6f10f.1.azurestaticapps.net/](https://brave-smoke-03ac6f10f.1.azurestaticapps.net/)
- **Landing Page:** [https://icy-ground-0dd3e000f.1.azurestaticapps.net/](https://icy-ground-0dd3e000f.1.azurestaticapps.net/)

### Status dos Ambientes

- 🧪 **Teste:** Ativo e funcionando
- 🔄 **Deploy Automático:** Configurado via GitHub Actions
- 📊 **Monitoramento:** Azure Static Web Apps

## 🚀 Deploy

### GitHub Actions + Azure Static Web Apps

O projeto está configurado para deploy automático via GitHub Actions para Azure Static Web Apps.

### Build de Produção

```bash
npm run build
```

O build será gerado na pasta `dist/all-turismo-admin/`.

### Configuração de Deploy

- **Branch de Deploy:** `develop`
- **Trigger:** Push e Pull Requests para `develop`
- **Plataforma:** Azure Static Web Apps
- **Build Tool:** Oryx (Azure)

## 🔒 Segurança

- Configuração de CORS
- Validação de entrada
- Sanitização de dados
- Headers de segurança

## 📊 Monitoramento

- Logs estruturados
- Métricas de performance
- Tratamento de erros centralizado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com ❤️ pela equipe All Turismo.
