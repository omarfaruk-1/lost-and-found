const appConfig={
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    JWT_REFRESH_TOKEN:process.env.JWT_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN:process.env.JWT_ACCESS_TOKEN,
    IMAGE_KIT_PRIVET_KEY:process.env.IMAGE_KIT_PRIVET_KEY,
    IMAGE_KIT_PUBLIC_KEY:process.env.IMAGE_KIT_PUBLIC_KEY,
    IMAGE_KIT_ENDPOINT:process.env.IMAGE_KIT_ENDPOINT,
    EMAIL_PASSWORD:process.env.EMAIL_PASSWORD,
    MAIL_HOST:process.env.MAIL_HOST,
    MAIL_PORT:process.env.MAIL_PORT,
    MAIL_USER:process.env.MAIL_USER,
    FRONTEND_URL:process.env.FRONTEND_URL,
    JWT_EMAIL_TOKEN:process.env.JWT_EMAIL_TOKEN,
    JWT_REST_PASS:process.env.JWT_REST_PASS,
}


export default appConfig;