export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img};

        this.likes.push(like);

        // Persist data to localStorage
        this.persistDate();
        return like;
    }

    deleteLike(id) {
        const index = this.findIndex(id);
        this.likes.splice(index, 1);

        //persist data to local storage
        this.persistDate();
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

    persistDate() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}