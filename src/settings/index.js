export default {
  apiUrl: 'http://52.15.174.215/Api/',
};

const siteConfig = {
  siteName: 'FlockStudio Admin',
  siteIcon: 'ion-flash',
  footerText: 'FlockAdmin ©2018',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';

const jwtConfig = {
  fetchUrl: 'http://52.15.174.215/Api/',
  secretKey: 'secretKey',
};

export { siteConfig, language, themeConfig, jwtConfig };
