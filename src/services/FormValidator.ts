class FormValidator {

    requiredMessage = "Pole wymagane"
    minLengthMessage = "Zbyt mała liczba znaków"
    maxLengthMessage = "Zbyt duża liczba znaków"
    smallLetterMessage = "Wymagana co najmniej jedna mała litera"
    upperLetterMessage = "Wymagana co najmniej jedna duża litera"
    digitMessage = "Wymagana co najmniej jedna cyfra"
    emailMessage = "Niepoprawny e-mail"

    checkIfIsRequired = (text: string) => {
        return text && !/^\s*$/.test(text)
    }

    checkMinLength = (text: string, minLength: number) => {
        return text.length >= minLength
    }

    checkMaxLength = (text: string, maxLength: number) => {
        return text.length <= maxLength
    }

    checkContainsSmallLetter = (text: string) => {
        return /[a-z]/.test(text)
    }

    checkContainsUpperLetter = (text: string) => {
        return /[A-Z]/.test(text)
    }

    checkContainsDigit = (text: string) => {
        return /[0-9]/.test(text)
    }

    checkEmail = (text: string) => {
        return /\S+@\S+\.\S+/.test(text)
    }
}

export default new FormValidator();