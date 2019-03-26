import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// load up the user model
import { User } from "server/models";
import settings from "./settings"; // get settings file

export default function(passport: any) {
  let opts: any = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = settings.secret;
  passport.use(
    new JwtStrategy(opts, function(jwt_payload: any, done: any) {
      User.findOne({ id: jwt_payload.id }, function(err: any, user: any) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
}
