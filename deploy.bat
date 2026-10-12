@echo off
rem ==================================================================
rem  RATON CAFE - Despliegue automatico a GitHub Pages (Windows)
rem  Uso: doble clic en deploy.bat  (o ejecutarlo desde esta carpeta)
rem ==================================================================
chcp 65001 >nul
setlocal
title Raton Cafe - Despliegue a GitHub Pages

echo.
echo ================================================================
echo   RATON CAFE ^> Despliegue automatico a GitHub Pages
echo   Destino: https://coiponorte.github.io/Raton-Cafe/
echo ================================================================
echo.

rem ---- [1/6] Comprobar que npm existe --------------------------------
rem NOTA: dentro de un bloque if (...) no puede haber parentesis en los
rem echo, porque cmd cierra el bloque antes de tiempo y falla.
echo [1/6] Comprobando que npm esta instalado...
where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] No se encontro npm en el sistema.
  echo         Instala Node.js, que incluye npm, desde https://nodejs.org
  echo         y vuelve a ejecutar este archivo.
  goto :error
)
for /f "delims=" %%v in ('npm -v') do set NPM_VER=%%v
echo        OK - npm %NPM_VER% detectado.
echo.

rem ---- [2/6] Scripts predeploy y deploy en package.json --------------
echo [2/6] Configurando scripts de despliegue en package.json...
call node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.scripts=p.scripts||{};p.scripts.predeploy='npm run build';p.scripts.deploy='npx gh-pages -d dist';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');console.log('       OK - scripts predeploy y deploy anadidos.');"
if errorlevel 1 (
  echo [ERROR] No se pudo actualizar package.json. Comprueba que no este abierto en otro programa.
  goto :error
)
echo.

rem ---- [3/6] Verificar o insertar base en vite.config.ts -------------
echo [3/6] Verificando base '/Raton-Cafe/' en vite.config.ts...
call node -e "const fs=require('fs');const f='vite.config.ts';let s=fs.readFileSync(f,'utf8');const q=String.fromCharCode(34);if(s.indexOf('/Raton-Cafe/')>-1){console.log('       OK - base ya configurada.');process.exit(0);}const linea='  base: '+q+'/Raton-Cafe/'+q+',';if(/base\s*:/.test(s)){s=s.replace(/base\s*:[^\n]+/,linea);}else{s=s.replace('export default defineConfig({','export default defineConfig({\n'+linea);}fs.writeFileSync(f,s);console.log('       OK - base insertada automaticamente.');"
if errorlevel 1 (
  echo [ERROR] No se pudo leer o escribir vite.config.ts
  goto :error
)
echo.

rem ---- [4/6] Instalar dependencias -----------------------------------
echo [4/6] Instalando dependencias, npm i...
call npm i
if errorlevel 1 (
  echo [ERROR] Fallo npm i. Revisa tu conexion y el archivo package.json.
  goto :error
)
echo        OK - dependencias instaladas.
echo.

rem ---- [5/6] Compilar el juego ---------------------------------------
echo [5/6] Compilando el proyecto, npm run build...
call npm run build
if errorlevel 1 (
  echo [ERROR] Fallo la compilacion. Revisa los errores de TypeScript de arriba.
  goto :error
)
echo        OK - carpeta dist generada.
echo.

rem ---- [6/6] Publicar en la rama gh-pages ----------------------------
echo [6/6] Publicando dist en GitHub Pages, rama gh-pages...
call npx gh-pages -d dist
if errorlevel 1 (
  echo [ERROR] Fallo la publicacion con gh-pages.
  echo         Comprueba que el remoto de git apunta a tu repositorio:
  echo         git remote -v
  goto :error
)

echo.
echo ================================================================
echo   DESPLIEGUE COMPLETADO
echo.
echo   URL: https://coiponorte.github.io/Raton-Cafe/
echo.
echo   ULTIMO PASO, solo la primera vez:
echo     1. Entra a tu repositorio en GitHub ^> Settings ^> Pages
echo     2. En 'Build and deployment' elige:
echo        Branch: gh-pages   /   Folder: / root
echo     3. Espera 1-2 minutos y recarga la pagina con Ctrl+F5
echo        para limpiar la cache del navegador
echo ================================================================
echo.
pause
exit /b 0

:error
echo.
echo ================================================================
echo   El despliegue se detuvo en el paso anterior.
echo   Corrige el problema y vuelve a ejecutar deploy.bat
echo   Puedes reejecutarlo tantas veces como quieras.
echo ================================================================
echo.
pause
exit /b 1
