declare module "express" {
  import express = require("express");

  // Export the default
  export = express;
  export as namespace express;

  // Export individual members
  export const {
    Request,
    Response,
    NextFunction,
    Application,
    Router,
    RequestHandler,
    ErrorRequestHandler,
  } = express;
}
