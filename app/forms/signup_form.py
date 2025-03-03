from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, ValidationError, Length, EqualTo
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def password_exists(form, field):
    # Checking if password is provided
    password = field.data
    if not password:
        raise ValidationError('Password is required.')


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), user_exists])
    password = PasswordField('password', validators=[DataRequired(), Length(min=5, message='Password must be at least 5 characters long')])
    confirm_password = PasswordField('confirm_password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    bio = StringField('bio', validators=[DataRequired(), Length(max=255)])
