#!/usr/bin/env sh
# Gera a fonte de ícones servida pela aplicação a partir do pacote
# `material-symbols` (ADR-0023).
#
# A fonte original é variável em quatro eixos (FILL, wght, GRAD, opsz) e tem
# cerca de 4 MB. O template usa só o peso 400, grade 0 e tamanho óptico 24, e
# alterna apenas o FILL (classe `ms-fill`). Fixar os outros três eixos mantém
# todos os ícones e reduz o arquivo para cerca de 450 KB.
#
# Rode de novo sempre que atualizar a versão do `material-symbols`.
# Requer Python 3 com fonttools e brotli: `pip install fonttools brotli`.
set -eu

SOURCE="node_modules/material-symbols/material-symbols-outlined.woff2"
TARGET="src/app/styles/fonts/material-symbols-outlined.woff2"

fonttools varLib.instancer "$SOURCE" wght=400 GRAD=0 opsz=24 -o "$TARGET"
echo "Fonte gerada em $TARGET"
