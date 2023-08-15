// Helper function to extract bills and errors
export const extractBillsAndErrors = (
  jsonResponse: any,
): { bills: any[]; errors: any[] } => {
  const result = [
    ...(jsonResponse['soap:Envelope']['soap:Body'][0]?.EstelameBarnameResponse[0]
      ?.EstelameBarnameResult[0]['diffgr:diffgram'][0]?.NewDataSet[0]?.Table1 || []),
  ];

  const bills = result.slice(0, -1).map((bill: any) => ({
    cottageNumber: bill.kutajnumber?.[0] || '',
    weight: bill.weightk?.[0] || '',
    draftNumber: bill.hamlid?.[0] || '',
    billNumber: bill.barnamen?.[0] || '',
    driverName: bill.drivern?.[0] || '',
  }));

  const errors = [
    {
      errorCode: result[result.length - 1]?.ErrorCode?.[0] || '',
      errorMessage: result[result.length - 1]?.ErrorMsg?.[0] || '',
    },
  ];

  return { bills, errors };
};

export const estelamXML = (username: string, password: string, purchaseId: string) => `
    <x:Envelope
        xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:tem="http://tempuri.org/">
        <x:Header/>
        <x:Body>
            <tem:EstelameBarname>
                <tem:userName>${username}</tem:userName>
                <tem:pass>${password}</tem:pass>
                <tem:fromDate></tem:fromDate>
                <tem:toDate></tem:toDate>
                <tem:kharidId>${purchaseId}</tem:kharidId>
                <tem:TakhsisId></tem:TakhsisId>
                <tem:KutajNumber></tem:KutajNumber>
                <tem:IdHaml></tem:IdHaml>
            </tem:EstelameBarname>
        </x:Body>
    </x:Envelope>
    `;

export const estelamByDateXML = `
  <x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
        <tem:EstelameBarname>
            <tem:userName>10103740920</tem:userName>
            <tem:pass>exon@321</tem:pass>
            <tem:fromDate></tem:fromDate>
            <tem:toDate></tem:toDate>
            <tem:kharidId></tem:kharidId>
            <tem:TakhsisId></tem:TakhsisId>
            <tem:KutajNumber></tem:KutajNumber>
            <tem:IdHaml></tem:IdHaml>
        </tem:EstelameBarname>
    </x:Body>
  </x:Envelope>
  `;

export const editXML = (
  username: string,
  password: string,
  spsDraft: string,
  weight: string,
  name: string,
  carNumber: string,
  billNumber: string,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
) => `
  <x:Envelope
  xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
      <tem:EditBarname>
          <tem:userName>${username}</tem:userName>
          <tem:pass>${password}</tem:pass>
          <tem:HamlId>${spsDraft}</tem:HamlId>
          <tem:value>${weight}</tem:value>
          <tem:DriverName>${name}</tem:DriverName>
          <tem:CarNo>${carNumber}</tem:CarNo>
          <tem:barnameh>${billNumber}</tem:barnameh>
          <tem:serialNo></tem:serialNo>
          <tem:RecieverName>${receiverName}</tem:RecieverName>
          <tem:IssuDate></tem:IssuDate>
          <tem:reciverAddress>${receiverAddress}</tem:reciverAddress>
          <tem:recieverPhone>${receiverPhone}</tem:recieverPhone>
      </tem:EditBarname>
    </x:Body>
  </x:Envelope>
  `;

export const insertXML = (
  username: string,
  password: string,
  billNumber: string,
  billSerial: string,
  calcCreatedDate: string,
  weight: string,
  purchaseId: string,
  assignmentId: string,
): string => `
<x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
        <tem:insertBarname>
            <tem:userName>${username}</tem:userName>
            <tem:pass>${password}</tem:pass>
            <tem:userName>10103740920</tem:userName>
            <tem:pass>exon@321</tem:pass>
            <tem:BarNumber>${billNumber}</tem:BarNumber>
            <tem:BarSerial>${billSerial}</tem:BarSerial>
            <tem:ISSUDATE>${calcCreatedDate}</tem:ISSUDATE>
            <tem:MerchantDeclaredWeight>${weight}</tem:MerchantDeclaredWeight>
            <tem:KharidId>${purchaseId}</tem:KharidId>
            <tem:takhsisId>${assignmentId}</tem:takhsisId>
        </tem:insertBarname>
    </x:Body>
</x:Envelope>
`;
