const { Thought, User } = require("../models");


const thoughtController = {
    getAllThought(req,res) {
        Thought.find({}).populate({
            path: 'reactions',
            select: "-__v"
        }).select("-__v").sort({_id: -1})
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id}).populate({
            path: 'reactions',
            select: "-__v"
        }).select("-__v").sort({_id: -1})
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'There are no thoughts with that ID.' });
                return;
            } 
            res.json(dbThoughtData);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    createThought({ params, body }, res) {
      Thought.create(body)
        .then(({ thoughtText }) => {
          return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: thoughtText } },
            { new: true }
          );
        })
        .then((dbUserData) => {
          if (!dbUserData) {
            return res
              .status(404)
              .json({ message: "Thought created but no user found with this id." });
          }
  
          res.json({ message: "Thought successfully created." });
        })
        .catch((err) => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
          new: true,
          runValidators: true,
        }).then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: "There is no thought with this ID." });
              return;
            }
            res.json(dbThoughtData);
          }).catch((err) => res.json(err));
          
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $addToSet: { reactions: body } },
          { new: true, runValidators: true }
        ).then((dbThoughtData) => { 
            if (!dbThoughtData) {
              res.status(404).json({ message: "There is no thought with this ID." });
              return;
            }
            res.json(dbThoughtData);
          }).catch((err) => res.json(err));
          
    },


    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
        ).then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought with that ID to delete.'});
              return;
            }
           res.json(dbThoughtData);
          }).catch(err => res.json(err));
          
      },

      deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: "No thought found with this ID." });
            }
    
            
            return User.findOneAndUpdate(
              { thoughts: params.id },
              { $pull: { thoughts: params.id } }, 
            );
          })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res
                .status(404)
                .json({ message: "No user found with this ID." });
            }
            res.json({ message: "Thought has been deleted." });
          })
          .catch((err) => res.json(err));
      },

      
    };

module.exports = thoughtController;