const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
     const { title, description, rating, tags } = request.body;
     const  user_id  = request.user.id;

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
      const { id } = request.params

      const movie = await knex("movies_notes")
                         .where({ id })
                         .first();
      if(!movie){
        throw new AppError(`Nenhum filme encontrado com o id: ${id}.`, 404);
      }

      const Creator = await knex("users")
                           .where({ id: movie.user_id })
                           .first();
      if(!Creator){
        throw new AppError("Usuãrio não encontrado", 404);
      }

      const tags = await knex("movie_tags")
                        .where({ movie_id: id })
                        .orderBy("name")
      
      return response.json({ Creator, movie, tags})
    };

    async showAll(request, response) {
        const id = request.user.id;
    
        const movies = await knex("movies_notes")
                            .where({ user_id: id });
    
        if (!movies.length) {
            return response.json("Nenhum filme adicionado ainda");
        }
    
        const movieIds = movies.map(movie => movie.id);
    
        const tags = await knex("movie_tags")
                          .whereIn("movie_id", movieIds)
                          .orderBy("name");
    
        const moviesWithTags = movies.map(movie => {
            return {
                ...movie,
                tags: tags.filter(tag => tag.movie_id === movie.id)
            };
        });
    
        return response.json(moviesWithTags);
    }
    
    async index(request, response) {
        const { index } = request.body;
        const id = request.user.id;
    
        if (!index || index.trim() === "") {
            throw new AppError("Digite algo para poder buscar por filmes ou tags.");
        }
    

        const movies = await knex("movies_notes")
            .select([
                "movies_notes.id",
                "movies_notes.title",
                "movies_notes.description",
                "movies_notes.rating"
            ])
            .where("title", "like", `%${index}%`)
            .andWhere("movies_notes.user_id", id);  
    

        const tags = await knex("movie_tags")
            .select(["movie_tags.movie_id", "movie_tags.name"])
            .where("name", "like", `%${index}%`)
            .andWhere("movie_tags.user_id", id); 
    
        if (!movies.length && !tags.length) {
            throw new AppError(`Nenhum resultado encontrado para: ${index}.`);
        }
    
        const movieIds = new Set();
        let result = [];
    
        if (movies.length) {
            movies.forEach(movie => movieIds.add(movie.id));
            result = [...movies];
        }
    
        if (tags.length) {
            const FilterTags = tags.map(tag => tag.name);
    
            const moviesFind = await knex("movies_notes")
                .select([
                    "movies_notes.id",
                    "movies_notes.title",
                    "movies_notes.description",
                    "movies_notes.rating"
                ])
                .innerJoin("movie_tags", "movies_notes.id", "movie_tags.movie_id")
                .whereIn("movie_tags.name", FilterTags)
                .andWhere("movies_notes.user_id", id)  
                .groupBy("movies_notes.id");
    
            moviesFind.forEach(movie => {
                if (!movieIds.has(movie.id)) {
                    movieIds.add(movie.id);
                    result.push(movie);
                }
            });
        }
    

        const movieIdsArray = [...movieIds];
        if (movieIdsArray.length === 0) {
            return response.json(result);
        }
    
 
        const moviesWithTags = await knex("movies_notes")
            .select([
                "movies_notes.id",
                "movies_notes.title",
                "movies_notes.description",
                "movies_notes.rating",
                "movie_tags.name as tag_name"
            ])
            .leftJoin("movie_tags", "movies_notes.id", "movie_tags.movie_id")
            .whereIn("movies_notes.id", movieIdsArray)
            .andWhere("movies_notes.user_id", id)  
            .groupBy("movies_notes.id", "movie_tags.name");
    

        const moviesMap = new Map();
        moviesWithTags.forEach(({ id, title, description, rating, tag_name }) => {
            if (!moviesMap.has(id)) {
                moviesMap.set(id, {
                    id,
                    title,
                    description,
                    rating,
                    tags: []
                });
            }
            if (tag_name) {
                moviesMap.get(id).tags.push(tag_name);
            }
        });
    
        return response.json([...moviesMap.values()]);
    }
    
    
    
}

module.exports = NotesController;