import axios from 'axios';
import {key, proxy} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        //fetch cant work on older browser

        try{
            const res = await axios(`${proxy}http://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            console.log(res);
            console.log(this.result);
        }
        catch(error) {
            alert(error);
        }
    }  
}