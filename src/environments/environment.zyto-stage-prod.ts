// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  baseURL:'https://productionstage-hpportal-productx.zyto.com/',
  zytoAccountURL:'https://account.zyto.com/',
  ApiBaseUrl: 'https://insightscloud.zyto.com/api/',
  auth:{
    clientID: 'pPbhwB7BGTL0kcMNT70PScboMc5Kyk7N',
    domain: 'zyto.auth0.com',
    responseType: 'token id_token',
    //audience: 'https://zytotest.auth0.com/userinfo',
    redirectUri: 'https://productionstage-hpportal-productx.zyto.com/callback',
    scope: 'openid roles email user_id',
  },
  appInsights: {
    instrumentationKey: 'e6dbc861-1325-4c75-a070-a7345148b6a8'
  },
  downloads:{
    scanAppWindowsUrl: 'https://zytoproductxstaging.blob.core.windows.net/deploy/UsbCradleV2ScanApp/setup.exe',
    scanAppMacUrl: 'https://zytoproductxstaging.blob.core.windows.net/deploy/UsbCradleV2ScanApp/setup.exe'
  },
  TrainingResourceBaseUrl: 'https://d104pd7jl85u3e.cloudfront.net/training',
};

