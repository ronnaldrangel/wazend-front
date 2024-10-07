export { default } from "next-auth/middleware"

export const config = { matcher: ["/tools", "/profile", "/profile/preferences", "/profile/invoices"] }