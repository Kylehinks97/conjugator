export interface Kata {
    id: number;
    verb_id: number;
    subject_pronoun: string;
    conjugated_form: string;
    kata: string;
    options: string;
    choices: string[]; // Declare choices as an array of strings
  }
  