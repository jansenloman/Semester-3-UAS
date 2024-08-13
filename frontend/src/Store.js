import { createStore } from "vuex";
import { Book } from "./classes";
import Config from "./config";

const Store = createStore({
    state(){
        return {
            books: [],
            isBookInitialized: false,
            user: null,
        }
    },
    mutations: {
        initBooks(state, books){
            if (state.isBookInitialized) return;
            state.books = books.map(x => new Book(x.id, x.title, x.author, x.desc, x.filename, x.img));
            state.isBookInitialized = true;
        },
        editBook(state, book){
            book = new Book(book.id, book.title, book.author, book.desc, book.filename, book.img);
            for (let i = 0; i < state.books.length; i++){
                if (state.books[i].id == book.id){
                    state.books[i] = book;
                    return;
                }
            }
            state.books.push(book);
        },
        deleteBook(state, bookID){
            state.books = state.books.filter(x => x.id !== bookID);
        },
        whoAmI(state, user){
            if (state.user !== null) return;
            state.user = user;
        },
        logout(state){
            state.user = null;
        },
        SOCKET_editBook(state, [book, cause]){
            if (cause == state.user?.id) return;
            book = new Book(book.id, book.title, book.author, book.desc, book.filename, book.img);
            for (let i = 0; i < state.books.length; i++){
                if (state.books[i].id == book.id){
                    state.books[i] = book;
                    return;
                }
            }
            state.books.push(book);
        },
        SOCKET_deleteBook(state, [id, cause]){
            if (cause == state.user?.id) return;
            state.books = state.books.filter(x => x.id !== id);
        }
    },
    actions: {
        async whoAmI(context){
            if (context.state.user !== null) return;
            const res = await fetch(Config.backend + "/accounts/me", {credentials: "include"});
            const user = await res.json();
            if (res.ok) context.commit("whoAmI", user);
        },
        async initializeBooks(context){
            if (context.state.isBookInitialized) return;
            const res = await fetch(Config.backend + "/books");
            context.commit("initBooks", await res.json());
        }
    }
});

export default Store;