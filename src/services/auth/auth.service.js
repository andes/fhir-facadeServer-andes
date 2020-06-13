"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategy = void 0;
const { Strategy } = require('passport-http-bearer');
const auth_1 = require("./../../controller/auth/auth");
// TODO GRAL revisar los handling de errores del core de Asymmetrik
exports.strategy = new Strategy((token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Decodificamos el token con la clave privada
        const data = auth_1.verifyToken(token);
        if (data) {
            // Lo buscamos a ver si todavía existe y está activo
            let t = yield auth_1.searchToken(data.app.id);
            if (t && t.activo) {
                // TODO revisar tema array permisos
                return done(null, {});
            }
            else {
                return done(new Error('Token dado de baja'));
            }
        }
        else {
            return done(new Error('Token no autorizado'));
        }
    }
    catch (err) {
        return done(new Error('Error interno'));
    }
}));
//# sourceMappingURL=auth.service.js.map