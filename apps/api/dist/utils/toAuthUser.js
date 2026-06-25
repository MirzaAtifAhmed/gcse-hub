export function toAuthUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        currentYear: user.currentYear ?? undefined,
    };
}
