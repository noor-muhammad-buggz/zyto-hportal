// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseURL:'http://localhost:4200/',
  zytoAccountURL:'https://test-account.zyto.com/',
  auth0_Domain:'zytotest.auth0.com',
  ApiBaseUrl: 'https://zytoproductxwebapi-testing.azurewebsites.net/api/',
  auth:{
    clientID: 'AYDiF85cR6CfZN6wZdup4SS7jZp7CHL1',
    domain: 'zytotest.auth0.com',
    responseType: 'token id_token',
    //audience: 'https://zytotest.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid roles email user_id',
  },
  appInsights: {
    instrumentationKey: '9455b7a6-a7ba-4475-8f12-1aed35e49515'
  },
  downloads:{
    scanAppWindowsUrl: 'https://zytoproductxtesting.blob.core.windows.net/deploy/UsbCradleV2ScanApp_x86/setup.exe',
    scanAppMacUrl: 'https://zytoproductxtesting.blob.core.windows.net/deploy/UsbCradleV2ScanApp_x86/setup.exe'
  },
  TrainingResourceBaseUrl: 'http://zytoproductxtesting.azureedge.net/training',
};

