import { Schema, model } from "mongoose";
import bcrypt from "bcrypt-nodejs";

let UserSchema: any = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", function(this: any, next: any) {
  let user: any = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err: any, salt: string) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function(err: any, hash: any) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw: string, cb: Function) {
  bcrypt.compare(passw, this.password, function(err: any, isMatch: any) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

export default model("User", UserSchema);
