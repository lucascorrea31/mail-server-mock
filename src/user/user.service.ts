import { Injectable } from "@nestjs/common";
import { UserPreferences } from "./entities/user-preferences.entity";
import * as fs from "fs";

@Injectable()
export class UserService {
	filePath = "./src/data/user-preferences";

	getPreferences(id: number): UserPreferences {
		if (!id) {
			return null;
		}

		const userPreferences = new UserPreferences();
		userPreferences.id = id;
		userPreferences.mode = "auto";

		if (!fs.existsSync(`${this.filePath}/${id}.json`)) {
			fs.writeFileSync(
				`${this.filePath}/${id}.json`,
				JSON.stringify(userPreferences)
			);
			fs.closeSync(2);

			return userPreferences;
		}

		const data = fs.readFileSync(`${this.filePath}/${id}.json`, "utf8");

		if (data) {
			const parsedData = JSON.parse(data);
			userPreferences.mode = parsedData.mode;
		}

		fs.closeSync(2);

		return userPreferences;
	}

	setPreferences(id: number, preferences: UserPreferences): UserPreferences {
		if (!id) {
			return null;
		}

		const userPreferences = new UserPreferences();
		userPreferences.id = id;
		userPreferences.mode =
			(preferences.mode as "dark" | "light" | "auto") ?? "auto";

		fs.writeFileSync(
			`${this.filePath}/${id}.json`,
			JSON.stringify(userPreferences)
		);
		fs.closeSync(2);

		return userPreferences;
	}
}
