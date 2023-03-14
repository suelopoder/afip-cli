#!/bin/bash

# clone template, get ready!
cp login-template.xml login.xml

ID=`date +%s`
TODAY=`date +%F`

# generate content valid for today
sed -i '' "s/{uniqueId}/$ID/" login.xml
sed -i '' "s/{generationTime}/${TODAY}T00:00:00/" login.xml
sed -i '' "s/{expirationTime}/${TODAY}T23:59:59/" login.xml
sed -i '' "s/{service}/wsfe/" login.xml

# sign request with our key
/usr/local/opt/openssl@3/bin/openssl cms -sign -in ./login.xml  -out ./login.xml.cms -signer ./ssh/afip.pem  -inkey ./ssh/afip.key -nodetach -outform PEM

# remove header and footer
sed -i '' '$ d' login.xml.cms
sed -i '' '1,1d' login.xml.cms

# Done! The contents of login.xml.cms is the login string