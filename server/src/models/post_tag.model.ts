
const mongoose = require('mongoose');
const { Schema } = mongoose;

const post_tagSchema = new Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'post'
    },
    tagId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'tag'
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
}, {
    collection: "post_tag"
});

post_tagSchema.set('toObject', { virtuals: true });
post_tagSchema.set('toJSON', { virtuals: true });

export const PostTagModel = mongoose.model('post_tag', post_tagSchema)

