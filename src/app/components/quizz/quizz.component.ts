import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

interface Option {
  id: number;
  name: string;
  alias: string;
  image?: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface Quiz {
  title: string;
  questions: Question[];
  results: {
    [alias: string]: string;
  };
}

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css'],
})
export class QuizzComponent implements OnInit {
  title = '';
  questions: Question[] = [];
  questionSelected: Question | undefined;

  answers: string[] = [];
  answerSelected = '';

  questionIndex = 0;
  questionMaxIndex = 0;

  finished = false;

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      const { title, questions } = quizz_questions as Quiz;
      this.title = title;
      this.questions = questions;
      this.questionMaxIndex = questions.length;
      this.setNextQuestion();
    }
  }

  playerChoose(value: string): void {
    this.answers.push(value);
    this.setNextQuestion();
  }

  setNextQuestion(): void {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      this.checkResult(this.answers).then((finalAnswer) => {
        this.finished = true;
        this.answerSelected =
          quizz_questions.results[
            finalAnswer as keyof typeof quizz_questions.results
          ];
      });
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((previous, current) =>
      answers.filter((item) => item === previous).length >
      answers.filter((item) => item === current).length
        ? previous
        : current
    );

    return result;
  }
}
