import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserPreferences } from "./entities/user-preferences.entity";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("preferences/:userId")
	getPreferences(@Param("userId") userId: number): UserPreferences {
		if (!userId) {
			return null;
		}

		return this.userService.getPreferences(userId);
	}

	@Post("preferences/:userId")
	setPreferences(
		@Param("userId") userId: number,
		@Body() preferences: UserPreferences
	): UserPreferences {
		if (!userId) {
			return null;
		}

		return this.userService.setPreferences(userId, preferences);
	}
}
