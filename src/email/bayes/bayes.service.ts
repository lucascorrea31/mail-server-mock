import { Injectable } from "@nestjs/common";
import { Email } from "src/email/email.service";

@Injectable()
export class BayesService {
	private spamWordsCount: Record<string, number> = {};
	private hamWordsCount: Record<string, number> = {};
	private spamEmails = 0;
	private hamEmails = 0;

	// Função para treinar o filtro
	train(emails: { email: Email; isSpam: boolean }[]) {
		emails.forEach(({ email, isSpam }) => {
			const words = this.tokenize(email.subject + " " + email.body);
			if (isSpam) {
				this.spamEmails++;
				this.updateWordCount(words, this.spamWordsCount);
			} else {
				this.hamEmails++;
				this.updateWordCount(words, this.hamWordsCount);
			}
		});
	}

	// Tokeniza o texto em palavras, removendo pontuação e convertendo para minúsculas
	private tokenize(text: string): string[] {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, "")
			.split(/\s+/);
	}

	// Atualiza o contador de palavras
	private updateWordCount(words: string[], wordCount: Record<string, number>) {
		words.forEach((word) => {
			wordCount[word] = (wordCount[word] || 0) + 1;
		});
	}

	// Função para calcular a probabilidade de um email ser spam
	classify(email: Email): boolean {
		const words = this.tokenize(email.subject + " " + email.body);
		const spamProbability = this.calculateProbability(
			words,
			this.spamWordsCount,
			this.spamEmails
		);
		const hamProbability = this.calculateProbability(
			words,
			this.hamWordsCount,
			this.hamEmails
		);

		// Se a probabilidade de ser spam for maior que não ser, classificamos como spam
		return spamProbability > hamProbability;
	}

	// Função para calcular a probabilidade
	private calculateProbability(
		words: string[],
		wordCount: Record<string, number>,
		emailCount: number
	): number {
		const totalWords = Object.keys(wordCount).length;
		let probability = 1;

		words.forEach((word) => {
			const wordProbability = (wordCount[word] || 1) / emailCount; // Lidando com palavras ausentes
			probability *= wordProbability;
		});

		return probability * (emailCount / (this.spamEmails + this.hamEmails));
	}
}
