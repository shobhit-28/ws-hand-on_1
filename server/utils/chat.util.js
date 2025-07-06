export const calculateExpiryHours = (isPremium) => {
    const hours = isPremium ? 48 : 24;
    return new Date(Date.now() + hours * 60 * 60 * 1000)
}