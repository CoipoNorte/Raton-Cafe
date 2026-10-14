@echo off
rem ==================================================================
rem  RATON CAFE - Commit, push y despliegue automatico (Windows)
rem  Uso: doble clic en deploy.bat  (o ejecutarlo desde esta carpeta)
rem ==================================================================
chcp 65001 >nul
setlocal
title Raton Cafe - GitHub y GitHub Pages

echo.
echo ================================================================
echo   RATON CAFE ^> Commit, push y despliegue automatico
echo   Destino: https://coiponorte.github.io/Raton-Cafe/
echo ================================================================
echo.

rem ---- [1/9] Comprobar que npm existe --------------------------------
rem NOTA: dentro de un bloque if (...) no puede haber parentesis en los
rem echo, porque cmd cierra el bloque antes de tiempo y falla.
echo [1/9] Comprobando que npm esta instalado...
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

rem ---- [2/9] Comprobar Git, repositorio y remoto ----------------------
echo [2/9] Comprobando Git y el repositorio...
where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Git en el sistema.
  echo         Instala Git desde https://git-scm.com/download/win
  echo         y abre una terminal nueva antes de reintentar.
  goto :error
)
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Esta carpeta no es un repositorio Git.
  echo         Clona el repositorio o ejecuta git init y configura origin.
  goto :error
)
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No existe el remoto origin.
  echo         Configuralo con este comando:
  echo         git remote add origin https://github.com/coiponorte/Raton-Cafe.git
  goto :error
)
for /f "delims=" %%b in ('git branch --show-current') do set "GIT_BRANCH=%%b"
if not defined GIT_BRANCH (
  echo [ERROR] Git no pudo detectar la rama actual.
  echo         Cambia a main con: git switch main
  goto :error
)
for /f "delims=" %%g in ('git --version') do set "GIT_VER=%%g"
echo        OK - %GIT_VER% en la rama %GIT_BRANCH%.
echo.

rem ---- [3/9] Scripts predeploy y deploy en package.json --------------
echo [3/9] Configurando scripts de despliegue en package.json...
call node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.scripts=p.scripts||{};p.scripts.predeploy='npm run build';p.scripts.deploy='npx gh-pages -d dist';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');console.log('       OK - scripts predeploy y deploy anadidos.');"
if errorlevel 1 (
  echo [ERROR] No se pudo actualizar package.json. Comprueba que no este abierto en otro programa.
  goto :error
)
echo.

rem ---- [4/9] Verificar o insertar base en vite.config.ts -------------
echo [4/9] Verificando base '/Raton-Cafe/' en vite.config.ts...
call node -e "const fs=require('fs');const f='vite.config.ts';let s=fs.readFileSync(f,'utf8');const q=String.fromCharCode(34);if(s.indexOf('/Raton-Cafe/')>-1){console.log('       OK - base ya configurada.');process.exit(0);}const linea='  base: '+q+'/Raton-Cafe/'+q+',';if(/base\s*:/.test(s)){s=s.replace(/base\s*:[^\n]+/,linea);}else{s=s.replace('export default defineConfig({','export default defineConfig({\n'+linea);}fs.writeFileSync(f,s);console.log('       OK - base insertada automaticamente.');"
if errorlevel 1 (
  echo [ERROR] No se pudo leer o escribir vite.config.ts
  goto :error
)
echo.

rem ---- [5/9] Instalar dependencias -----------------------------------
echo [5/9] Instalando dependencias, npm i...
call npm i
if errorlevel 1 (
  echo [ERROR] Fallo npm i. Revisa tu conexion y el archivo package.json.
  goto :error
)
echo        OK - dependencias instaladas.
echo.

rem ---- [6/9] Compilar el juego ---------------------------------------
echo [6/9] Compilando el proyecto, npm run build...
call npm run build
if errorlevel 1 (
  echo [ERROR] Fallo la compilacion. Revisa los errores de TypeScript de arriba.
  goto :error
)
echo        OK - carpeta dist generada.
echo.

rem ---- [7/9] Crear commit solo cuando existan cambios ----------------
echo [7/9] Preparando el commit de los cambios...
git add -A
if errorlevel 1 (
  echo [ERROR] Git no pudo preparar los archivos con git add.
  goto :error
)
git diff --cached --quiet
if errorlevel 1 goto :crear_commit
echo        OK - no hay cambios nuevos que confirmar.
goto :commit_listo

:crear_commit
git config user.name >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Falta configurar tu nombre de Git.
  echo         Ejecuta: git config --global user.name "Tu Nombre"
  goto :error
)
git config user.email >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Falta configurar tu correo de Git.
  echo         Ejecuta: git config --global user.email "tu-correo@ejemplo.com"
  goto :error
)
git commit -m "Actualizacion automatica de Raton Cafe"
if errorlevel 1 (
  echo [ERROR] No se pudo crear el commit automatico.
  echo         Revisa los mensajes de Git mostrados arriba.
  goto :error
)
echo        OK - commit creado.

:commit_listo
echo.

rem ---- [8/9] Subir el codigo fuente a GitHub -------------------------
echo [8/9] Subiendo la rama %GIT_BRANCH% a GitHub...
git push -u origin "%GIT_BRANCH%"
if errorlevel 1 (
  echo [ERROR] Git no pudo subir la rama a GitHub.
  echo         Comprueba tu sesion, el remoto y si hay cambios remotos.
  echo         Para ver el remoto ejecuta: git remote -v
  echo         Si GitHub tiene cambios nuevos, ejecuta primero:
  echo         git pull --rebase origin %GIT_BRANCH%
  goto :error
)
echo        OK - codigo fuente actualizado en GitHub.
echo.

rem ---- [9/9] Publicar en la rama gh-pages ----------------------------
echo [9/9] Publicando dist en GitHub Pages, rama gh-pages...
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
echo   Codigo fuente: rama %GIT_BRANCH% actualizada en GitHub
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
