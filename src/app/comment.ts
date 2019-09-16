export class Comment {
    constructor(
        public id: Number,
        public user_name: String,
        public user_id: Number,
        public published: Date,
        public rating: Number,
        public text: String
    ) {

    }
}
