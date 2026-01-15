@echo off
title Sistema RH - Inicializador
echo ==========================================
echo      INICIANDO SISTEMA DE RH
echo ==========================================
echo.

REM Verifica se o Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js para rodar o sistema.
    echo Baixe em: https://nodejs.org/
    pause
    exit
)

echo 1. Verificando dependencias do backend...
cd backend
if not exist node_modules (
    echo    - Primeira execucao detectada. Instalando pacotes...
    call npm install
    echo    - Dependencias instaladas com sucesso.
) else (
    echo    - Dependencias ja instaladas.
)

echo.
echo 2. Iniciando Servidor Backend (API)...
echo    - O servidor abrira em uma nova janela.
echo    - NAO FECHE essa nova janela enquanto usar o sistema.
start "Servidor Backend RH (Porta 5002)" cmd /k "npm start"

echo.
echo 3. Aguardando inicializacao do servidor...
timeout /t 5 >nul

echo.
echo 4. Abrindo o Frontend no navegador...
cd ..
start index.html

echo.
echo ==========================================
echo      SISTEMA INICIADO COM SUCESSO
echo ==========================================
echo.
echo Para fechar o sistema, feche a janela do navegador e a janela preta do servidor.
echo.
pause
