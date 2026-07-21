import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

interface Schemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

// Parses+replaces req.body/query/params with the schema output so downstream
// handlers get typed, coerced (e.g. querystring numbers) values for free.
export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query)
        req.query = schemas.query.parse(req.query) as typeof req.query;
      if (schemas.params)
        req.params = schemas.params.parse(req.params) as typeof req.params;
      next();
    } catch (err) {
      next(err);
    }
  };
}
