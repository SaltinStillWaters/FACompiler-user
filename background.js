const SERVICE_ACCOUNT_CREDENTIALS = {
  "type": "service_account",
  "project_id": "facompiler-431705",
  "private_key_id": "4dd18214b33fcf613b0f60b03815950677a19079",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCi4njqhRzEn21K
5z4ly7FlIneJCF4gdwizFoh5SI97pQkmjmut5A95jxpxYo12uiU4hLty7PmC7HY0
eOtp92DjX2Lr1y/NCoxX1w3edvfTWE0/FbykbLrvTm87Jn14C7uaDpZqvL/SF7yh
N2wyJ7dpOsypm6+O+1cUW/LSazYo2viHyOb8gf8la5zgjjUsjr1IwDKFnEA1/4j9
X6PsfTXSwRtdZ7bRuWaMj+yavivWvP+zAEdD/ojcjW5V0vULyJH4pUi2g6Gj+wSF
I5qrylDaoi7de9wYR0CltBzn7v1UL6fy7JgPVvg5A0iq5VuQBq8FG+LVq6GsNn5P
BBYia9ITAgMBAAECggEAIXxPgV8GMAHadRie9SQv/uucCWbX+vKdrjuGqPBa1v9x
pySGTIRjDgl2VTL+hBb2iez3oEPJc7nq/xSQyQMbPwMgEf32DMALZA+JAWARyLgR
gVOVqXPU5leIlG9wQdqfoac4Ew9km+tXUwlSy+jQUujMpF2mNM3E9CGHBO0XgERX
958F3UNgGGlPNbdvcGyufN1M0neyBp4XSYcCBJFg/KOcdpUlGIs0i/jAYF9GNIBP
8V2lo7KVzyxj/WE/Qato9/E68VvgA8UrwEnVaQGl1vFi3Fc9u0jEYf0WnwIVF7IP
R8uvjX0k8pqOMMHzi8kttaEjo7T3NkwSWd9BTH1KIQKBgQDMrlMyooBwt2uIf0GV
Pa7hVxjPzjUNeej6KRPB+wXCqMcQ+lrcQc1msabZHiTPlx9FrEUrgLJi4QIscIDK
BYYg0GE0iFqI8o1+3GbIWWmrIjlifphnF8vhqtBih47s1gfKOlN4kppO06VrSsyS
em+SqnMaYDgrgpvc4RuIy828EQKBgQDLuWfEfzlzTOSXqEFy/5ysZKbXLYDXEXAv
8hpzYnoPu0jkg6nOzneixBqHbaIIZslJla7Vbwr8A5i52m3NaIUV1PseB9bL0mjz
tDjYumgeHkTtoKYe3EtrPYRZwTW1mK2dRcakh1hipCLjwPYG5kOccXt6yShj6qX/
9c+QBbgf4wKBgQCfNt9K3PMyOstwAyVd1PyLFvga9Zl5ISKkLX3L/9rMQAORZl11
Rc5kGr7h1zvlKvXNeaLYoySgG81YCi90dnWOYumqNoLOUnbUfteI81xqHZYr0rP0
RaN3qCqu6im4ewjWOyag/NEBjkr3udiF/K17lhExLDWlStS5LXYApCAmMQKBgEsG
SX+ktryOebScIxY9qi4WlxaxTDxn0J/nkfQiNP9sIkj9b+CYSpinjXmIV16us7wk
opE5Zpsum+T92ugFcNV8bMo/asv+/eWZ3kF6THOjBBFa0zKUQDYLHp2LOMNaqb08
gA4BRfx1o9+qJTCfRhDr/eRXBkfdlypvFPReFtOvAoGBAJPq5evIAYUl+n7JHR4V
qJs0Adm1jctfNoIPyWL/AHAAMwh2oDmqs864kwmYYiqhRmRP5im8lU+4kMGcpX8I
vkQXuhvNCE+Yjqo2BaJxLZ7DIkREycf8kaTH6sIOnQf+ZmirCgQDRc/EF1fXfEet
+iIxqjPq+tKYrvJ6AfBojvAq
-----END PRIVATE KEY-----`,
  "client_email": "facompilerservice@facompiler-431705.iam.gserviceaccount.com",
  "client_id": "108167978853644179048",
  "token_uri": "https://oauth2.googleapis.com/token"
};

let cachedAccessToken = null;
let tokenExpiryTime = 0;

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const payload = {
    iss: SERVICE_ACCOUNT_CREDENTIALS.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };

  const base64Encode = obj => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const unsignedToken = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    await importPrivateKey(SERVICE_ACCOUNT_CREDENTIALS.private_key),
    new TextEncoder().encode(unsignedToken)
  );

  const jwt = `${unsignedToken}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await response.json();

  cachedAccessToken = data.access_token;
  tokenExpiryTime = Date.now() + data.expires_in * 1000;

  return cachedAccessToken;
}

async function importPrivateKey(pem) {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkSheetExists') {
    getAccessToken()
      .then(token => checkSheetExists(token, request.spreadsheetID, request.sheetName))
      .then(exists => {

        sendResponse({ exists: exists });
      })
      .catch(error => {

        sendResponse({ error: error.message });
      });

    return true;  //indicate asynchronous behaviour
  }
  else if (request.action === 'createSheet') {
    getAccessToken()
      .then(token => createSheet(token, request.spreadsheetID, request.sheetName))
      .then(response => {

        sendResponse({ result: response });
      })
      .catch(error => {

        sendResponse({ error: error.message });
      });

    return true;
  }
  else if (request.action === 'writeToSheet') {
    getAccessToken()
      .then(token => writeToSheet(token, request.spreadsheetID, request.sheetName, request.range, request.values))
      .then(response => {

        sendResponse({ result: response });
      }
      )
      .catch(error => {

        sendResponse({ error: error.message });
      }
      )
    return true;
  }
  else if (request.action === 'readFromSheet') {
    getAccessToken()
      .then(token => readFromSheet(token, request.spreadsheetID, request.sheetName, request.range))
      .then(response => {

        sendResponse({ result: response });
      }
      )
      .catch(error => {

        sendResponse({ error: error.message })
      }
      )

    return true;
  }
  else if (request.action === 'insertRowToSheet') {
    getAccessToken()
      .then(token =>
        getSheetID(token, request.spreadsheetID, request.sheetName)
          .then(sheetId => insertRowToSheet(token, request.spreadsheetID, sheetId, request.rowIndex, request.rowData))
      )
      .then(response => {

        sendResponse({ result: response });
      })
      .catch(error => {

        sendResponse({ error: error.message });
      })

    return true;
  }
})

function insertRowToSheet(token, spreadsheetID, sheetId, rowIndex, rowData) {
  const requestBody =
  {
    requests:
      [
        {
          insertDimension:
          {
            range:
            {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1
            },
            inheritFromBefore: false
          }
        },
        {
          updateCells:
          {
            rows:
              [
                {
                  values: rowData.map(cellData => ({ userEnteredValue: { stringValue: cellData } }))
                }
              ],
            fields: 'userEnteredValue',
            start:
            {
              sheetId: sheetId,
              rowIndex: rowIndex,
              columnIndex: 0
            }
          }
        }
      ]
  };

  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}:batchUpdate`,
    {
      method: 'POST',
      headers:
      {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data;
    }
    )
}

function getSheetID(token, spreadsheetID, sheetName) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?fields=sheets.properties`,
    {
      method: 'GET',
      headers:
      {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      let sheetId = null;
      for (let i = 0; i < data.sheets.length; i++) {
        if (data.sheets[i].properties.title === sheetName) {
          sheetId = data.sheets[i].properties.sheetId;
          break;
        }
      }


      return sheetId;
    }
    )
}

function readFromSheet(token, spreadsheetID, sheetName, range) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}!${range}`,
    {
      method: 'GET',
      headers:
      {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.values;
    }
    )

}

function writeToSheet(token, spreadsheetID, sheetName, range, values) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}!${range}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers:
      {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(
        {
          values: values
        }
      )
    }
  )
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data;
    }
    )
}

function createSheet(token, spreadsheetID, sheetName) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}:batchUpdate`,
    {
      method: 'POST',
      headers:
      {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          requests:
            [
              {
                addSheet:
                {
                  properties:
                  {
                    title: sheetName,
                  },
                },
              }],
        }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.replies && data.replies[0].addSheet) {
        return data.replies[0].addSheet.properties;
      }
      else {
        throw new Error(`Failed to create new sheet: ${sheetName}. API Response: ${JSON.stringify(data)}`);
      }
    });
}

function checkSheetExists(token, spreadsheetID, sheetName) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}`,
    {
      method: 'GET',
      headers:
      {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const sheets = data.sheets;
      let exists = false;

      for (let sheet of sheets) {
        let sheetTitle = sheet.properties.title;

        if (sheetTitle != sheetName) {

        }
        else {

          exists = true;
          break;
        }
      }

      return exists;
    });
}