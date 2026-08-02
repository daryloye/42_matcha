export const getPictureSrc = (picture: string | null) => {
    if (!picture) return undefined;
    
    if (picture.startsWith('/uploads/')) {
        return `${import.meta.env.VITE_API_URL}${picture}`
    }
    
    return picture;
}