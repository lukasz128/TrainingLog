import { inject, InjectionToken, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const coreTranslations = {
  required: 'Field is required',
  email: 'Format email is required',
} as const;

const CUSTOM_FORM_TRANSLATIONS_TOKEN = new InjectionToken<
  Record<string, string>
>('Custom form translations token');

@Pipe({
  name: 'getFormErrorTranslation',
})
export class FormErrorTranslationPipe implements PipeTransform {
  private readonly _customTranslations = inject(
    CUSTOM_FORM_TRANSLATIONS_TOKEN,
    { optional: true },
  );

  private readonly _mergedTranslations = {
    ...(this._customTranslations ?? {}),
    ...coreTranslations,
  } as Record<string, string>;

  transform(errorKey: ValidationErrors | null) {
    if (errorKey === null) return '';
    return (
      Object.keys(errorKey).map((item) => this._mergedTranslations[item]) ?? ''
    );
  }
}
