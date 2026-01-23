export const isValidUserName = (username: string): boolean => {
    const usernameLength = username.length;
    if (usernameLength > 50 || usernameLength < 3)
        return false
    for(let i = 0; i < usernameLength; i++)
    {
        const character = username.charAt(i)
        if(/[^A-Za-z0-9_]/.test(character))
            return false
    }
    return true
}

const commonPasswords = [
    'password', 'password123', 'qwerty', 'abc123', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'sunshine',
    'princess', 'football', 'baseball', 'whatever', 'freedom', 
    'letmein', 'admin', 'welcome', 'iloveyou', 'password1',
    'Password123', 'P@ssword', 'password!', 'password123!'
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



// export const isValidEmail = (password: string): boolean => {
//     let passwordLength = password.length;
//     if (passwordLength < 1)
//         return false

//         return false
// }
