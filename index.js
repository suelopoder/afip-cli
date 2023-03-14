const soap = require('soap')
const fs = require('fs')
const { DOMParser } = require('@xmldom/xmldom')
require('dotenv').config();

const AFIP_URLS = {
  wsaa: 'https://wsaa.afip.gov.ar/ws/services/LoginCms?wsdl',
  service: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx?wsdl'
};

async function getClient(url) {
  return soap.createClientAsync(url)
}
async function getAuthClient() {
  return getClient(AFIP_URLS.wsaa)
}
async function getServiceClient() {
  return getClient(AFIP_URLS.service)
}

async function main() {
  try {
    const client = await getAuthClient()
    const authData = await fs.readFileSync('./login.xml.cms', 'utf-8')
    const authRes = await client.loginCmsAsync({ in0: authData })
    const xmlRes = authRes[0].loginCmsReturn
    // For some reason the XML response contains an XML, so we parse it
    const resDoc = new DOMParser().parseFromString(xmlRes, 'utf-8')
    // Will break when XML changes, but ok for now
    const token = resDoc.childNodes[2].childNodes[3].childNodes[1].firstChild.nodeValue
    const sign = resDoc.childNodes[2].childNodes[3].childNodes[3].firstChild.nodeValue
    const Auth = {
      Token: token,
      Sign: sign,
      Cuit: process.env.CUIT
    }

    const service = await getServiceClient()

    // Finally, the service call
    const data = { Auth, PtoVta: 2, CbteTipo: 11 }
    const raw = await service.FECompUltimoAutorizadoAsync(data)
    const res = raw[0].FECompUltimoAutorizadoResult
    if (res.Errors) {
      console.error('Error obteniendo comprobante', res.Errors.Err)
      return
    }

    console.error('Último comprobante autorizado', res)
  } catch (e) {
    console.error('Unexpected error', e)
  }
}

main()