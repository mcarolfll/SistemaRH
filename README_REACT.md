# 🎯 Sistema de Gestão de RH - React + Node.js

Sistema completo e moderno para gerenciamento de candidatos e empresas desenvolvido com React, Node.js, Express e MySQL.

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-4479A1?style=flat&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)

## 📋 Funcionalidades

### ✨ Funcionalidades Principais

- ✅ **CRUD Completo**
  - Cadastro de Candidatos
  - Cadastro de Empresas
  - Edição de registros
  - Exclusão de registros
  - Visualização detalhada

- 🔍 **Sistema de Busca**
  - Busca em tempo real
  - Filtro por nome, e-mail, cargo (candidatos)
  - Filtro por nome, CNPJ, e-mail (empresas)
  - Contador de resultados

- 📊 **Dashboard e Estatísticas**
  - Estatísticas em tempo real
  - Contador de candidatos e empresas
  - Interface moderna e intuitiva


## 📁 Estrutura do Projeto

```
sistema-rh-react/
├── public/
│   └── index.html
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Alert.jsx
│   │   ├── SearchBar.jsx
│   │   └── EmptyState.jsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Candidatos/
│   │   │   ├── ListaCandidatos.jsx
│   │   │   ├── CadastrarCandidato.jsx
│   │   │   ├── EditarCandidato.jsx
│   │   │   └── VerCandidato.jsx
│   │   └── Empresas/
│   │       ├── ListaEmpresas.jsx
│   │       ├── CadastrarEmpresa.jsx
│   │       ├── EditarEmpresa.jsx
│   │       └── VerEmpresa.jsx
│   ├── services/          # Serviços de API
│   │   └── api.js
│   ├── utils/             # Utilitários
│   │   └── masks.js
│   ├── styles/            # Estilos
│   │   └── App.css
│   ├── App.jsx
│   └── main.jsx
├── server/                # Backend Node.js
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── candidatos.js
│   │   ├── empresas.js
│   │   └── stats.js
│   └── index.js
├── package.json
├── vite.config.js
├── .env.example
└── README_REACT.md
```




