# All Turismo Admin

Aplicação web responsiva para gestão de dados do aplicativo All Turismo, desenvolvida com Angular 18 e Material Design.

## 🚀 Tecnologias

- **Angular 18** - Framework principal
- **Angular Material** - Biblioteca de componentes UI
- **SCSS** - Pré-processador CSS
- **TypeScript** - Linguagem de programação
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 📁 Estrutura do Projeto

```
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

- Node.js 18+ 
- npm 9+

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

4. **Abra o navegador em:** `http://localhost:4200`

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói o projeto para produção
- `npm run build:dev` - Constrói o projeto para desenvolvimento
- `npm run test` - Executa os testes unitários
- `npm run lint` - Executa o linting do código
- `npm run lint:fix` - Corrige automaticamente problemas de linting

## 🎨 Tema e Estilos

O projeto utiliza o tema **Azure Blue** do Angular Material, que oferece:
- Paleta de cores moderna e profissional
- Componentes com design consistente
- Suporte a temas claro/escuro (configurável)
- Classes utilitárias CSS para espaçamento e layout

## 📱 Responsividade

A aplicação é totalmente responsiva e inclui:
- Breakpoints para mobile, tablet e desktop
- Classes utilitárias para ocultar/mostrar elementos
- Layout adaptativo para diferentes tamanhos de tela

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

## 🚀 Deploy

### GitHub Actions + Azure Static Web Apps
O projeto está configurado para deploy automático via GitHub Actions para Azure Static Web Apps.

### Build de Produção
```bash
npm run build
```

O build será gerado na pasta `dist/all-turismo-admin/`.

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

**Desenvolvido com ❤️ pela equipe All Turismo**
