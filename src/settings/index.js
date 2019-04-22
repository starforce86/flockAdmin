// const apiUrl = 'https://www.flockadmin.com/Api/';
const apiUrl = 'http://localhost:8092/Api/';

export default {
  apiUrl: apiUrl,
};

const siteConfig = {
  siteName: 'FlockAdmin',
  siteIcon: 'ion-flash',
  footerText: 'FlockAdmin ©2019',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';

const jwtConfig = {
  fetchUrl: apiUrl,
  secretKey: 'secretKey',
};

export { siteConfig, language, themeConfig, jwtConfig };
