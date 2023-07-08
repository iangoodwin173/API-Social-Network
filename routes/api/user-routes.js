const router = require("express").Router();
const { getAllThought } = require("../../controllers/thought-controller");
const { getAllUser, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriend } = require("../../controllers/user-controller");


router.route("/").get(getAllUser).post(createUser).get(getAllThought);


router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);


router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;