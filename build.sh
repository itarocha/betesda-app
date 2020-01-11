#!/bin/bash

clear

echo "Preparando-se para gerar front-end"
echo "Excluindo arquivos antigos"
rm ./target/output/betesdaclient.tar.gz

echo "Construindo front-end"
npm run build

cd ./dist/
pwd

echo "Compactando arquivo..."
tar -zcvf ../target/output/betesdaclient.tar.gz *

echo "Arquivo  betesdaclien.tar.gz criado com sucesso"