const knexConfig = require("../../knexfile").development;
const knex = require("knex")(knexConfig);
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class AvatarController {
    async update(request, response) {
        const user_id = request.user.id;

        if (!request.file || !request.file.filename) {
            throw new AppError("Arquivo de avatar não fornecido.");
        }

        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage(); 
        const user = await knex("users")
                          .where({ id: user_id }).first();

        if (!user) {
            throw new AppError("Somente usuários autenticados podem mudar o avatar.");
        }

        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;

        await knex("users").update({ avatar: filename }).where({ id: user_id });

        return response.json(user); 
    };
}

module.exports = AvatarController;
