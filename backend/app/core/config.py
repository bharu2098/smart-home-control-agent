from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Smart Home Control Agent"

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GROQ_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()