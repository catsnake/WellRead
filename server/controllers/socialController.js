const User = require('../models/userModel');

const socialController = {};

socialController.followUser = async (req, res, next) => {
  try {
    const { username, followUsername } = req.body;

    const user = await User.findOne({ username });
    const friend = await User.findOne({ username: followUsername });

    if (!user || !friend) {
      return next({
        log: 'Error in userController.followUser: ',
        message: { error: 'User or friend not found' },
      });
    }

    const userId = user._id;
    const friendId = friend._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { followedUsers: friendId } },
      { new: true }
    );

    const updatedFriend = await User.findByIdAndUpdate(
      friendId,
      { $push: { followers: userId } },
      { new: true }
    );

    res.locals.user = updatedUser;
    res.locals.friend = updatedFriend;

    return next();
  } catch (error) {
    return next({
      log: 'Error in userController.followUser: ',
      message: { error: 'Cannot follow user' },
    });
  }
};

socialController.getFollowedUsers = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username })
      .populate('followedUsers', 'username')
      .then((user) => {
        const followedUsernames = user.followedUsers.map(
          (followedUser) => followedUser.username
        );
        res.locals.followedUsers = followedUsernames;
        return next();
      });
  } catch (error) {
    return next({
      log: 'Error in userController.getfollowedUsers: ',
      message: { error: 'cannot get followedUsers' },
    });
  }
};

socialController.unfollowUser = async (req, res, next) => {
  try {
    const { username, friendUsername } = req.body;

    const user = await User.findOne({ username });
    const friend = await User.findOne({ username: friendUsername });

    if (!user || !friend) {
      return next({
        log: 'Error in userController.unfollowUser: ',
        message: { error: 'User or friend not found' },
      });
    }

    const userId = user._id;
    const friendId = friend._id;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { followedUsers: friendId } },
      { new: true }
    );

    res.locals.user = updatedUser;

    return next();
  } catch (error) {
    return next({
      log: 'Error in userController.unfollowUser: ',
      message: { error: 'Cannot unfollow user' },
    });
  }
};

socialController.getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId)
      .populate('followers', 'username')
      .then((user) => {
        const followers = user.followers.map((follower) => follower.username);
        res.locals.followers = followers;
        return next();
      });
  } catch (error) {
    return next({
      log: 'Error in userController.getFollowers: ',
      message: { error: 'cannot get followers' },
    });
  }
};



module.exports = socialController;
