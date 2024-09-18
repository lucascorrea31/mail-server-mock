import { Injectable } from "@nestjs/common";
import * as fs from "fs";

export interface Email {
	from: string;
	subject: string;
	body: string;
}

@Injectable()
export class EmailService {
	private spamKeywords = ["free", "winner", "click here", "buy now"];
	private filePath = "./src/data/emails";
	private fileName = "mails.json";

	private emails: Email[] = [];

	constructor() {
		if (fs.existsSync(`${this.filePath}/${this.fileName}`)) {
			const data = fs.readFileSync(`${this.filePath}/${this.fileName}`, "utf8");

			if (data) {
				const parsedData = JSON.parse(data);
				this.emails = parsedData;
			}

			fs.closeSync(2);
		}
	}

	receiveEmail(email: Email): string {
		if (this.isSpam(email)) {
			return "Email marked as spam.";
		}
		this.emails.push(email);
		return "Email received successfully.";
	}

	isSpam(email: Email): boolean {
		return this.spamKeywords.some(
			(keyword) =>
				email.subject.toLowerCase().includes(keyword) ||
				email.body.toLowerCase().includes(keyword)
		);
	}

	getAllEmails(): Email[] {
		return this.emails;
	}
}
