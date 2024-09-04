import {IUser} from "../../interfaces/user/user.interface";

class UserDto implements IUser {
    id: string;
    displayName: string;
    email: string;
    created_at: string;
    avatar: string;


    constructor(userModel: any) {
        this.id = userModel.id;
        this.displayName = userModel.displayName;
        this.email = userModel.email;
        this.created_at = userModel.created_at;
        this.avatar = userModel.avatar;

    }

    static make(userModel: any): IUser {
        const userDto = new UserDto(userModel);
        return {
           // id: userDto.id,
            displayName: userDto.displayName,
            email: userDto.email,
            created_at: userDto.created_at,
            avatar: userDto.avatar,
        };
    }

    static collection(userModels: any[]): IUser[] {
        if (!userModels || !Array.isArray(userModels)) {
            return [];
        }

        return userModels.map(userModel => UserDto.make(userModel) as IUser);
    }
}

export default UserDto;
