import { createHmac, randomUUID } from "crypto";
import { model, Schema } from "mongoose";

type UserSchemaTypes = {
    _id: string;
    user: {
        name: string;
        email: string;
        password: string;
    }
    refresh_token: string;
    created_at: string;
    updated_at: string;
}

const UserSchema = new Schema<UserSchemaTypes>({
    _id: {
        type: "string",
        default: () => randomUUID(),
    },
    user: {
        name: {
            type: "string",
            required: true,
        },
        email: {
            type: "string",
            required: true,
        },
        password: {
            type: "string",
            required: true,
        },
    },
    refresh_token: {
        type: "string",
        required: false,
        default: "",
    },
    created_at: {
        type: "string",
        default: () => new Date().toISOString(),
    },
    updated_at: {
        type: "string",
        default: () => new Date().toISOString(),
    },
});

UserSchema.pre("save", function () {
    const currentPassword = this.user.password;
    const hashedPassword = createHmac("sha512", process.env.SECRET_KEY as string).update(currentPassword).digest("hex");

    this.user.password = hashedPassword;
});

export const UserModel = model<UserSchemaTypes>("user", UserSchema);
