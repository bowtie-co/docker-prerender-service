module.exports = {
  beforePhantomRequest: function(req, res, next) {
    if (req.url === '/' || req.url === '/health_check') {
      res.send(200);
    } else {
      next();
    }
  }
}
