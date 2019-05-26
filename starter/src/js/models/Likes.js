export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img};

        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.findIndex(id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.findIndex(id) !== -1;
    }

    findIndex(id){
        return this.likes.findIndex(el => el.id === id);
    }

    getNumLikes() {
        return this.likes.length;
    }
}