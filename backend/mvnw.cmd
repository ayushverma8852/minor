@IF "%DEBUG%" == "" @ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION

IF "%JAVA_HOME%" == "" (
    IF EXIST "C:\Program Files\Java\jdk-21" (
        SET "JAVA_HOME=C:\Program Files\Java\jdk-21"
    )
)

SET "DIRNAME=%~dp0"
IF "%DIRNAME%" == "" SET "DIRNAME=."

SET "LOCAL_MVN=%DIRNAME%.mvn\apache-maven-3.9.9\bin\mvn.cmd"

IF EXIST "%LOCAL_MVN%" (
    CALL "%LOCAL_MVN%" %*
    EXIT /B !ERRORLEVEL!
)

FOR %%X IN (mvn.cmd mvn.bat mvn.exe mvn) DO (
    SET "MVN_PATH=%%~$PATH:X"
    IF NOT "!MVN_PATH!" == "" (
        CALL "%MVN_PATH%" %*
        EXIT /B !ERRORLEVEL!
    )
)

ECHO Maven not found in .mvn\apache-maven-3.9.9\bin or system PATH.
EXIT /B 1
