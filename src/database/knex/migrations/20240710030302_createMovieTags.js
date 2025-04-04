exports.up = knex => knex.schema.createTable("movie_tags", table => {
    table.increments("id");
    table.string("name");

    table.integer("movie_id").references("id").inTable("movies_notes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
  });
  
  
  exports.down = knex => knex.schema.dropTable("movie_tags");
