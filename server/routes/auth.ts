import passport from "passport";
import { passport as passportConfig, settings } from "server/config";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "server/models";

let router = Router();
passportConfig(passport);

router.post("/register", function(req: any, res: any) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: "Please pass username and password." });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    // save the user
    newUser.save(function(err: any) {
      if (err) {
        return res.json({ success: false, msg: "Username already exists." });
      }
      res.json({ success: true, msg: "Successful created new user." });
    });
  }
});

router.post("/login", function(req: any, res: any) {
  User.findOne(
    {
      username: req.body.username,
    },
    function(err: any, user: any) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: "Authentication failed. User not found.",
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function(
          err: any,
          isMatch: any
        ) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);
            // return the information including token as JSON
            res.json({ success: true, token: "JWT " + token });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password.",
            });
          }
        });
      }
    }
  );
});

export default router;
