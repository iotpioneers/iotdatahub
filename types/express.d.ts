declare module "express" {
  import * as express from "express";
  export = express;
  export as namespace express;
}

declare module "cors" {
  import cors from "cors";
  export = cors;
  export as namespace cors;
}
