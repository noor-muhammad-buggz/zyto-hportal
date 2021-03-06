// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    baseURL:'http://zyto.iserver.purelogics.net/',
    zytoAccountURL:'https://test-account.zyto.com/',
    ApiBaseUrl: 'http://zytoproductxwebapi-testing.azurewebsites.net/api/',
    auth:{
      clientID: 'AYDiF85cR6CfZN6wZdup4SS7jZp7CHL1',
      domain: 'zytotest.auth0.com',
      responseType: 'token id_token',
      //audience: 'https://zytotest.auth0.com/userinfo',
      redirectUri: 'http://zyto.iserver.purelogics.net/callback',
      scope: 'openid roles email user_id',
    },
    appInsights: {
      instrumentationKey: 'bc4097aa-9cb0-4f31-b009-6e2b785ec43d'
    },
    downloads:{
      scanAppWindowsUrl: 'https://zytoproductxstaging.blob.core.windows.net/deploy/UsbCradleV2ScanApp/setup.exe',
      scanAppMacUrl: 'https://zytoproductxstaging.blob.core.windows.net/deploy/UsbCradleV2ScanApp/setup.exe'
    },
    TrainingResourceBaseUrl: 'https://zytoproductxstaging.azureedge.net/training',
  };

