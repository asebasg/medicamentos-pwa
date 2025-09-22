// * Aqui se llaman las variables de entorno que estan en .env
export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '7d',
};

// * Verificar si existe JWT_SECRET
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no existe en las variables de entorno. Por favor, establece una configuración.")
}