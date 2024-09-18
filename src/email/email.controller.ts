import { Controller, Post, Body, Get } from "@nestjs/common";
import { EmailService, Email } from "./email.service";

@Controller("email")
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Post("receive")
	receiveEmail(@Body() email: Email): string {
		return this.emailService.receiveEmail(email);
	}

	@Get("all")
	getAllEmails(): Email[] {
		return this.emailService.getAllEmails();
	}
}
