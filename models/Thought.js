const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema (
    {
        reactionID: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },

        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },

        username: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: createdTime => moment(createdTime).format('MM DD YYYY [at] hh:mm')
        }
    },

    {
        toJSON: {
          getters: true,
        },
        id: false,
    }
);

const ThoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },

        username: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now,
            // get: createdTime => moment(createdTime).format('MM DD YYYY [at] hh:mm')
        },

        reactions: [ReactionSchema]
    },

    {
        toJSON: {
            virtuals: true,
            getters: true,
        },

        id: false,
    }
);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);
module.exports = Thought;