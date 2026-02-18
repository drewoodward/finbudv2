from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
from datetime import datetime
import model
from database import SessionLocal, engine
from sqlalchemy.orm import Session

app = FastAPI()
model.Base.metadata.create_all(bind=engine)

class AccountBase(BaseModel):
    username: str
    password: str
    email: str
    created_at: datetime
    #last_login: datetime
    is_active: bool

class StockBase(BaseModel):
    stock_ticker: str
    stock_name: str
    sector: str
    industry: str
    market_cap: float
    current_price: float
    last_updated: datetime

class StockHistoryBase(BaseModel):
    history_id: int
    stock_ticker: str
    data: datetime
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int

class WatchlistBase(BaseModel):
    watchlist_id: int
    username: str
    stock_ticker: str
    added_at: datetime
    #notes: str

class PredictionBase(BaseModel):
    prediction_id: int
    username: str
    stock_ticker: str
    predicted_price: float
    prediction_date: datetime
    confidence: float
    prediction_timestamp: datetime
    
class PortfolioBase(BaseModel):
    portfolio_id: int
    username: str
    stock_ticker: str
    quantity: int
    average_price: float
    purchase_date: datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/accounts/")
async def create_user(account: AccountBase, db: db_dependency):
    db_account = model.Account(username=account.username,
                               password=account.password,
                               email=account.email,
                               created_at=account.created_at,
                               is_active=account.is_active)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return {"message": "User created successfully"}