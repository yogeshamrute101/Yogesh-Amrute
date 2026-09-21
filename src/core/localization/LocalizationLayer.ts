export type Locale = "en" | "mr" | "hi" | string;

export class LocalizationLayer {
  private locale: Locale = "en";

  setLocale(locale: Locale) {
    this.locale = locale;
    return this.locale;
  }

  getLocale() {
    return this.locale;
  }
}
