@echo off
REM Script de Instalación y Ejecución - Challenge 06 (Windows)
REM Este script configura e inicia la aplicación

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║       Challenge 06 - Ionic React Application           ║
echo ║    Almacenamiento y Sensores - Setup y Ejecución       ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Verificar que Node.js esté instalado
echo ✓ Verificando requisitos previos...
node -v >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js no está instalado
    exit /b 1
)

npm -v >nul 2>&1
if errorlevel 1 (
    echo ✗ npm no está instalado
    exit /b 1
)

echo ✓ Node.js detectado
echo ✓ npm detectado
echo.

REM Verificar Ionic CLI
echo ✓ Verificando Ionic CLI...
ionic -v >nul 2>&1
if errorlevel 1 (
    echo Installing Ionic CLI...
    call npm install -g @ionic/cli
)
echo.

REM Instalar dependencias del proyecto
echo ✓ Instalando dependencias del proyecto...
call npm install

if errorlevel 1 (
    echo ✗ Error al instalar dependencias
    exit /b 1
)
echo.

echo ═══════════════════════════════════════════════════════════
echo ✓ Instalación completada exitosamente
echo.
echo Comandos disponibles:
echo   • npm run dev          - Ejecutar en modo desarrollo
echo   • ionic serve          - Ejecutar con recarga en vivo
echo   • npm run build        - Construir para producción
echo   • npm run preview      - Previsualizar compilación
echo.
echo Para iniciar, ejecuta:
echo   npm run dev
echo.
echo La aplicación estará disponible en: http://localhost:5173
echo ═══════════════════════════════════════════════════════════
echo.

pause
