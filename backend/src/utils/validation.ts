export const isValidUserName = (username: string): boolean => {
    
    const usernameLength = username.length;
    if (usernameLength < 3 || usernameLength > 50)
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
    'p@ssword', 'password!', 'password123!'
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


export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if(email.length < 1 || email.length > 255)
        return false;
    if(email.includes('..'))
        return false;
    return emailRegex.test(email);
}
/*
^[a-zA-Z0-9._%+-]+: The "local part" (before the @). It allows letters, numbers, dots, underscores, percents, pluses, and hyphens.

@: Must have exactly one "at" symbol.

[a-zA-Z0-9.-]+: The domain name. Allows letters, numbers, dots, and hyphens.

\.: A literal dot before the extension.

[a-zA-Z]{2,}$: The Top Level Domain (TLD). It must be at least 2 letters (like .io, .com, .fr).
*/
// export const isValidEmail = (email: string): boolean => {

//     if(email.includes("..") || !email)
//         return false;
    
//     let emailLength = email.length;
//     if (emailLength < 1 || emailLength > 255)
//         return false
    
//     for(let i = 0; i < emailLength ;i++)
//     {
//         const character = email.charAt(i);
//         if(/^[a-zA-Z0-9._%+-]+/.test(character))
//             return false
//         if(character === "@")
//             break;
//     }
//     for(let i = 0; i < emailLength ; i++)
//     {
//         const character = email.charAt(i)
//         if(character !== "@")
//             continue;

//     }
//     let atCounter = 0;
//     let dotCounter = false;

//     for(let i = 0; i < emailLength; i++)
//     {
//         const character = email.charAt(i);
//         if(character === "@")
//             atCounter += 1;
//         if(character === ".")
//             dotCounter = true;
//         if(atCounter > 1 || !dotCounter)
//             return false;
//     }
//     return true
// }
    // Use a regex pattern to check email format
    // Example: user@example.com should be valid

    