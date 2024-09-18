import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { BayesService } from "./bayes/bayes.service";

@Module({
	providers: [EmailService, BayesService],
	controllers: [EmailController],
})
export class EmailModule {}
