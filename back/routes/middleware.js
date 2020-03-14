exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();  
  } else {
    res.status(401).send('You need to log in.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('You already logged in.');
  }
};

