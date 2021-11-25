
import validator from 'validator';

export function isRequiredForm(value: string) {
  return Boolean(value);
}


async function isEmailExistForUser(email: string) {
  return {
    success: true,
    payload: false
  }
}

export async function isNotEmailExistForm(email: string) {
  if (!email) {
    return true;
  }
  return isEmailExistForUser(email).then(({ success, payload }) => {
    if (success) {
      return !payload;
    }

    return false;
  });
}

export function isEmailForm(email: string) {
  return validator.isEmail(email);
}

export const isConfirmPasswordForm = (name: string) => {
  return function isConfirmPassword(value: string, values: any) {
    return value === values[name];
  }
}

export class SFMessageValidator {
  private static messageErrors: { [propName: string]: string } = {
    isRequiredForm: "Le champs est obligatoire",
    isNotEmailExistForm: "Email exist déjà",
    isEmailForm: "L'email n'est pas valide",
    isConfirmPassword: "Le mot de passe n'est pas identique"
  }

  static getMessageError(fn: Function) {
    const name = fn.name;
    const message = SFMessageValidator.messageErrors[name];
    if (message) {
      return message;
    }

    return `Warning: La fonction de validation ${name} n'a pas de message d'erreur défini`;
  }

}
