# AFIP CLI

Un set de herramientas para comunicarse con AFIP por línea de comando

## Setup

### Config

Crear un archivo `.env` con el contenido de `.env.template` y completar sus valores.

### Generar un certificado y autorizarlo en AFIP

El certificado es un archivo que le compartimos a AFIP para que nos identifique, es como el ID de esta app para la AFIP.
Tenemos que generar uno por cada empresa/persona que vamos a buscar en AFIP.

1. Correr `./csrgen.sh`
Esto genera una clave privada y un CSR, o sea, un pedido de certificado para afip

2. Subir el CSR a AFIP y descargar certificado
Seguir este documento https://www.afip.gob.ar/ws/WSAA/wsaa_obtener_certificado_produccion.pdf para subir el CSR a AFIP.
Luego buscar el certificado bajo el alias y bajarlo.
Ubicarlo en la carpeta `ssh` y renombrarlo a `ssh/afip.pem`

3. Vincular en AFIP nuestro certificado a servicio de factura electrónica
Seguir este documento https://www.afip.gob.ar/ws/WSAA/ADMINREL.DelegarWS.pdf para permitir a nuestro certificado usar el servicio de factura electrónica

### Generar ticket de acceso

Correr `./ticketgen.sh`.
Esto genera un ticket de acceso válido para el día corriente (ver `login-template.xml`) y lo firma con nuestra clave privada. Luego el programa puede tomarlo para obtener credenciales a usar con los servicios de AFIP.
Un ticket es válido por 24h, así que este script debe ser corrido antes de empezar a usar el programa cada día.

### Correr programa

Finalmente podemos correr `node index.js`.
Se usa el servicio `FECompUltimoAutorizado` como ejemplo, pero se puede probar con otro.

## Requerimientos

bash, openssl, node 18

## Vocabulario

- certificado: Es un archivo que usamos para identificarnos con AFIP
- alias o nombre: Nombre que se le da al "computador fiscal". Es el nombre del certificado en AFIP.
- web service o WS: AFIP provee varios servicios, los que se pueden invicar a travez de internet son "web services". Ejemplos de servicio son: factura electrónica (wsfe), seguros de caución (wsseg), bonos fiscales electrónicos (wsbfev1), etc.
- WSAA: Es el web service de AFIP único para autenticarse, es necesario usarlo antes de invocar otro WS.

## Docs

* [Doc técnica de generación de certificados](https://www.afip.gob.ar/ws/WSAA/WSAA.ObtenerCertificado.pdf)
* [Docs de Auth en AFIP](https://www.afip.gob.ar/ws/documentacion/wsaa.asp)
* [Docs de web service de factura electrónica](https://www.afip.gob.ar/ws/documentacion/ws-factura-electronica.asp)
* [Doc técnica de servicio de factura electrónica](https://www.afip.gob.ar/fe/ayuda/documentos/wsfev1-COMPG.pdf)
* [WSDL de servicio de factura electrónica](https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL)

## Agradecimientos

Gracias a @sarriaroman por https://github.com/sarriaroman/AFIP-API que llegó mucho antes que yo y me ayudó mucho a pasar los pasos de la autenticación y generación de ticket.
