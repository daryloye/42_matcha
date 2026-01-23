export const isValidEmail = (password: string): boolean => {
    if password.length < 9
}

const commonPasswords = [
    'password', 'password123', 'qwerty', 'abc123', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'sunshine',
    'princess', 'football', 'baseball', 'whatever', 'freedom', 
    'letmein', 'admin', 'welcome', 'iloveyou', 'password1',
    'Password123', 'P@ssword', 'P@ssw0rd', 'password!',
    'password123!'
]

export const isValidPassword = (password: string): boolean => {

    const passwordLength = password.length;
    let uppcaseExist = false;
    let lowercaseExist = false;
    let intExist = false;
    let specialcharExist = false;
    let i = 0;

    if (passwordLength < 8)
        return false
    if (commonPasswords.includes(password.toLowerCase()))
        return false
    while (i < passwordLength)
    {   
        const character = password.charAt(i)
        if (/[A-Z]/.test(character)) 
            uppcaseExist = true;
        if (/[a-z]/.test(character)) 
            lowercaseExist = true;
        if (/[0-9]/.test(character))
            intExist = true;
        if (/[^a-zA-Z0-9]/.test(character))
            specialcharExist = true;
        i++;
    }
    return (uppcaseExist && lowercaseExist && intExist && specialcharExist)
};

    // Check:
    // - At least 8 characters long
    // - Contains uppercase and lowercase
    // - Contains numbers
    // - Contains special characters
    // - NOT a common English word