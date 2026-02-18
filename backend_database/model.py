from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from database import Base

class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    email = Column(String, unique=True)
    created_at = Column(DateTime, default=DateTime.utcnow)
    is_active = Column(Boolean, default=True)

class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    stock_ticker = Column(String, index=True)
    stock_name = Column(String)
    sector = Column(String)
    industry = Column(String)
    market_cap = Column(Float)
    current_price = Column(Float)
    last_updated = Column(DateTime, default=DateTime.utcnow)

class StockHistory(Base):
    __tablename__ = "stock_history"

    id = Column(Integer, primary_key=True, index=True)
    stock_ticker = Column(String, ForeignKey("stock.stock_ticker"))
    date = Column(DateTime)
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    volume = Column(Float)

class WatchList(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("account.username"))
    stock_ticker = Column(String, ForeignKey("stock.stock_ticker"))
    added_at = Column(DateTime, default=DateTime.utcnow)
    #UniqueConstraint('username_id', 'stock_ticker_id', name='unique_watchlist_entry')

class Prediction(Base):
    __tablename__ = "prediction"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("account.username"))
    stock_ticker = Column(String, ForeignKey("stock.stock_ticker"))
    predicted_price = Column(Float)
    prediction_date = Column(DateTime)
    confidence = Column(Float)
    prediction_timestamp = Column(DateTime, default=DateTime.utcnow)

class Portfolio(Base):
    __tablename__ = "portfolio"

    portfolio_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("account.username"))
    stock_ticker = Column(String, ForeignKey("stock.stock_ticker"))
    quantity = Column(Float)
    average_price = Column(Float)
    purchase_date = Column(DateTime, default=DateTime.utcnow)