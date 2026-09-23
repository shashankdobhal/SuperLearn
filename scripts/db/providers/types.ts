export interface TranslateProvider {
  name: string;
  translate(text: string, targetLocale: string, sourceLocale: string): Promise<string>;
}
