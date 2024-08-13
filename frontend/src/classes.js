import Config from "./config";

export class Book {
    constructor (id, title, author, desc, filename, img){
        this.id = id;
        this.title = title;
        this.author = author;
        this.desc = desc;
        this.filename = Config.storage + '/' + filename;
        this.img = Config.storage + '/' + img;
    }
    copy(){
        return new Book(this.id, this.title, this.author, this.desc, this.img);
    }
}

export class Review {
    constructor (id, user, comment, time){
        this.id = id;
        this.user = user;
        this.comment = comment;
        this.time = new Date(time)
    }
    get timeString(){
        // https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
        return this.time.toLocaleDateString(undefined, {
            day: "2-digit",
            year: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }
}