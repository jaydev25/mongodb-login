// const db = require('../../storage/main/models/index');

const VerificationController = (req, res) => {
    return db.Users.find({
      where: { email: req.query.email }
    })
      .then(user => {
        if (user.isVerified) {
          return res.status(202).json(`Email Already Verified`);
        } else {
          return db.VerificationToken.find({
            where: { token: req.query.token }
          })
            .then((foundToken) => {
              if(foundToken){
                return user
                  .update({ isVerified: true })
                  .then(updatedUser => {
                    return res.status(403).json(`User with ${user.email} has been verified`);
                  })
                  .catch(reason => {
                    return res.status(403).json(`Verification failed`);
                  });
              } else {
                return res.status(404).json(`Token expired` );
              }
            })
            .catch(reason => {
              return res.status(404).json(`Token expired`);
            });
        }
      })
      .catch(reason => {
        return res.status(404).json(`Email not found`);
      });
    }

module.exports = VerificationController;
