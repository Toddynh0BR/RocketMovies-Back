const { request, response } = require("express");
const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
     const { title, description, rating, tags } = request.body;
     const { user_id } = request.params;

     const [movie_id] = await knex("movies_notes").insert({
        title,
        description,
        rating,
        user_id
     });

     const tagInsert = tags.map(name => {
        return {
            movie_id,
            name,
            user_id
        }
     });

     await knex("movie_tags").insert(tagInsert);

     response.json();
    };

    async show(request, response) {
        const { id } = request.params;

        const movie = await knex("movies_notes").where({id}).first();
        const tags = await knex("movie_tags").where({movie_id: id}).orderBy("name");

        if(!movie){
        return response.json("filme nao existe")
        }

        return response.json({
            ...movie,
               tags
        });
    };

    async delete(request, response) {
        const { id } = request.params;

        await knex("movies_notes").where({id}).delete();

        return response.json()
    };

    async index(request, response) {
        const { title, movie_tags } = request.query;
         
        let movies

        if(movie_tags){
        const FilterTags = movie_tags.split(',').map(tag => tag.trim());

        movies = await knex("movie_tags")
                           .select(
                            "movies_notes.title",
                            "movies_notes.description",
                            "movies_notes.rating"
                           )
                           .innerJoin("movies_notes", "movies_notes.id", "movie_tags.movie_id")
                           .where(function() {
                            if (title){
                                this.whereLike("movies_notes.title", `%${title}%`);
                            }
                           })
                           .whereIn("movie_tags.name", FilterTags)
                           .groupBy("movies_notes.id");

        }else{
        movies = await knex("movies_notes")
                           .whereLike("title", `%${title}%`)
                           .orderBy("title");
        }
        return response.json( movies );
    }
}

module.exports = NotesController;