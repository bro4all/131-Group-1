import { Router } from "express";
import { Book } from "server/models";
import passport from "passport";
import { passport as passportConfig } from "server/config";

let router = Router();
passportConfig(passport);

const getToken = (headers: any) => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

router.get("/", passport.authenticate("jwt", { session: false }), function(
  req: any,
  res: any,
  next: any
) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function(err: any, books: any) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), function(
  req: any,
  res: any,
  next: any
) {
  var token = getToken(req.headers);
  if (token) {
    Book.create(req.body, function(err: any, post: any) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

export default router;
