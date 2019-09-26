export class Comment {
    constructor(
        public id: number,
        public user_name: String,
        public user_id: number,
        public published: Date,
        public rating: number,
        public text: String
    ) {

    }
}
