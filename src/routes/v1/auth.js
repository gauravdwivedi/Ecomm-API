module.exports = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return res.status(401).send();
  }
  
  const token = authorization.split(" ")[1];
  //const user = verify(token, ACCESS_TOKEN_SECRET);
  
  //REPLACE IT WITH ABOVE TOKEN ONCE LOGIN IS DONE
  const user = { id : 1 };

  if(!(user && user.id)) res.status(401).send();

  req._userProfile = user;
  next();
}
