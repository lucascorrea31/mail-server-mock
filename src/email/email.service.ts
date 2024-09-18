import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { BayesService } from "./bayes/bayes.service";

export interface Email {
	from: string;
	subject: string;
	body: string;
	isSpam: boolean;
}

@Injectable()
export class EmailService {
	private filePath = "./src/data/emails";
	private fileNameTraining = "mails-trainning.json";
	private fileName = "mails.json";

	private emails: Email[] = [];
	private readonly bayesService: BayesService;

	constructor(bayesService: BayesService) {
		if (fs.existsSync(`${this.filePath}/${this.fileNameTraining}`)) {
			const data = fs.readFileSync(
				`${this.filePath}/${this.fileNameTraining}`,
				"utf8"
			);

			if (data) {
				const parsedData = JSON.parse(data);
				this.emails = parsedData;

				this.emails.forEach((email) => {
					this.bayesService.train([{ email, isSpam: email.isSpam }]);
				});
			}

			fs.closeSync(2);
		}

		this.bayesService = bayesService;
	}

	receiveEmail(email: Email): string {
		const isSpam = this.bayesService.classify(email);

		if (isSpam) {
			return "Email marked as spam by Bayesian filter.";
		}

		this.emails.push(email);
		fs.writeFileSync(
			`${this.filePath}/${this.fileName}`,
			JSON.stringify(this.emails)
		);
		fs.closeSync(2);

		return "Email received successfully.";
	}

	getAllEmails(): Email[] {
		return this.emails;
	}

	// Método para treinar o filtro bayesiano
	trainBayesFilter(emails: { email: Email; isSpam: boolean }[]) {
		this.bayesService.train(emails);
	}
}
