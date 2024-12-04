const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getNotes', mid.requiresLogin, controllers.Note.getNotes);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Note.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Note.makeNote);

  app.post('/deleteNote', mid.requiresLogin, controllers.Note.deleteNote);

  app.post('/editNote', mid.requiresLogin, controllers.Note.updateNote);
  
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.use((req, res, next) => {
    console.error(`404 error: ${req.method} ${req.originalUrl}`);
    res.status(404).send('404 Error: Page not found ');
  });
};

module.exports = router;
