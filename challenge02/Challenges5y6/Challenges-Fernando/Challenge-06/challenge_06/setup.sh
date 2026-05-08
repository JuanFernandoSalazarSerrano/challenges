#!/usr/bin/env bash

# Script de Instalación y Ejecución - Challenge 06
# Este script configura e inicia la aplicación

echo "╔════════════════════════════════════════════════════════╗"
echo "║       Challenge 06 - Ionic React Application           ║"
echo "║    Almacenamiento y Sensores - Setup y Ejecución       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Verificar que Node.js esté instalado
echo "✓ Verificando requisitos previos..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "✗ npm no está instalado"
    exit 1
fi

echo "✓ Node.js v$(node -v) detectado"
echo "✓ npm v$(npm -v) detectado"
echo ""

# Instalar Ionic CLI si no está presente
echo "✓ Verificando Ionic CLI..."
if ! command -v ionic &> /dev/null; then
    echo "Installing Ionic CLI..."
    npm install -g @ionic/cli
fi
echo ""

# Instalar dependencias del proyecto
echo "✓ Instalando dependencias del proyecto..."
npm install

if [ $? -ne 0 ]; then
    echo "✗ Error al instalar dependencias"
    exit 1
fi
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "✓ Instalación completada exitosamente"
echo ""
echo "Comandos disponibles:"
echo "  • npm run dev          - Ejecutar en modo desarrollo"
echo "  • ionic serve          - Ejecutar con recarga en vivo"
echo "  • npm run build        - Construir para producción"
echo "  • npm run preview      - Previsualizar compilación"
echo ""
echo "Para iniciar, ejecuta:"
echo "  npm run dev"
echo ""
echo "La aplicación estará disponible en: http://localhost:5173"
echo "═══════════════════════════════════════════════════════════"
