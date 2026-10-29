import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

load_dotenv()

engine = create_async_engine(os.getenv("DATABASE_URL"), echo=False)
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)
Base = declarative_base()


async def get_db():
    async with SessionLocal() as session:
        yield session