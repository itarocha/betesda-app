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



#echo "Gerando betesda.war"


#echo "Os comandos abaixo foram executados no spring sts"

#cd /home/itamar/projetos_spring/betesda

#echo "mvn dependency:tree"

#mvn clean package

#echo "Copiando betesda.war"

#cp /home/itamar/projetos_spring/betesda/target/betesda.war /home/itamar/projetos_spring/betesda/builder/output/betesda.war

