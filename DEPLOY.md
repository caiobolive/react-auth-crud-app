# Deploy no GitHub Pages

Este projeto foi configurado para funcionar no GitHub Pages. Siga as instruções abaixo:

## 📋 Pré-requisitos

1. Ter o projeto no GitHub
2. Ter permissões de administrador no repositório

## 🚀 Passos para Deploy

### 1. Configurar GitHub Pages

1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. Role para baixo até **Pages**
4. Em **Source**, selecione **Deploy from a branch**
5. Em **Branch**, selecione **gh-pages** e **/(root)**
6. Clique em **Save**

### 2. Criar Branch gh-pages

```bash
# Criar e mudar para o branch gh-pages
git checkout -b gh-pages

# Fazer build do projeto
npm run build

# Adicionar arquivos de build
git add dist -f

# Commit
git commit -m "Initial gh-pages commit"

# Push do branch
git push origin gh-pages

# Voltar para o branch main
git checkout main
```

### 3. Deploy Automático (Recomendado)

Após configurar o GitHub Pages, você pode usar o script de deploy:

```bash
npm run deploy
```

## 🔧 Configurações Aplicadas

### Vite Config

- ✅ Base path configurado: `/react-auth-crud-app/`
- ✅ Build otimizado para produção

### SPA Support

- ✅ Arquivo `404.html` para redirecionamento
- ✅ Script de roteamento no `index.html`
- ✅ Suporte a rotas do React Router

## 🌐 URL do Site

Após o deploy, seu site estará disponível em:

```
https://caiobolive.github.io/react-auth-crud-app/
```

## ⚠️ Limitações

- **Backend**: GitHub Pages é estático, então funcionalidades que dependem de backend não funcionarão
- **Autenticação**: Será necessário mockar ou desabilitar autenticação real
- **API Calls**: URLs de API precisarão ser ajustadas para produção

## 🔄 Atualizações

Para atualizar o site após mudanças:

```bash
npm run deploy
```

Ou manualmente:

```bash
npm run build
git add dist -f
git commit -m "Update deploy"
git subtree push --prefix dist origin gh-pages
```

## 🐛 Troubleshooting

### Erro 404 em rotas

- Verifique se o arquivo `404.html` está na pasta `public/`
- Confirme se o script de redirecionamento está no `index.html`

### Assets não carregam

- Verifique se o `base` path no `vite.config.js` está correto
- Confirme se os caminhos dos assets estão relativos

### Build falha

- Execute `npm install` para garantir dependências
- Verifique se não há erros de lint: `npm run lint`
