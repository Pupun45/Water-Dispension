const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CF_CLIENT_ID,
  process.env.CF_CLIENT_SECRET
);

module.exports = cashfree;
