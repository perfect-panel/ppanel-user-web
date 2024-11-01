export default [
  {
    requestLibPath: "import request from '@/lib/request';",
    schemaPath: 'https://swagger.ppanel.dev/common.json',
    serversPath: './services',
    projectName: 'common',
  },
  {
    requestLibPath: "import request from '@/lib/request';",
    schemaPath: 'https://swagger.ppanel.dev/user.json',
    serversPath: './services',
    projectName: 'user',
  },
];
