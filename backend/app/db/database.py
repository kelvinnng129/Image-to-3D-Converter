from sqlmodel import SQLModel, Session, create_engine
from app.config import settings

# Create engine
engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args={"check_same_thread": False}
)


def init_db():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session."""
    with Session(engine) as session:
        yield session
