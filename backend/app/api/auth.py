from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
import random
import string
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

@router.post("/send-verification-code", response_model=schemas.Msg)
def send_verification_code(email: str, db: Session = Depends(deps.get_db)):
    user = crud.user.get_by_email(db, email=email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    verification_code = generate_verification_code()
    
    # 在这里存储验证码,可以使用Redis或数据库
    # 为了简单起见,这里我们假设有一个函数来存储验证码
    crud.user.store_verification_code(db, email, verification_code)
    
    # 使用SendGrid发送邮件
    sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
    from_email = Email(settings.SENDGRID_SENDER_EMAIL)
    to_email = To(email)
    subject = "Your Verification Code"
    content = Content("text/plain", f"Your verification code is: {verification_code}")
    mail = Mail(from_email, to_email, subject, content)
    
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"msg": "Verification code sent successfully"}

@router.post("/verify-and-register", response_model=schemas.Token)
def verify_and_register(user_in: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    stored_code = crud.user.get_verification_code(db, user_in.email)
    if stored_code != user_in.verification_code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    user = crud.user.create(db, obj_in=user_in)
    access_token = security.create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.Token)
async def register(user_in: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    print(f"Received registration request for email: {user_in.email}")
    print(f"User data: {user_in.dict()}")
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        print(f"User with email {user_in.email} already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    try:
        user = crud.user.create(db, obj_in=user_in)
        print(f"User created successfully: {user.id}")
        access_token = security.create_access_token(user.id)
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Error during user creation: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    print(f"Login attempt for username: {form_data.username}")
    user = crud.user.authenticate(db, email=form_data.username, password=form_data.password)
    if not user:
        print(f"Authentication failed for username: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    print(f"Authentication successful for username: {form_data.username}")
    access_token = security.create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}